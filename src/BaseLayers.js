L.Map.include({

    addBaseLayer: (baselayer) => {
        switch(baselayer) {
            case 'standard' : 
                const baselayer1 = L.tileLayer(
                    "https://api.tiles.mapbox.com/v4/mapbox.emerald/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FnYXJwcmVldDk3IiwiYSI6ImNqaXhlZjgwaDJtb3EzcW1zdDdwMzJkODcifQ.MA2YIv6VpGLLAo-QYUudTA",
                    {
                        attribution:
                            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }
                ).addTo(map);
                break;
            case 'greyscale' : 
                const baselayer2 = L.tileLayer(
                    "https://a.tiles.mapbox.com/v3/jywarren.map-lmrwb2em/{z}/{x}/{y}.png",
                    {
                        attribution:
                            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }
		      ).addTo(map);
                break;
            case 'streets' :
                const baselayer3 = L.tileLayer(
                    "https://api.tiles.mapbox.com/v4/mapbox.streets-basic/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FnYXJwcmVldDk3IiwiYSI6ImNqaXhlZjgwaDJtb3EzcW1zdDdwMzJkODcifQ.MA2YIv6VpGLLAo-QYUudTA",
                    {
                        attribution:
                            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }
                ).addTo(map);
                break;
            case 'dark' :
                const baselayer4 = L.tileLayer(
                    "https://api.tiles.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FnYXJwcmVldDk3IiwiYSI6ImNqaXhlZjgwaDJtb3EzcW1zdDdwMzJkODcifQ.MA2YIv6VpGLLAo-QYUudTA",
                    {
                        attribution:
                            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }
                )
                baselayer4.addTo(map);
                break;
       }
    }

});