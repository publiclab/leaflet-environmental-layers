describe('OSM Landfill, Mines and Quarries layer', function() {
  it('adds markers on click', function() {
    cy.openWindow('/example/index.html#lat=42.7029&lon=-99.1509&zoom=11&layers=Standard')
    cy.wait(300)
    cy.window().then((win) => {
      const stub = cy.stub(win.OSMLandfillMineQuarryLayer, 'requestData')
      cy.get('#map-menu-osmLandfillMineQuarryLayer label').click({ force: true }).then(() => {
        expect(stub).to.be.called
      }) 
    }) 
  })

  it('should have the layer name added to the hash', function() {
    cy.hash().should('eq', '#lat=42.7029&lon=-99.1509&zoom=11&layers=Standard,osmLandfillMineQuarryLayer')
  })

  it('removes layer name from the hash when clicked again', function() {
    cy.get('#map-menu-osmLandfillMineQuarryLayer label').click({ force: true })
    cy.hash().should('eq', '#lat=42.7029&lon=-99.1509&zoom=11&layers=Standard')
  })
})  