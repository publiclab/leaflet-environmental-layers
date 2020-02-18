describe('Eonet fires layer', function() {
  it('adds markers on click', function() {
    cy.openWindow('/example/index.html#lat=43.00&lon=-83.00&zoom=3&layers=Standard')
    cy.wait(5000)
    cy.window().then((win) => {
      cy.fixture('eonetFiresLayer').then((data) => {
        cy.stub(win.EonetFiresLayer, 'requestData', function() {
          win.EonetFiresLayer.parseData(data);
        })
      })
      
      cy.get('#menu-EONET_Fires label').click({ force: true })
      cy.get('.leaflet-marker-pane').children().should('have.length', 4)
    }) 
  })

  it('should have the layer name added to the hash', function() {
    cy.hash().should('eq', '#lat=43.00&lon=-82.97&zoom=3&layers=Standard,eonetFiresLayer')
  })

  it('has default markers in default mode', function() {
      cy.get('.leaflet-marker-pane img').invoke('attr', 'src').should('eq', 'https://image.flaticon.com/icons/svg/785/785116.svg')
      cy.get('.leaflet-marker-pane img[src="https://image.flaticon.com/icons/svg/785/785116.svg"]').should('have.length', 4)
  })

  it('has circle markers in minimal mode', function() {
    cy.server()
    cy.route('GET', 'https://eonet.sci.gsfc.nasa.gov/api/v2.1/categories/8', 'fixture:eonetFiresLayer.json')
    const spy = cy.spy(window.top.aut.EonetFiresLayer, 'requestData')
    cy.get('[title="Show minimal markers"]').click().then(() => {
      expect(spy).to.be.called
      cy.get('.leaflet-overlay-pane svg g').children().should('have.length', 4)
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke').should('eq', '#7c7c7c')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'fill').should('eq', '#ff421d')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke-linecap').should('eq', 'round')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke-linecap').should('eq', 'round')
    })    
  })

  it('removes markers from the map and the layer name from the hash when clicked again', function() {
    cy.get('#menu-EONET_Fires label').click({ force: true })
    cy.hash().should('eq', '#lat=43.00&lon=-82.97&zoom=3&layers=Standard')
    cy.get('.leaflet-marker-pane').children().should('have.length', 0)
    cy.get('.leaflet-overlay-pane svg g').children().should('have.length', 0)
  })
  
})