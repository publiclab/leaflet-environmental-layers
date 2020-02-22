describe('FractrackerMobile layer', function() {
  it('adds markers on click', function() {
    cy.openWindow('/example/index.html#lat=41.624&lon=-91.626&zoom=5&layers=Standard')
    cy.wait(200)
    cy.window().then((win) => {
      cy.fixture('fractrackerMobile').then((data) => {
        cy.stub(win.FracTracker_mobile, 'requestData', function() {
          win.FracTracker_mobile.parseData(data);
        })
      })
      
      cy.get('#menu-FracTracker_mobile label').click({ force: true })
      cy.get('.leaflet-overlay-pane svg g').children().should('have.length', 2)
    }) 
  })

  it('should have the layer name added to the hash', function() {
    cy.hash().should('eq', '#lat=41.624&lon=-91.626&zoom=5&layers=Standard,fracTrackerMobile')
  })

  it('has default markers in default mode', function() {
    cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke').should('eq', '#e4458b')
    cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'fill').should('eq', '#e4458b')
    cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'fill-opacity').should('eq', '0.2')
    cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke-width').should('eq', '3')
    cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke-linecap').should('eq', 'round')
    cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke-linecap').should('eq', 'round')
  })

  it('has circle markers in minimal mode', function() {
    cy.server()
    cy.route('GET', 'https://cors-anywhere.herokuapp.com/https://api.fractracker.org/v1/data/report?page=1&results_per_page=250&q={"filters":[{"name":"geometry","op":"intersects","val":"SRID=4326;POLYGON((-113.59863281250001 50.93073802371819,-69.65332031250001 50.93073802371819,-69.65332031250001 30.751277776257812,-113.59863281250001 30.751277776257812,-113.59863281250001 50.93073802371819))"}],"order_by":[{"field":"report_date","direction":"desc"},{"field":"id","direction":"desc"}]}', 'fixture:fractrackerMobile.json')
    const spy = cy.spy(window.top.aut.FracTracker_mobile, 'requestData')
    cy.get('[title="Show minimal markers"]').click().then(() => {
      expect(spy).to.be.called
      cy.get('.leaflet-overlay-pane svg g').children().should('have.length', 2)
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke').should('eq', '#e4458b')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'fill').should('eq', '#e4458b')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'fill-opacity').should('eq', '0.2')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke-width').should('eq', '3')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke-linecap').should('eq', 'round')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke-linecap').should('eq', 'round')
    })    
  })

  it('shows popup', function() {
    cy.get('.leaflet-overlay-pane svg g').children().last().click({ force: true })
    cy.get('.leaflet-popup-pane').children().should('have.length', 1)
    cy.get('.leaflet-popup-content').should('contain', '67th and nimbus NE corner ')
  })

  it('removes markers from the map and the layer name from the hash when clicked again', function() {
    cy.get('#menu-FracTracker_mobile label').click({ force: true })
    cy.hash().should('eq', '#lat=41.624&lon=-91.626&zoom=5&layers=Standard')
    cy.get('.leaflet-marker-pane').children().should('have.length', 0)
    cy.get('.leaflet-overlay-pane svg g').children().should('have.length', 0)
  })
})
