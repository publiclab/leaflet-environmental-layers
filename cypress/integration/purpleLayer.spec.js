describe('Purple layer - heatmap', function() {
  it('adds heatmap on click', function() {
    cy.openWindow('/example/index.html#lat=43.00&lon=-83.00&zoom=3&layers=Standard')
    cy.wait(300)
    cy.window().then((win) => {
      cy.fixture('purpleLayer').then((data) => {
        cy.stub(win.PurpleLayer, 'requestData', function() {
          win.PurpleLayer.parseData(data);
        })
      })
      cy.get('div#purpleair.layers-sub-list.collapse').children('div')
      .first().find('label')
      .click({ force: true })
      cy.get('.leaflet-overlay-pane .heatmap-canvas').should('exist')
    }) 
  })

  it('should have the layer name added to the hash', function() {
    cy.hash().should('include', ',purpleLayer')
  })

  it('removes heatmap from the map and the layer name from the hash when clicked again', function() {
    cy.get('div#purpleair.layers-sub-list.collapse').children('div')
      .first().find('label')
      .click({ force: true })
    cy.hash().should('not.include', ',purpleLayer')
    cy.get('.leaflet-overlay-pane .heatmap-canvas').should('not.exist')
  })
})