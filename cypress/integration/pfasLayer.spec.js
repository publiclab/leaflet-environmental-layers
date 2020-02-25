describe('Pfas layer', function() {
  it('adds markers on click', function() {
    cy.openWindow('/example/index.html#lat=43.000&lon=-92.000&zoom=5&layers=Standard')
    cy.wait(300)
    cy.window().then((win) => {
      cy.fixture('pfasLayer').then((data) => {
        cy.stub(win.PFASTracker, 'requestData', function() {
          win.PFASTracker.parseData(data.feed.entry);
        })
      })
      
      cy.get('#menu-pfaslayer label').click({ force: true })
      cy.get('.leaflet-marker-pane img').should('have.length', 2)
    }) 
  })

  it('should have the layer name added to the hash', function() {
    cy.hash().should('eq', '#lat=43.000&lon=-92.000&zoom=5&layers=Standard,pfasLayer')
  })

  it('has default markers in default mode', function() {
    cy.get('.leaflet-marker-pane img').invoke('attr', 'src').should('eq', 'https://openclipart.org/image/300px/svg_to_png/117253/1297044906.png')
    cy.get('.leaflet-marker-pane img[src="https://openclipart.org/image/300px/svg_to_png/117253/1297044906.png"]').should('have.length', 2)
  })

  it('has circle markers in minimal mode', function() {
    cy.server()
    cy.route('GET', 'https://spreadsheets.google.com/feeds/list/1cjQ3H_DX-0dhVL5kMEesFEKaoJKLfC2wWAhokMnJxV4/1/public/values?alt=json', 'fixture:pfasLayer.json')
    const spy = cy.spy(window.top.aut.PFASTracker, 'requestData')
    cy.get('[title="Show minimal markers"]').click().then(() => {
      expect(spy).to.be.called
      cy.get('.leaflet-overlay-pane svg g').children().should('have.length', 2)
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke').should('eq', '#7c7c7c')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'fill').should('eq', '#b52822')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke-linecap').should('eq', 'round')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke-linecap').should('eq', 'round')
    })    
  })

  it('shows popup', function() {
    cy.get('.leaflet-overlay-pane svg g').children().last().click({ force: true })
    cy.get('.leaflet-popup-pane').children().should('have.length', 1)
    cy.get('.leaflet-popup-content').should('contain', 'Decatur')
  })

  it('removes markers from the map and the layer name from the hash when clicked again', function() {
    cy.get('#menu-pfaslayer label').click({ force: true })
    cy.hash().should('eq', '#lat=43.000&lon=-92.000&zoom=5&layers=Standard')
    cy.get('.leaflet-marker-pane img').should('have.length', 0)
    cy.get('.leaflet-overlay-pane svg g').children().should('have.length', 0)
  })
})
