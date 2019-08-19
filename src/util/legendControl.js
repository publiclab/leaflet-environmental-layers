L.Control.LegendControl = L.Control.extend({
  options: {
    position: 'bottomleft',
  },
  
  initialize: (options) => {
    L.Util.setOptions(this, options);
    this._legendElement = L.DomUtil.create('div', 'legend-container');
    this._legendElement.style.display = 'none';
    this._legendURLs = []; //Array of URLs
  },
  
  onAdd: map => {
    return this._legendElement;
  },
  
  onRemove: map => {
    this._legendURLs = [];
    this._drawLegend();
    this._legendElement.style.display = 'none';
  },
  
  addLegend: legendURL => {
    this._legendURLs.push(legendURL);
    this._drawLegend();
    this._legendElement.style.display = 'block';
  },
  
  removeLegend: legendURL => {
    let index = this._legendURLs.indexOf(legendURL);
    if(index > -1) {
      this._legendURLs.splice(index, 1); //remove URL from the array
    }    
    if(!this._legendURLs.length) { //if no more URLs
      this._legendElement.style.display = 'none';
    }
    this._drawLegend();
  },
  
  _drawLegend: () =>{

    this._legendElement.innerHTML = '';
    let self = this;
    for(let i = 0; i < this._legendURLs.length; i++) {
      let item = L.DomUtil.create('div', 'legend-item', this._legendElement);
      item.innerHTML = '<img src="' + this._legendURLs[i] + '" style="height: 200px;"/>';
      item.style.cssFloat = 'left';
      item.style.margin = '5px';

    }
  }
  
});

L.control.legendControl = options => new L.Control.LegendControl(options);

