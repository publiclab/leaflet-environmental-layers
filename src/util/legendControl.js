L.Control.LegendControl = L.Control.extend({
  options: {
    position: 'bottomleft',
  },
  
  initialize: function(options) {
    L.Util.setOptions(this, options);
    this._legendElement = L.DomUtil.create('div', 'legend-container');
    this._legendElement.style.display = 'none';
    this._legendURLs = []; //Array of URLs
  },
  
  onAdd: function(map) {
    return this._legendElement;
  },
  
  onRemove: function(map) {
    this._legendURLs = [];
    this._drawLegend();
    this._legendElement.style.display = 'none';
  },
  
  addLegend: function(legendURL) {
    this._legendURLs.push(legendURL);
    this._drawLegend();
    this._legendElement.style.display = 'block';
  },
  
  removeLegend: function(legendURL) {
    var index = this._legendURLs.indexOf(legendURL);
    if(index > -1) {
      this._legendURLs.splice(index, 1); //remove URL from the array
    }    
    if(!this._legendURLs.length) { //if no more URLs
      this._legendElement.style.display = 'none';
    }
    this._drawLegend();
  },
  
  _drawLegend: function() {

    this._legendElement.innerHTML = '';
    var self = this;
    for(var i = 0; i < this._legendURLs.length; i++) {
      var item = L.DomUtil.create('div', 'legend-item', this._legendElement)
      item.innerHTML = '<img src="' + this._legendURLs[i] + '" style="height: 200px;"/>';
      item.style.cssFloat = 'left';
      item.style.margin = '5px';

    }
  }
  
});

L.control.legendControl = function(options) { 
  return new L.Control.LegendControl(options);
}
