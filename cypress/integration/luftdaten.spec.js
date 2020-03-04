describe('Luftdaten layer', function() {
  it('adds markers on click', function() {
    cy.openWindow('/example/index.html#lat=51.15&lon=13.45&zoom=4&layers=Standard')
    cy.wait(300)
    cy.window().then((win) => {
      cy.fixture('luftdaten').then((data) => {
        console.log(data)
        cy.stub(win.LuftdatenLayer, 'requestData', function() {
          win.LuftdatenLayer.parseData(data);
        })
      })
      
      cy.get('#menu-luftdaten label').click({ force: true })
      cy.get('.leaflet-marker-pane').children().should('have.length', 2)
    }) 
  })

  it('should have the layer name added to the hash', function() {
    cy.hash().should('eq', '#lat=51.15&lon=13.45&zoom=4&layers=Standard,luftdaten')
  })

  it('has default markers in default mode', function() {
    cy.get('.leaflet-marker-pane img').invoke('attr', 'src').should('eq', 'http://www.myiconfinder.com/uploads/iconsets/256-256-82a679a558f2fe4c3964c4123343f844.png')
    cy.get('.leaflet-marker-pane img[src="http://www.myiconfinder.com/uploads/iconsets/256-256-82a679a558f2fe4c3964c4123343f844.png"]').should('have.length', 2)
  })

  it('has circle markers in minimal mode', function() {
    cy.server({ "status": 200 })
    cy.route('GET', 'https://maps.luftdaten.info/data/v2/data.dust.min.json', 'fixture:luftdaten.json')
    const spy = cy.spy(window.top.aut.LuftdatenLayer, 'requestData')
    cy.get('[title="Show minimal markers"]').click().then(() => {
      expect(spy).to.be.called
      cy.get('.leaflet-overlay-pane svg g').children().should('have.length', 2)
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke').should('eq', '#7c7c7c')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'fill').should('eq', '#4edd51')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke-linecap').should('eq', 'round')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke-linecap').should('eq', 'round')
    })    
  })

  it('shows popup', function() {
    cy.get('.leaflet-overlay-pane svg g').children().last().click({ force: true })
    cy.get('.leaflet-popup-pane').children().should('have.length', 1)
    cy.get('.leaflet-popup-content').should('contain', 'Scotland')
  })

  it('removes markers from the map and the layer name from the hash when clicked again', function() {
    cy.get('#menu-luftdaten label').click({ force: true })
    cy.hash().should('eq', '#lat=51.15&lon=13.45&zoom=4&layers=Standard')
    cy.get('.leaflet-marker-pane').children().should('have.length', 0)
    cy.get('.leaflet-overlay-pane svg g').children().should('have.length', 0)
  })
})