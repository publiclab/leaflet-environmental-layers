BlurredLocationDisplay = function BlurredLocationDisplay(options) {

  options = options || {};
 
  options.Interface = options.Interface || require('./ui/Interface.js');
  options.blurredLocation = options.blurredLocation || {};

  options.locations = options.locations || [] ;
  options.source_url = options.source_url || "" ;
  options.JSONparser = options.JSONparser || defaultJSONparser ;
  options.zoom_filter = options.zoom_filter || [[0,5,0] , [5,7,2] , [8,10,4] , [11,18,5]] ;

  options.color_code_markers = options.color_code_markers || false ;
  options.style = options.style || 'both' ;

  let map = options.blurredLocation.map ;
  var InterfaceOptions = options.InterfaceOptions || {};
  InterfaceOptions.blurredLocation = options.blurredLocation;
  var Interface = options.Interface(InterfaceOptions);

  require('./ui/iconColors.js') ;

  function filterCoordinate(lat , lng) {
      current_zoom = map.getZoom() ;

      for(let i=0 ; i < options.zoom_filter.length ; i++){
        if(current_zoom >= options.zoom_filter[i][0] && current_zoom <= options.zoom_filter[i][1])
        {
          let afterDecimal = lat.toString().split(".")[1] ;
          let precision = 0 ; 
          if(typeof afterDecimal === "undefined") {
            precision = 0 ; 
          }
          else{
            precision = afterDecimal.length ;
          }
          if(precision >= options.zoom_filter[i][2]){
            return true ;
          }
          else{
            return false ; 
          }
        }
      }

      return false ;
  }

  function defaultJSONparser(data)
  {
      parsed_data = [] ; 
      if (!!data.items) {
        for (i = 0 ; i < data.items.length ; i++) {
          let obj = {} ;
          obj["id"] = data.items[i].doc_id ;
          obj["url"] = data.items[i].doc_url;
          obj["latitude"] = data.items[i].latitude ;
          obj["longitude"] = data.items[i].longitude ;
          obj["title"] = data.items[i].doc_title ;
          parsed_data[parsed_data.length] = obj ;
        }
      }
      return parsed_data ;   
  }

  var all_markers_map = new Map() ; // passed to gridCenterRectangle --- contains all markers fetched till now !  
  var locations_markers_array = [] ; 
  var SourceUrl_markers_array = [] ; // contains currently visible markers on map only !                            
  var SourceUrl_id_map = new Map() ; // separate hash map because 'ids' of locations_markers and SourceURL array may be same .

  function removeAllMarkers(markers_array) {
    for(i in markers_array){
      map.removeLayer(markers_array[i]) ;
    }
    markers_array = [] ;
    markers_array.length = 0 ; 
    SourceUrl_id_map.clear() ;
    return markers_array ; 
  }

  function IconColor(precision){
    if (options.color_code_markers === false) {
      return new L.Icon.BlackIcon() ;
    }
    if(precision === 0){
       return new L.Icon.BlueIcon() ;
    }
    else if(precision === 1){
      return new L.Icon.RedIcon() ;
    }
    else if(precision === 2){
      return new L.Icon.OrangeIcon() ;
    }
    else if(precision === 3){
      return new L.Icon.GreenIcon() ;
    }
    else if(precision === 4){
      return new L.Icon.BlackIcon() ;
    }
    else if(precision === 5){
      return new L.Icon.GreyIcon() ;
    }
    return new L.Icon.YellowIcon() ;
  }
  
  function fetchLocationData(isOn) {
    if(isOn === true) {
      for(let i=0 ; i < options.locations.length ; i++){
        var latitude = options.locations[i][0] ; 
        var longitude = options.locations[i][1] ; 
        if(filterCoordinate(latitude , longitude)){
              afterDecimal = latitude.toString().split(".")[1] ;
              precision = 0 ; 
              if(typeof afterDecimal !== "undefined") {
                precision = afterDecimal.length ;
              }
              var icon_color = IconColor(precision) ;
              var m = L.marker([latitude, longitude] , {icon: icon_color}) ; 
              all_markers_map.set(i , m) ; 
              if(options.style === 'markers' || options.style === 'both'){
                m.addTo(map).bindPopup("Precision : " + precision) ;
              }
              locations_markers_array[locations_markers_array.length] = m ;
        }
      } 
    }
  }

  function fetchSourceUrlData(isOn) {
    if(isOn === true) {
      var NWlat = map.getBounds().getNorthWest().lat ;
      var NWlng = map.getBounds().getNorthWest().lng ;
      var SElat = map.getBounds().getSouthEast().lat ;
      var SElng = map.getBounds().getSouthEast().lng ;

      source_url = options.source_url + "?nwlat=" + NWlat + "&selat=" + SElat + "&nwlng=" + NWlng + "&selng=" + SElng ; 

      $.getJSON(source_url , function (data) {
            
            var parsed_data = options.JSONparser(data) ;  // JSONparser defined by user used here !
            
            for(i=0 ; i<parsed_data.length ; i++){
              var obj = parsed_data[i] ;
              var id = obj["id"] ;
              var url = obj["url"] ;
              var latitude = obj["latitude"] ;
              var longitude = obj["longitude"] ;
              var title = obj["title"] ;

              if(filterCoordinate(latitude , longitude) && typeof(SourceUrl_id_map.get(id)) === "undefined") {
                afterDecimal = latitude.toString().split(".")[1] ;
                precision = 0 ; 
                if(typeof afterDecimal !== "undefined") {
                  precision = afterDecimal.length ;
                }
                var icon_color = IconColor(precision) ;
                var m = L.marker([latitude,longitude], {
                  icon: icon_color
                }) ;
                SourceUrl_id_map.set(id , m) ;
                all_markers_map.set(id , m) ;
                if(options.style === 'markers' || options.style === 'both'){
                  m.addTo(map).bindPopup("<a href=" + url + ">" + title + "</a> <br> Precision : " + precision) ;
                }
                SourceUrl_markers_array[SourceUrl_markers_array.length] = m ;  
              }  
            }
            if(options.style === 'heatmap' || options.style === 'both'){
              ColorRectangles() ;
            }
      });  
    }
  }

  // We need these functions to know the markers currently visible on the map .
  // We need different arrays here to avoid RACE CONDITION between different listerners !
  function return_locations_markers_array(){
    return locations_markers_array ; 
  }
  function return_SourceUrl_markers_array(){
    return SourceUrl_markers_array ; 
  }

  // contains all markers fetched till now !  
  function return_all_markers_map(){
    return all_markers_map ; 
  }

  function getVisibleLocations()
  {
    var locations_markers = return_locations_markers_array() ;
    var sourceurl_markers = return_SourceUrl_markers_array() ; 
    var visibleLocations = [] ;

    for(let i=0 ; i<locations_markers.length ; i++){
      var location = {
        lat: locations_markers[i]._latlng.lat ,
        lng: locations_markers[i]._latlng.lng ,
        source: 'local'
      } ;
      visibleLocations[visibleLocations.length] = location ;
    }

    for(let i=0 ; i<sourceurl_markers.length ; i++){
      var location = {
        lat: sourceurl_markers[i]._latlng.lat ,
        lng: sourceurl_markers[i]._latlng.lng ,
        source: 'remote'
      } ;
      visibleLocations[visibleLocations.length] = location ;
    }
    
    return visibleLocations ;
  }

  function location_listener_helper(){
      let markers_array = return_locations_markers_array() ;
      let m_array = markers_array ;
      markers_array = removeAllMarkers(markers_array) ;
      m_array.length = 0 ;
      fetchLocationData(true) ; 
      if(options.style === 'heatmap' || options.style === 'both'){
        ColorRectangles() ;
      }
  }

  function source_listener_helper(){
      let markers_array = return_SourceUrl_markers_array() ;
      let m_array = markers_array ;
      markers_array = removeAllMarkers(markers_array) ;
      m_array.length = 0 ;
      fetchSourceUrlData(true) ; 
      if(options.style === 'heatmap' || options.style === 'both'){
        ColorRectangles() ;
      }
  }


  if(options.locations.length !== 0) {
    map.on("zoomend" , location_listener_helper) ;
    map.on("moveend" , location_listener_helper) ;

  }

  if(options.source_url !== "") {
    map.on("zoomend" , source_listener_helper) ;
    map.on("moveend" , source_listener_helper) ;
  }

  let rectangle_options = {
    return_all_markers_map: return_all_markers_map,
    blurredLocation: options.blurredLocation,
    style: options.style
  }
  options.gridCenterRectangle = require('./ui/gridCenterRectangle.js') ;
  options.gridCenterRectangle = options.gridCenterRectangle(rectangle_options) ;
  let ColorRectangles = options.gridCenterRectangle.ColorRectangles ;
  let removeAllRectangles = options.gridCenterRectangle.removeAllRectangles ;

  function removeLBLD()
  {
    //deactivate listeners
    map.off("zoomend" , location_listener_helper) ;
    map.off("moveend" , location_listener_helper) ;
    map.off("zoomend" , source_listener_helper) ;
    map.off("moveend" , source_listener_helper) ;
    
    // remove grid using LBL 
    options.blurredLocation.setBlurred(false) ;
   
    //remove marker of LBL 
    options.blurredLocation.disableCenterMarker() ;
    // remove rectangles
    removeAllRectangles() ;

    //remove all markers
    removeAllMarkers(return_locations_markers_array()) ;
    removeAllMarkers(return_SourceUrl_markers_array()) ;

    console.log("Success") ;
  }
  
  function getMarkersOfPrecision(precision){

    var visibleLocations = getVisibleLocations() ;
    var filtered_markers = [] ;
    if(typeof precision === "object"){
      for(let i=0 ; i < visibleLocations.length ; i++){
        let after_decimal = visibleLocations[i].lat.toString().split(".")[1] ;
        let precision_of_marker = 0 ; 
        if(typeof after_decimal !== "undefined") {
          precision_of_marker = after_decimal.length ;
        }
        if(precision_of_marker >= precision.min && precision_of_marker <= precision.max){
          filtered_markers[filtered_markers.length] = visibleLocations[i] ; 
        }
      }  
    } 
    else{
      for(let i=0 ; i < visibleLocations.length ; i++){
        let after_decimal = visibleLocations[i].lat.toString().split(".")[1] ;
        let precision_of_marker = 0 ; 
        if(typeof after_decimal !== "undefined") {
            precision_of_marker = after_decimal.length ;
        }
        if(precision_of_marker === precision){
         filtered_markers[filtered_markers.length] = visibleLocations[i] ; 
        }
      }
    }
    
    return filtered_markers ;
  }

  function filterCoordinatesToPrecison(precision)
  {
    let locations = options.locations ; 
    let filtered_locations = [] ; 

    for(let i=0 ; i < locations.length ; i++){
      let after_decimal = locations[i][0].toString().split(".")[1] ;
      let precision_of_coordinate = 0 ; 
      if(typeof after_decimal !== "undefined") {
          precision_of_coordinate = after_decimal.length ;
      }
      if(precision_of_coordinate === precision){
        filtered_locations[filtered_locations.length] = locations[i] ; 
      }  
    }
    return filtered_locations ;
  }

  return {
    getVisibleLocations: getVisibleLocations,
    removeAllMarkers: removeAllMarkers,
    Interface: Interface,
    getMarkersOfPrecision: getMarkersOfPrecision, 
    filterCoordinatesToPrecison: filterCoordinatesToPrecison,
    removeLBLD: removeLBLD
  }
}

exports.BlurredLocationDisplay = BlurredLocationDisplay;