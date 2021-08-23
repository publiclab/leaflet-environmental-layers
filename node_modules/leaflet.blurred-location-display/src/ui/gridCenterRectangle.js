module.exports = function changeRectangleColor(options){

 let map = options.blurredLocation.map ;  
 let rectangles = [] ; 

 function getColorCode(ctr){
    let color = '#ff0000' ;
    if(ctr === 0){
      color = '#F3F0C0' ;
    }
    else if(ctr >=1 && ctr<=10){
      color = '#FFA500' ;
    }
    else if(ctr<=15){
      color = '#faff05' ;
    }
    else if(ctr<=25){
      color = '#FF6347' ; 
    }
    else if(ctr<=35){
      color = '#FF4500' ;
    }
    else if(ctr<=45){
      color = '#FF0000' ;
    }
    else{
      color = '#8B0000' ;
    }
    return color ; 
 }

 function removeAllRectangles(){
   if(typeof options.blurredLocation.getRectangle() !== "undefined"){
    options.blurredLocation.getRectangle().remove() ; 
   }
   for(let i=0 ; i<rectangles.length ; i++){
        rectangles[i].remove() ; 
   }
   rectangles.length = 0 ;
   rectangles = [] ;
 }

 function ColorRectangles()
  { 
     // console.log(options.return_all_markers_map()) ;
     removeAllRectangles() ;
    if(map.getZoom() >= 3 && map.getZoom() <=9){
      drawFullHeatMap() ;
    } 
  }
  if(options.style === 'heatmap' || options.style === 'both'){
    ColorRectangles() ; 
  }

  function calculateMarkersInsideRect(bounds)
  {
    let locations = options.return_all_markers_map() ;
    let markers = [] ; 

    locations.forEach(function(value , key , map){
      if(typeof(value._latlng) != "undefined"){
        let latitude = value._latlng.lat ;
        let longitude = value._latlng.lng ; 
        if(latitude >= bounds[0][0] && latitude <= bounds[1][0] && longitude >= bounds[0][1] && longitude <= bounds[1][1]){
          markers.push(value) ;
        }
      }
    }) ;
        
    return markers ;
  }

  // generates an unordered list of marker links to fill a popup with
  function generatePopupContentsFromMarkers(markers) {
    let popupContents = "<p><b>People within this region:</b></p>";
    popupContents += "<ul>";
    if (markers[0].hasOwnProperty('url') && markers[0].hasOwnProperty('url')) {
      markers.forEach(function(marker) {
        if (marker.hasOwnProperty('url') && marker.hasOwnProperty('url')) {
          popupContents += "<li><a href='https://publiclab.org" + marker.url + "'>@" + marker.title + "</a></li>";
        }
      });
    } else {
      popupContents += "<p>" + markers.length + " people</p>";
    }
    popupContents += "</ul>";
    popupContents += "<p>These people have blurred their location. Learn about <a href='https://publiclab.org/location-privacy'>location privacy here</a>.</p>";
    return popupContents;
  }

  // generated left row of rectangles starting from current_lng to left_lng !
  function leftRectangles(left_lng , current_lng , upper_lat , lower_lat , diff)
  {
    while(current_lng+diff >= left_lng){
      let lat1 = lower_lat ; 
      let lng1 = current_lng ; 

      let lat2 = upper_lat ; 
      let lng2 = current_lng + diff ;

      let bounds = [[lat1,lng1], [lat2,lng2]] ;
      let markers = calculateMarkersInsideRect(bounds) ; 
      let color = getColorCode(markers.length) ;
      let r = L.rectangle(bounds, {color: color , weight: 1})
        .addTo(map);
      if (markers.length > 0) r.bindPopup(generatePopupContentsFromMarkers(markers))
      rectangles[rectangles.length] = r ; 
      
      current_lng = current_lng - diff ; 
     }
  }

  // generated right row of rectangles starting from current_lng to right_lng !
  function rightRectangles(right_lng , current_lng , upper_lat , lower_lat , diff)
  {
    while(current_lng-diff <= right_lng){
      let lat1 = lower_lat ; 
      let lng1 = current_lng ; 

      let lat2 = upper_lat ; 
      let lng2 = current_lng + diff ;

      let bounds = [[lat1,lng1], [lat2,lng2]] ;
      let markers = calculateMarkersInsideRect(bounds) ; 
      let color = getColorCode(markers.length) ;

      let r = L.rectangle(bounds, {color: color , weight: 1})
        .addTo(map);
      if (markers.length > 0) r.bindPopup(generatePopupContentsFromMarkers(markers))
      rectangles[rectangles.length] = r ; 
      
      current_lng = current_lng + diff ; 
     }
  }

  function drawFullHeatMap()
  {
     
     let center_bounds = options.blurredLocation.getRectangle().getBounds() ;
    
     let center_NE = center_bounds.getNorthEast() ;
     let center_SW = center_bounds.getSouthWest() ;
     
     let diff = center_NE.lat - center_SW.lat ; 
    
     let current_SW_lng = center_SW.lng ; 

     let current_upper_lat = center_SW.lat ; 

     while(current_upper_lat <= map.getBounds().getNorthEast().lat){

      current_SW_lng = center_SW.lng ; 
      leftRectangles(map.getBounds().getSouthWest().lng , current_SW_lng , current_upper_lat + diff , current_upper_lat, diff) ;
      rightRectangles(map.getBounds().getNorthEast().lng , current_SW_lng+diff , current_upper_lat + diff , current_upper_lat , diff) ;
      
      current_upper_lat = current_upper_lat + diff ; 
     }

     current_upper_lat = center_SW.lat - diff ; 
     while(current_upper_lat + diff >= map.getBounds().getSouthWest().lat){

      current_SW_lng = center_SW.lng ; 
      leftRectangles(map.getBounds().getSouthWest().lng , current_SW_lng , current_upper_lat + diff , current_upper_lat, diff) ;
      rightRectangles(map.getBounds().getNorthEast().lng , current_SW_lng + diff , current_upper_lat + diff , current_upper_lat , diff) ;
      
      current_upper_lat = current_upper_lat - diff ; 
     }

  }

  return {
    ColorRectangles: ColorRectangles,
    removeAllRectangles: removeAllRectangles
  }
}
