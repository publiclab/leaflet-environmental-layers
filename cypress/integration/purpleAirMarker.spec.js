describe('Purple layer - markers', function() {
  it('adds markers on click', function() {
    cy.openWindow('/example/index.html#lat=43.769&lon=-97.487&zoom=8&layers=Standard')
    cy.wait(500)
    cy.window().then((win) => {
      cy.fixture('purpleMarker').then((data) => {
        cy.stub(win.PurpleAirMarkerLayer, 'requestData', function() {
          win.PurpleAirMarkerLayer.parseData(data);
        })
      })
      cy.get('div#map-purpleair.layers-sub-list.collapse').children('div')
      .last().find('label')
      .click({ force: true })
      cy.get('.leaflet-marker-pane img').should('have.length', 2)
    }) 
  })

  it('should have the layer name added to the hash', function() {
    cy.hash().should('include', ',purpleairmarker')
  })

  it('has default markers in default mode', function() {
    cy.get('.leaflet-marker-pane img').invoke('attr', 'src').should('eq', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Location_dot_purple.svg/768px-Location_dot_purple.svg.png')
    cy.get('.leaflet-marker-pane img[src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Location_dot_purple.svg/768px-Location_dot_purple.svg.png"]').should('have.length', 2)
  })

  it('has circle markers in minimal mode', function() {
    cy.server()
    cy.route('GET', 
             'https://www.purpleair.com/data.json?fetchData=true&minimize=true&sensorsActive2=10080&orderby=L&nwlat=45.67548217560647&selat=41.79179268262892&nwlng=-101.03576660156251&selng=-93.93310546875001', 
             'fixture:purpleLayer.json')
    const spy = cy.spy(window.top.aut.PurpleAirMarkerLayer, 'requestData')
    cy.get('[title="Show minimal markers"]').click().then(() => {
      expect(spy).to.be.called
      cy.get('.leaflet-overlay-pane svg g').children().should('have.length', 2)
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke').should('eq', '#7c7c7c')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'fill').should('eq', '#7c22b5')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke-linecap').should('eq', 'round')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke-linecap').should('eq', 'round')
    })
  })

  it('shows popup', function() {
    cy.get('.leaflet-overlay-pane svg g').children().last().click({ force: true })
    cy.get('.leaflet-popup-pane').children().should('have.length', 1)
    cy.get('.leaflet-popup-content').should('contain', 'MandMnorth40')
  })

  it('removes markers from the map and the layer name from the hash when clicked again', function() {
    cy.get('div#map-purpleair.layers-sub-list.collapse').children('div')
      .last().find('label')
      .click({ force: true })
    cy.hash().should('not.include', ',purpleairmarker')
    cy.get('.leaflet-marker-pane img').should('have.length', 0)
    cy.get('.leaflet-overlay-pane svg g').children().should('have.length', 0)
  })
})
