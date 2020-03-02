describe('Fractracker layer', function() {
  it('adds markers on click', function() {
    cy.openWindow('/example/index.html#lat=41.624&lon=-89.517&zoom=5&layers=Standard')
    cy.wait(6000)
    cy.window().then((win) => {
      cy.fixture('fractracker').then((data) => {
        console.log(data)
        cy.stub(win.Fractracker, 'requestData', function() {
          win.Fractracker.parseData(data.feed.entry);
        })
      })
      
      cy.get('#menu-fractracker label').click({ force: true })
      cy.get('.leaflet-marker-pane').children().should('have.length', 2)
    }) 
  })

  it('should have the layer name added to the hash', function() {
    cy.hash().should('eq', '#lat=41.624&lon=-89.517&zoom=5&layers=Standard,fractracker')
  })

  it('has default markers in default mode', function() {
    cy.get('.leaflet-marker-pane img').invoke('attr', 'src').should('eq', 'https://www.clker.com/cliparts/2/3/f/a/11970909781608045989gramzon_Barrel.svg.med.png')
    cy.get('.leaflet-marker-pane img[src="https://www.clker.com/cliparts/2/3/f/a/11970909781608045989gramzon_Barrel.svg.med.png"]').should('have.length', 2)
  })

  it('has circle markers in minimal mode', function() {
    cy.server()
    cy.route('GET', 'https://spreadsheets.google.com/feeds/list/19j4AQmjWuELuzn1GIn0TFRcK42HjdHF_fsIa8jtM1yw/o4rmdye/public/values?alt=json', 'fixture:fractracker.json')
    const spy = cy.spy(window.top.aut.Fractracker, 'requestData')
    cy.get('[title="Show minimal markers"]').click().then(() => {
      expect(spy).to.be.called
      cy.get('.leaflet-overlay-pane svg g').children().should('have.length', 2)
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke').should('eq', '#7c7c7c')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'fill').should('eq', '#e8e800')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke-linecap').should('eq', 'round')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke-linecap').should('eq', 'round')
    })    
  })

  it('shows popup', function() {
    cy.get('.leaflet-overlay-pane svg g').children().last().click({ force: true })
    cy.get('.leaflet-popup-pane').children().should('have.length', 1)
    cy.get('.leaflet-popup-content').should('contain', 'Brooklyn')
  })

  it('removes markers from the map and the layer name from the hash when clicked again', function() {
    cy.get('#menu-fractracker label').click({ force: true })
    cy.hash().should('eq', '#lat=41.624&lon=-89.517&zoom=5&layers=Standard')
    cy.get('.leaflet-marker-pane').children().should('have.length', 0)
    cy.get('.leaflet-overlay-pane svg g').children().should('have.length', 0)
  })
})
