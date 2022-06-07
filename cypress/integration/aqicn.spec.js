describe('Aqicn layer', function() {
  it('adds markers on click', function() {
    cy.openWindow('/example/index.html#lat=51.15&lon=13.45&zoom=4&layers=Standard')
    cy.wait(300)
    cy.window().then((win) => {
      cy.fixture('aqicn').then((data) => {
        cy.stub(win.AQICNLayer, 'requestRegionData', function() {
          win.AQICNLayer.parseData(data);
        })
      })

      cy.get('#map-menu-aqicnLayer label').click({ force: true })
      cy.get('.leaflet-marker-pane').children().should('have.length', 2)
    }) 
  })

  it('should have the layer name added to the hash', function() {
    cy.hash().should('eq', '#lat=51.15&lon=13.45&zoom=4&layers=Standard,aqicnLayer')
  })

  it('has default markers in default mode', function() {
    cy.get('.leaflet-marker-pane .leaflet-marker-icon').should('have.class', 'aqiSign')
    cy.get('.leaflet-marker-pane .aqiSign').should('have.length', 2)
  })

  it('has circle markers in minimal mode', function() {
    cy.server()
    cy.route('GET', 'https://api.waqi.info/map/bounds/?latlng=31.052933985705163,-30.498046875000004,65.18303007291382,57.39257812500001&token=566331c289f0aeacd78e0b18362b4bcfa5097572', 'fixture:aqicn.json')
    const spy = cy.spy(window.top.aut.AQICNLayer, 'requestRegionData')
    cy.get('[title="Show minimal markers"]').click().then(() => {
      expect(spy).to.be.called
      cy.get('.leaflet-overlay-pane svg g').children().should('have.length', 2)
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke').should('eq', '#7c7c7c')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke-linecap').should('eq', 'round')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke-linecap').should('eq', 'round')
    })    
  })

  it('shows popup', function() {
    cy.get('.leaflet-overlay-pane svg g').children().last().click({ force: true })
    cy.get('.leaflet-popup-pane').children().should('have.length', 1)
    cy.get('.leaflet-popup-content').should('contain', 'Spain')
  })

  it('removes markers from the map and the layer name from the hash when clicked again', function() {
    cy.get('#map-menu-aqicnLayer label').click({ force: true })
    cy.hash().should('eq', '#lat=51.15&lon=13.45&zoom=4&layers=Standard')
    cy.get('.leaflet-marker-pane').children().should('have.length', 0)
    cy.get('.leaflet-overlay-pane svg g').children().should('have.length', 0)
  })
}) 