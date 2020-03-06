describe('Toxic Release layer', function() {
  it('adds markers on click', function() {
    cy.openWindow('/example/index.html#lat=39.893&lon=-96.702&zoom=5&layers=Standard')
    cy.wait(300)
    cy.window().then((win) => {
      cy.fixture('toxicRelease').then((data) => {
        console.log(data)
        cy.stub(win.ToxicRelease, 'requestData', function() {
          win.ToxicRelease.parseData(data);
        })
      })
      
      cy.get('#map-menu-toxicReleaseLayer label').click({ force: true })
      cy.get('.leaflet-marker-pane img').should('have.length', 2)
    }) 
  })

  it('should have the layer name added to the hash', function() {
    cy.hash().should('include', ',toxicReleaseLayer')
  })

  it('has default markers in default mode', function() {
    cy.get('.leaflet-marker-pane img').invoke('attr', 'src').should('eq', 'https://www.clker.com/cliparts/r/M/L/o/R/i/green-dot.svg')
    cy.get('.leaflet-marker-pane img[src="https://www.clker.com/cliparts/r/M/L/o/R/i/green-dot.svg"]').should('have.length', 2)
  })

  it('has circle markers in minimal mode', function() {
    cy.server({status: 200})
    cy.route('GET', 'https://iaspub.epa.gov/enviro/efservice/tri_facility/pref_latitude/BEGINNING/39/PREF_LONGITUDE/BEGINNING/96/rows/0:300/JSON', 'fixture:toxicRelease.json')
    const spy = cy.spy(window.top.aut.ToxicRelease, 'requestData')
    cy.get('[title="Show minimal markers"]').click().then(() => {
      expect(spy).to.be.called
      cy.get('.leaflet-overlay-pane svg g').children().should('have.length', 2)
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke').should('eq', '#7c7c7c')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'fill').should('eq', '#6ccc00')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke-linecap').should('eq', 'round')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke-linecap').should('eq', 'round')
    })    
  })

  it('shows popup', function() {
    cy.get('.leaflet-overlay-pane svg g').children().last().click({ force: true })
    cy.get('.leaflet-popup-pane').children().should('have.length', 1)
    cy.get('.leaflet-popup-content').should('contain', 'Vienna')
  })

  it('removes markers from the map and the layer name from the hash when clicked again', function() {
    cy.get('#map-menu-toxicReleaseLayer label').click({ force: true })
    cy.hash().should('not.include', ',toxicReleaseLayer')
    cy.get('.leaflet-marker-pane img').should('have.length', 0)
    cy.get('.leaflet-overlay-pane svg g').children().should('have.length', 0)
  })
})