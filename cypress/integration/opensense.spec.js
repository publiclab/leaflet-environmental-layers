describe('Opensense layer', function() {
  it('adds markers on click', function() {
    cy.openWindow('/example/index.html#lat=51.15&lon=13.45&zoom=4&layers=Standard')
    cy.wait(300)
    cy.window().then((win) => {
      cy.fixture('opensense').then((data) => {
        cy.stub(win.OpenSenseLayer, 'requestData', function() {
          win.OpenSenseLayer.parseData(data);
        })
      })
      
      cy.get('#menu-opensense label').click({ force: true })
      cy.get('.leaflet-marker-pane').children().should('have.length', 2)
    }) 
  })

  it('should have the layer name added to the hash', function() {
    cy.hash().should('eq', '#lat=51.15&lon=13.45&zoom=4&layers=Standard,opensense')
  })

  it('has default markers in default mode', function() {
      cy.get('.leaflet-marker-pane img').invoke('attr', 'src').should('eq', 'https://banner2.kisspng.com/20180409/qcw/kisspng-computer-icons-font-awesome-computer-software-user-cubes-5acb63cb589078.9265215315232787953628.jpg')
      cy.get('.leaflet-marker-pane img[src="https://banner2.kisspng.com/20180409/qcw/kisspng-computer-icons-font-awesome-computer-software-user-cubes-5acb63cb589078.9265215315232787953628.jpg"]').should('have.length', 2)
  })

  it('has circle markers in minimal mode', function() {
    cy.server()
    cy.route('GET', 'https://api.opensensemap.org/boxes', 'fixture:opensense.json')
    const spy = cy.spy(window.top.aut.OpenSenseLayer, 'requestData')
    cy.get('[title="Show minimal markers"]').click().then(() => {
      expect(spy).to.be.called
      cy.get('.leaflet-overlay-pane svg g').children().should('have.length', 2)
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke').should('eq', '#7c7c7c')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'fill').should('eq', '#262626')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke-linecap').should('eq', 'round')
      cy.get('.leaflet-overlay-pane svg g path').invoke('attr', 'stroke-linecap').should('eq', 'round')
    })    
  })

  it('removes markers from the map and the layer name from the hash when clicked again', function() {
    cy.get('#menu-opensense label').click({ force: true })
    cy.hash().should('eq', '#lat=51.15&lon=13.45&zoom=4&layers=Standard')
    cy.get('.leaflet-marker-pane').children().should('have.length', 0)
    cy.get('.leaflet-overlay-pane svg g').children().should('have.length', 0)
  })
  
})