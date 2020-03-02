describe('OpenAQ layer', function() {
  it('adds markers on click', function() {
    cy.openWindow('/example/index.html#lat=44.31&lon=-89.65&zoom=4&layers=Standard')
    cy.wait(300)
    cy.window().then((win) => {
      cy.fixture('openaq').then((data) => {
        console.log(data)
        cy.stub(win.OpenAqLayer, 'requestData', function() {
          win.OpenAqLayer.parseData(data.results);
        })
      })
      
      cy.get('#menu-openaq label').click({ force: true })
      cy.get('.leaflet-marker-pane').children().should('have.length', 2)
    }) 
  })

  it('should have the layer name added to the hash', function() {
    cy.hash().should('eq', '#lat=44.31&lon=-89.65&zoom=4&layers=Standard,openaq')
  })

  it('has default markers in default mode', function() {
      cy.get('.leaflet-marker-pane img').invoke('attr', 'src').should('eq', 'https://i.stack.imgur.com/6cDGi.png')
      cy.get('.leaflet-marker-pane img[src="https://i.stack.imgur.com/6cDGi.png"]').should('have.length', 2)
  })

  it('has circle markers in minimal mode', function() {
    cy.server()
    cy.route('GET', 'https://api.openaq.org/v1/latest?limit=5000', 'fixture:openaq.json')
    const spy = cy.spy(window.top.aut.OpenAqLayer, 'requestData')
    cy.get('[title="Show minimal markers"]').click().then(() => {
      expect(spy).to.be.called
      cy.get('.leaflet-overlay-pane svg g').children().should('have.length', 2)
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke').should('eq', '#7c7c7c')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'fill').should('eq', '#912d25')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke-linecap').should('eq', 'round')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke-linecap').should('eq', 'round')
    })    
  })

  it('shows popup', function() {
    cy.get('.leaflet-overlay-pane svg g').children().last().click({ force: true })
    cy.get('.leaflet-popup-pane').children().should('have.length', 1)
    cy.get('.leaflet-popup-content').should('contain', 'Whitmore')
  })

  it('removes markers from the map and the layer name from the hash when clicked again', function() {
    cy.get('#menu-openaq label').click({ force: true })
    cy.hash().should('eq', '#lat=44.31&lon=-89.65&zoom=4&layers=Standard')
    cy.get('.leaflet-marker-pane').children().should('have.length', 0)
    cy.get('.leaflet-overlay-pane svg g').children().should('have.length', 0)
  })
  
})