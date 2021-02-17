describe('Skytruth layer', function() {
  it('adds markers on click', function() {
    cy.openWindow('/example/index.html#lat=41.6283&lon=-91.7235&zoom=10&layers=Standard')
    cy.wait(300)
    cy.window().then((win) => {
      cy.get('.leaflet-overlay-pane').children().should('have.length', 0)
      cy.fixture('skytruth').then((data) => {
        cy.stub(win.SkyTruth, 'requestData', function() {
          win.SkyTruth.parseData(data);
        })
      })
      cy.get('#map-menu-skytruth label').click({ force: true })
      cy.get('.leaflet-overlay-pane').children().should('have.length', 1)
    }) 
  })

  it('should have the layer name added to the hash', function() {
    cy.hash().should('eq', '#lat=41.6283&lon=-91.7235&zoom=10&layers=Standard,skytruth')
  })

  it('has default markers in default mode', function() {
    cy.get('.leaflet-overlay-pane svg').should('have.length', 1)
  })

  it('has circle markers in minimal mode', function() {
    cy.server()
    cy.intercept('https://skytruth-alerts2.appspot.com/api/getalerts/', { fixture: 'skytruth.json' })
    const spy = cy.spy(window.top.aut.SkyTruth, 'requestData')
    cy.get('[title="Show minimal markers"]').click().then(() => {
      expect(spy).to.be.called
      cy.get('.leaflet-overlay-pane svg g').children().should('have.length', 2)
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke').should('eq', '#7c7c7c')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'fill').should('eq', '#f00')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke-linecap').should('eq', 'round')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke-linecap').should('eq', 'round')
    })    
  })

  it('shows popup', function() {
    cy.get('.leaflet-overlay-pane svg g').children().last().click({ force: true })
    cy.get('.leaflet-popup-pane').children().should('have.length', 1)
    cy.get('.leaflet-popup-content').should('contain', 'Webster')
  })

  it('removes markers from the map and the layer name from the hash when clicked again', function() {
    cy.get('#map-menu-skytruth label').click({ force: true })
    cy.hash().should('eq', '#lat=41.6283&lon=-91.7235&zoom=10&layers=Standard')
    cy.get('.leaflet-marker-pane').children().should('have.length', 0)
    cy.get('.leaflet-overlay-pane svg g').children().should('have.length', 0)
  })
})
