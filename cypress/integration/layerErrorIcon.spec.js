describe('Broken icon for layer errors', function() {
  it('shows broken icon on a layer error when layer is added to map', function() {
    cy.openWindow('/example/index.html#lat=41.624&lon=-91.626&zoom=5&layers=Standard')
    cy.wait(300)
    cy.window().then((win) => {
      cy.stub(win.FracTracker_mobile, 'requestData')
      cy.get('#menu-fracTrackerMobile label').click({ force: true }).then(() => {
        win.FracTracker_mobile.onError('fracTrackerMobile')
      })
      cy.get('#menu-fracTrackerMobile .layer-name').should('contain.html', '<i style="color: #d47d12;" class="fas fa-exclamation-triangle .text-warning"></i>')
    })
  })

  it('removes broken icon when layer is removed from the map', function() {
    cy.get('#menu-fracTrackerMobile label').click({ force: true })
    cy.get('#menu-fracTrackerMobile .layer-name').should('not.contain.html', '<i style="color: #d47d12;" class="fas fa-exclamation-triangle .text-warning"></i>')
  })

  it('shows broken icon on a layer error when layer within a group is added to map', function() {
    cy.window().then((win) => {
      cy.stub(win.PurpleAirMarkerLayer, 'requestData')
      cy.get('#purpleairmarker label').click({ force: true }).then(() => {
        win.PurpleAirMarkerLayer.onError('purpleairmarker', true)
      })
      cy.get('#purpleairmarker .layer-list-name').should('contain.html', '<i style="color: #d47d12;" class="fas fa-exclamation-triangle .text-warning"></i>')
    })
  })

  it('removes broken icon when layer within a group is removed from the map', function() {
    cy.get('#purpleairmarker label').click({ force: true })
    cy.get('#purpleairmarker .layer-list-name').should('not.contain.html', '<i style="color: #d47d12;" class="fas fa-exclamation-triangle .text-warning"></i>')
  })

  it('shows broken icon for each layer when there are more than one layer with errors', function() {
    cy.window().then((win) => {
      cy.stub(win.FracTracker_mobile, 'requestData')
      cy.stub(win.PurpleAirMarkerLayer, 'requestData')
      cy.get('#menu-fracTrackerMobile label').click({ force: true }).then(() => {
        win.FracTracker_mobile.onError('fracTrackerMobile')
      })
      cy.get('#menu-fracTrackerMobile .layer-name').should('contain.html', '<i style="color: #d47d12;" class="fas fa-exclamation-triangle .text-warning"></i>')
      cy.get('#purpleairmarker .layer-list-name').should('not.contain.html', '<i style="color: #d47d12;" class="fas fa-exclamation-triangle .text-warning"></i>')
      cy.get('#purpleairmarker label').click({ force: true }).then(() => {
        win.PurpleAirMarkerLayer.onError('purpleairmarker', true)
      })
      cy.get('#menu-fracTrackerMobile .layer-name').should('contain.html', '<i style="color: #d47d12;" class="fas fa-exclamation-triangle .text-warning"></i>')
      cy.get('#purpleairmarker .layer-list-name').should('contain.html', '<i style="color: #d47d12;" class="fas fa-exclamation-triangle .text-warning"></i>')
    })
  })

  it('removes broken icon from each layer when there are more than one layer with errors', function() {
    cy.get('#menu-fracTrackerMobile label').click({ force: true })
    cy.get('#menu-fracTrackerMobile .layer-name').should('not.contain.html', '<i style="color: #d47d12;" class="fas fa-exclamation-triangle .text-warning"></i>')
    cy.get('#purpleairmarker .layer-list-name').should('contain.html', '<i style="color: #d47d12;" class="fas fa-exclamation-triangle .text-warning"></i>')
    cy.get('#purpleairmarker label').click({ force: true })
    cy.get('#menu-fracTrackerMobile .layer-name').should('not.contain.html', '<i style="color: #d47d12;" class="fas fa-exclamation-triangle .text-warning"></i>')
    cy.get('#purpleairmarker .layer-list-name').should('not.contain.html', '<i style="color: #d47d12;" class="fas fa-exclamation-triangle .text-warning"></i>')
  })
})