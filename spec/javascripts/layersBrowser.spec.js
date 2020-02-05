describe('Layer Browser Control', function() {
  
  describe('Layers menu exists', function() {

    var mapContainer = document.createElement('div');
    var map = L.map(mapContainer);
    var leafletControl = new L.control.layersBrowser();
    leafletControl.addTo(map);
    
    it('control is not undefined', function() {
      expect(leafletControl).toBeDefined();
    });

    it('control exists in map', function() {
      expect(mapContainer.querySelector('.leaflet-control-layers-menu')).toExist();
    });

  });

  describe('Layers are added to the menu', function() {

    var mapContainer = document.createElement('div');
    var map = L.map(mapContainer).setView([43, -83], 3);
    var leafletControl;
    
    describe('Base layers', function() {
      
      var baselayer1 = L.tileLayer('').addTo(map);
      var baselayer2 = L.tileLayer('').addTo(map);
      
      afterEach(function() {
        map.removeControl(leafletControl);
      });

      afterAll(function() {
        map.removeLayer(baselayer1);
        map.removeLayer(baselayer2);
      });

      it('base layer section hidden when there is only one base layer', function() {
        var baseMaps = {
          'Standard': baselayer1,
        };
        leafletControl = new L.control.layersBrowser(baseMaps).addTo(map);
        
        expect(mapContainer.querySelector('.leaflet-control-layers-base').childNodes).toHaveLength(1);
        expect(mapContainer.querySelector('.leaflet-control-layers-base')).toHaveCss({display: 'none'});

      });

      it('base layer section visible when there is more than one base layers', function() {
        var baseMaps = {
          'Standard': baselayer1,
          'Grey-scale': baselayer2
        };
        leafletControl = new L.control.layersBrowser(baseMaps).addTo(map);
        
        expect(mapContainer.querySelector('.leaflet-control-layers-base').childNodes).toHaveLength(2);
        expect(mapContainer.querySelector('.leaflet-control-layers-base')).not.toHaveCss({display: 'none'});

      });

    });

    describe('Overlays', function() {
      afterEach(function() {
        map.removeControl(leafletControl);
      });
      
      var baselayer1 = L.tileLayer('').addTo(map);
      var baseMaps = {
        'Standard': baselayer1,
      };
    
      it('layers are added to control', function() {
        var overlayMaps = {
          overlay1: L.marker([0, 0]),
          overlay2: L.marker([0, 0])
        }
        
        leafletControl = new L.control.layersBrowser(baseMaps, overlayMaps).addTo(map);
        // console.log(mapContainer.querySelector('.leaflet-control-layers-overlays'));
        expect(mapContainer.querySelector('.leaflet-control-layers-selector')).toExist();
        expect(mapContainer.querySelectorAll('.leaflet-control-layers-overlays input[type=checkbox]')).toHaveLength(2);

      });

      it('layer groups are added to control', function() {
        var overlayMaps = {
          overlay1: L.marker([0, 0]),
          layerGroup1: {
            category: 'group',
            layers: {
              overlay2: L.marker([0, 0]),
              overlay3: L.marker([0, 0])
            }
          }
        }
        
        leafletControl = new L.control.layersBrowser(baseMaps, overlayMaps).addTo(map);
        
        expect(mapContainer.querySelector('.leaflet-control-layers-selector')).toExist();
        expect(mapContainer.querySelectorAll('.leaflet-control-layers-overlays input[type=checkbox]')).toHaveLength(3);

      });

      it('layers can be added to map', function() {
        var overlayMaps = {
          overlay1: L.marker([0, 0]),
          layerGroup1: {
            category: 'group',
            layers: {
              overlay2: L.marker([0, 0]),
              overlay3: L.marker([0, 0])
            }
          }
        }

        leafletControl = new L.control.layersBrowser(baseMaps, overlayMaps).addTo(map);

        var input = mapContainer.querySelectorAll('.leaflet-control-layers-overlays input[type=checkbox]');
        var layersOnMap = Object.keys(map._layers).length;
        
        $( input[0] ).click();
        
        expect(input[0].checked).toEqual(true);
        expect(Object.keys(map._layers).length).toEqual(layersOnMap + 1);

        $( input[1] ).click();
        expect(input[1].checked).toEqual(true);
        expect(Object.keys(map._layers).length).toEqual(layersOnMap + 2);

        $( input[0] ).click();
        $( input[1] ).click();

        expect(input[0].checked).toEqual(false);
        expect(input[1].checked).toEqual(false);
        expect(Object.keys(map._layers).length).toEqual(layersOnMap);

      });

      it('layer elements for single layers exist', function() {
        var overlayMaps = {
          overlay1: L.marker([0, 0]),
        }

        leafletControl = new L.control.layersBrowser(baseMaps, overlayMaps).addTo(map);

        var layerContainer = mapContainer.querySelector('.layer-info-container');
        var infoContainer = layerContainer.querySelector('.layer-data-info');
        
        expect(layerContainer.querySelector('.leaflet-control-layers-selector' )).toExist();
        expect(layerContainer.querySelector('.rounded-circle' )).toExist();
        expect(layerContainer.querySelector('.rounded-circle' )).toHaveCss({'background-color': 'black'});
        expect(layerContainer.querySelector('.report-btn' )).toExist();
        expect(layerContainer.querySelector('.layer-name' )).toExist();
        expect(layerContainer.querySelector('.layer-group-name' )).not.toExist();
        expect(layerContainer.querySelector('.layer-description' )).toExist();
        expect(infoContainer).toExist();
        expect(infoContainer).toContainText('NRT/RT');
        expect(infoContainer.querySelector('.fas.fa-info-circle' )).toExist();

      });

      it('layer elements for layerGroup exist', function() {
        var overlayMaps = {
          layerGroup1: {
            category: 'group',
            layers: {
              overlay2: L.marker([0, 0])
            }
          }
        }

        leafletControl = new L.control.layersBrowser(baseMaps, overlayMaps).addTo(map);

        var layerContainer = mapContainer.querySelector('.layer-info-container');
        var infoContainer = layerContainer.querySelector('.layer-data-info');
        
        expect(layerContainer.querySelector('.leaflet-control-layers-selector' )).not.toExist();
        expect(layerContainer.querySelector('.rounded-circle' )).toExist();
        expect(layerContainer.querySelector('.report-btn' )).toExist();
        expect(layerContainer.querySelector('.layer-name' )).not.toExist();
        expect(layerContainer.querySelector('.layer-group-name' )).toExist();
        expect(layerContainer.querySelector('.layer-description' )).toExist();
        expect(infoContainer).toExist();
        expect(infoContainer).toContainText('NRT/RT');
        expect(infoContainer.querySelector('.fas.fa-info-circle' )).toExist();

      });

      it('List of layers from layerGroup exist', function() {
        var overlayMaps = {
          layerGroup1: {
            category: 'group',
            layers: {
              overlay2: L.marker([0, 0])
            }
          }
        }

        leafletControl = new L.control.layersBrowser(baseMaps, overlayMaps).addTo(map);

        var list = mapContainer.querySelector('.layers-sub-list');

        expect(list).toExist();
        expect(list.querySelector('.leaflet-control-layers-selector')).toExist();
        expect(list.querySelector('.layer-list-name')).toExist();
        expect(list.querySelector('.leaflet-control-layers-separator')).toExist();

      });

      it('displays information from info.json', function() {
        var overlayMaps = {
          'wisconsin': L.marker([0, 0]),
          'odorreport': L.marker([0, 0])
        }

        leafletControl = new L.control.layersBrowser(baseMaps, overlayMaps).addTo(map);

        var layerContainers = mapContainer.querySelectorAll('.layer-info-container');
        var infoContainer = layerContainers[0].querySelector('.layer-data-info');

        expect(layerContainers[0].querySelector('.rounded-circle' )).toHaveCss({'background-color': 'rgb(115, 156, 207)'});
        expect(layerContainers[0].querySelector('.report-btn' )).toHaveClass('invisible');
        expect(layerContainers[1].querySelector('.report-btn' )).not.toHaveClass('invisible');
        expect(layerContainers[0].querySelector('.layer-description' )).toContainText('Sand mine operators or landowners');
        expect(mapContainer.querySelector('.layers-sub-list')).not.toExist();
        expect(infoContainer.querySelector('span')).toHaveClass('invisible');

      });

      it('displays layerGroup information from info.json', function() {
        var overlayMaps = {
          'openWeatherMap': {
            category: 'group',
            layers: {
              'Clouds': L.marker([0, 0]),
              'temp': L.marker([0, 0])
            }
          }
        }

        leafletControl = new L.control.layersBrowser(baseMaps, overlayMaps).addTo(map);

        var layerContainer = mapContainer.querySelector('.layer-info-container');
        var infoContainer = layerContainer.querySelector('.layer-data-info');
        var layerGroupList = mapContainer.querySelector('.layers-sub-list');
        
        expect(layerContainer.querySelector('.rounded-circle' )).toHaveCss({'background-color': 'rgb(0, 163, 254)'});
        expect(layerContainer.querySelector('.report-btn' )).toHaveClass('invisible');
        expect(layerContainer.querySelector('.layer-description' )).toContainText('Weather information');
        expect(infoContainer.querySelector('span')).not.toHaveClass('invisible');
        expect(layerGroupList).toExist();
        expect(layerGroupList.querySelectorAll('input[type=checkbox]')).toHaveLength(2);

      });

    });

  });

});
