describe('embed control properties', function() {
  var defaultOptions = {
    position: 'topleft',
    hostname: 'publiclab.github.io',
  }

  describe('default properties', function() {
    var control = new L.control.embed();

    it('uses default options when no options are passed in', function() {
      expect(control.options.position).toEqual(defaultOptions.position);
      expect(control.options.hostname).toEqual(defaultOptions.hostname);
    });

    it('generates correct embed code with default hostname', function() {
      var matchCode = '<iframe style="border:none;" width="100%" height="900px" src="//publiclab.github.io/leaflet-environmental-layers' + window.location.pathname + window.location.hash +'"></iframe>';
  
      expect(control.generateCode()).toEqual(matchCode);
    });
  });
  
  describe('passed in properties', function() {
    var options = {
      hostname: 'placeholder.com'
    };
    var control = new L.control.embed(options);

    it('overrides default options when options are passed in', function() {
      expect(control.options.position).toEqual(defaultOptions.position);
      expect(control.options.hostname).toEqual(jasmine.any(String))
      expect(control.options.hostname).toEqual(options.hostname);
    });
  
    it('overrides default hostname in the embed code with custom hostname', function() {
      var matchCode = '<iframe style="border:none;" width="100%" height="900px" src="//placeholder.com/leaflet-environmental-layers' + window.location.pathname + window.location.hash +'"></iframe>';
  
      expect(control.generateCode()).toEqual(matchCode);
    });
  });
});

describe('embed control in the DOM', function() {
  
  beforeEach(function() {
    loadFixtures('embedControl.html');
  });
  var control = new L.control.embed();
  it('adds embed control to the DOM', function() {
    expect($('#map')).toContainHtml(control.onAdd())
  });

  it('handles a click event', function() {
    var spyEvent = spyOnEvent('.leaflet-control-embed', 'click');
   
    $('.leaflet-control-embed')[0].click();
    expect('click').toHaveBeenTriggeredOn('.leaflet-control-embed');
    expect(spyEvent).toHaveBeenTriggered();
  });

  it('triggers window prompt', function() {
    var matchCode = '<iframe style="border:none;" width="100%" height="900px" src="//publiclab.github.io/leaflet-environmental-layers' + window.location.pathname + window.location.hash +'"></iframe>';

    spyOn(window, 'prompt').and.returnValue();

    $('.leaflet-control-embed')[0].click();

    expect(window.prompt.calls.mostRecent().args).toEqual(['Use this HTML code to embed this map on another site.', matchCode]);
  });
});
