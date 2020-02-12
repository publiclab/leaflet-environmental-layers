describe('My First Test', function() {
  it('Visits demo page', function() {
    // cy.stub(this.EonetFiresLayer)
    cy.visit('/example/index.html');
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
    cy.get('.fas.fa-code').should('have.css', 'font-family').and('match', /Font Awesome 5 Free/)
    // cy.get('.fa-code:before').should('have.css', 'content').and('match', /\\f121/)
  })
})