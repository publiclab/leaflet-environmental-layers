L.LayerGroup.PLpeopleLayer = L.LayerGroup.extend(

    {
        options: {
            url: 'https://publiclab.org/api/srch/nearbyPeople',
            clearOutsideBounds: false ,
        },

        initialize: (options) => {
            options = options || {};
            L.Util.setOptions(this, options);
            this._layers = {};
        },

        onAdd: (map) => {
           
            this._map = map ;
            this.blurred_options = {
                map: this._map
            }
            this.BlurredLocation = new BlurredLocation(this.blurred_options);
            this.locations = [[23.1 , 77.1]] ; // testing marker
            this.options_display = {
                blurredLocation: this.BlurredLocation,
                locations: this.locations,
                source_url: "https://publiclab.org/api/srch/nearbyPeople",
                color_code_markers: false, // by default this is false .
                style: 'both' // or 'heatmap' or 'markers' , by default is 'both'
            }

            this.blurredLocationDisplay = new BlurredLocationDisplay(this.options_display);
        },

        onRemove:  (map) => {
          
            this._layers = {} ;
            this.blurredLocationDisplay.removeLBLD() ;
            var lbld =  this.blurredLocationDisplay ;
            setTimeout(() => { lbld.removeLBLD() ;}, 2000) ;
            setTimeout(() => { lbld.removeLBLD() ;}, 5000) ;
            setTimeout(() => { lbld.removeLBLD() ;}, 7000) ;
            setTimeout(() => { lbld.removeLBLD() ;}, 10000) ;
        },
    }
);


L.layerGroup.pLpeopleLayer = (options) => {
    return new L.LayerGroup.PLpeopleLayer(options) ;
};
