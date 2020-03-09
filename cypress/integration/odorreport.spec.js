describe('Odor report layer', function() {
  it('adds markers on click', function() {
    cy.openWindow('/example/index.html#lat=40.499&lon=-5.010&zoom=8&layers=Standard')
    cy.wait(300)
    cy.window().then((win) => {
      cy.fixture('odorreport').then((data) => {
        cy.stub(win.OdorReport, 'requestData', function() {
          win.OdorReport.parseData(data);
        })
      })
      cy.get('#menu-odorreport label').click({ force: true })
      cy.get('.leaflet-marker-pane').children().should('have.length', 2)
    }) 
  })

  it('should have the layer name added to the hash', function() {
    cy.hash().should('eq', '#lat=40.499&lon=-5.010&zoom=8&layers=Standard,odorreport')
  })

  it('has default markers in default mode', function() {
    cy.get('.leaflet-marker-pane img').invoke('attr', 'src').should('eq', 'https://www.clker.com/cliparts/T/3/6/T/S/8/ink-splash-md.png')
    cy.get('.leaflet-marker-pane img[src="https://www.clker.com/cliparts/T/3/6/T/S/8/ink-splash-md.png"]').should('have.length', 2)
  })

  it('has circle markers in minimal mode', function() {
    cy.server()
    cy.route('GET', 'https://odorlog.api.ushahidi.io/api/v3/posts/', 'fixture:odorreport.json')
    const spy = cy.spy(window.top.aut.OdorReport, 'requestData')
    cy.get('[title="Show minimal markers"]').click().then(() => {
      expect(spy).to.be.called
      cy.get('.leaflet-overlay-pane svg g').children().should('have.length', 2)
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke').should('eq', '#7c7c7c')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'fill').should('eq', '#ff00ff')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke-linecap').should('eq', 'round')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke-linecap').should('eq', 'round')
    })    
  })

  it('shows popup', function() {
    cy.get('.leaflet-overlay-pane svg g').children().last().click({ force: true })
    cy.get('.leaflet-popup-pane').children().should('have.length', 1)
    cy.get('.leaflet-popup-content').should('contain', 'COLLADO VILLALBA')
  })

  it('removes markers from the map and the layer name from the hash when clicked again', function() {
    cy.get('#menu-odorreport label').click({ force: true })
    cy.hash().should('eq', '#lat=40.499&lon=-5.010&zoom=8&layers=Standard')
    cy.get('.leaflet-marker-pane').children().should('have.length', 0)
    cy.get('.leaflet-overlay-pane svg g').children().should('have.length', 0)
  })
})
