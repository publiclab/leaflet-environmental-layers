describe('Unearthing layer', function() {
  it('adds markers on click', function() {
    cy.openWindow('/example/index.html#lat=51.15&lon=13.45&zoom=4&layers=Standard')
    cy.wait(300)
    cy.window().then((win) => {
      const stub = cy.stub(win.Unearthing, 'requestData')
      cy.get('#menu-Unearthing label').click({ force: true }).then(() => {
        expect(stub).to.be.called
      })
    }) 
  })

  it('should have the layer name added to the hash', function() {
    cy.hash().should('eq', '#lat=51.15&lon=13.45&zoom=4&layers=Standard,Unearthing')
  })

  it('removes layer name from the hash when clicked again', function() {
    cy.get('#menu-Unearthing label').click({ force: true })
    cy.hash().should('eq', '#lat=51.15&lon=13.45&zoom=4&layers=Standard')
  })
})  