describe('Hashes update on demo page', function() {
  it('changes hash on map movement', function() {
    cy.openWindow('/example/index.html#lat=43.00&lon=-83.00&zoom=3&layers=Standard');
    cy.wait(5000).then(() => {
      cy.window().its('map').invoke('setView',[38.694, -97.921], 6)
      cy.wait(2000).then(() => {
        cy.hash().should('equal', '#lat=38.694&lon=-97.921&zoom=6&layers=Standard')
      })
    })  
  })
})