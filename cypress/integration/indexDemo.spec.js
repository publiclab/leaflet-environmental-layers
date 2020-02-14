describe('Loads demo page', function() {
  it('Visits demo page', function() {
    cy.openWindow('/example/index.html#lat=43.00&lon=-83.00&zoom=3&layers=Standard');
  })

  it('changes hash on map movement', function() {
    cy.window().its('map').invoke('setView',[38.694, -97.921], 6)
    cy.wait(2000).then(() => {
      cy.hash().should('equal', '#lat=38.694&lon=-97.921&zoom=6&layers=Standard')
    })
  })

  it('has search control', function() {
    cy.get('.leaflet-gac-container').should('exist')
    cy.get('.leaflet-gac-search-btn').should('exist')
    cy.get('.leaflet-gac-control').should('exist')
  })

  it('has search control that hides button and reveals input field', function() {
    cy.get('.leaflet-gac-search-btn').should('not.have.class', 'leaflet-gac-hidden')
    cy.get('.leaflet-gac-control').should('have.class', 'leaflet-gac-hidden')
    cy.get('.leaflet-gac-container').click()
    cy.get('.leaflet-gac-search-btn').should('have.class', 'leaflet-gac-hidden')
    cy.get('.leaflet-gac-control').should('not.have.class', 'leaflet-gac-hidden')
    cy.get('#map').click().click()
    cy.get('.leaflet-gac-control').should('have.class', 'leaflet-gac-hidden')
    cy.get('.leaflet-gac-search-btn').should('not.have.class', 'leaflet-gac-hidden')
  })

  it('has zoom controls', function() {
    cy.get('.leaflet-control-zoom-in').should('exist')
    cy.get('.leaflet-control-zoom-out').should('exist')
  })

  it('has minimal mode controls', function() {
    cy.get('.leaflet-control-mode').should('exist')
    cy.get('[title="Show default markers"]').should('exist')
    cy.get('[title="Show minimal markers"]').should('exist')
    cy.get('[title="Show default markers"]').should('have.class', 'leaflet-disabled')
    cy.get('[title="Show minimal markers"]').should('not.have.class', 'leaflet-disabled')
  })

  it('has minimal mode that toggles buttons and _minimalMode property', function() {
    cy.window().its('map').should('have.property', '_minimalMode', false)
    cy.get('[title="Show default markers"]').click().should('have.class', 'leaflet-disabled')
    cy.window().its('map').should('have.property', '_minimalMode', false)
    cy.get('[title="Show minimal markers"]').click().should('have.class', 'leaflet-disabled')
    cy.get('[title="Show default markers"]').should('not.have.class', 'leaflet-disabled')
    cy.window().its('map').should('have.property', '_minimalMode', true)
    cy.get('[title="Show minimal markers"]').click().should('have.class', 'leaflet-disabled')
    cy.get('[title="Show default markers"]').should('not.have.class', 'leaflet-disabled')
    cy.window().its('map').should('have.property', '_minimalMode', true)
    cy.get('[title="Show default markers"]').click().should('have.class', 'leaflet-disabled')
    cy.get('[title="Show minimal markers"]').should('not.have.class', 'leaflet-disabled')
    cy.window().its('map').should('have.property', '_minimalMode', false)
  })

  it('has embed button', function() {
    cy.get('.leaflet-control-embed').should('exist')
    cy.get('.leaflet-control-embed-link').should('exist')
    cy.get('.fas.fa-code').should('exist')
    cy.get('.fas.fa-code').should('have.css', 'font-family', '"Font Awesome 5 Free"')
  })

  it('displays embed code when embed button is clicked', function() {
    cy.window().then((win) => {
      cy.stub(win, 'prompt').as('windowPrompt')
      let path = win.location.pathname
      let currentHash = win.location.hash
      let match = '<iframe style="border:none;" width="100%" height="900px" src="//publiclab.github.io' + path + currentHash + '"></iframe>'
      cy.get('.leaflet-control-embed').click()
      cy.get('@windowPrompt').should('called')
      cy.get('@windowPrompt').should('be.calledWith', 'Use this HTML code to embed this map on another site.', match)
    })
  })

  it('has layers menu control', function() {
    cy.get('.leaflet-control-layers').should('exist')
    cy.get('.leaflet-control-layers-toggle').should('exist')
    cy.get('.leaflet-control-layers-menu').should('exist')
    cy.get('.leaflet-control-layers-menu').find('.leaflet-control-layers-base')
    cy.get('.leaflet-control-layers-menu')
      .find('.leaflet-control-layers-overlays')
      .should('have.css', 'overflow', 'hidden scroll')
    cy.get('.leaflet-control-layers-menu').contains('h3', 'Environmental data near here')
    cy.get('.leaflet-control-layers-overlays')
      .find('.layer-info-container')
      .should('have.length', 21) // Checks if all overlay layer groups are added
  })

  it('displays layers menu on hover', function() {
    cy.get('.leaflet-control-layers').should('not.have.class', 'leaflet-control-layers-expanded')
    cy.get('.leaflet-control-layers-toggle').should('have.css', 'display', 'block')
    cy.get('.leaflet-control-layers-menu').should('have.css', 'display', 'none')
    cy.get('.leaflet-control-layers').trigger('mouseover').should('have.class', 'leaflet-control-layers-expanded')
    cy.get('.leaflet-control-layers-toggle').should('not.have.css', 'display', 'block')
    cy.get('.leaflet-control-layers-menu').should('have.css', 'display', 'block')
  })
})