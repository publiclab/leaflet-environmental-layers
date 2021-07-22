describe('OpenWeatherMap layer', function() {
  it('adds markers on click', function() {
    cy.openWindow('/example/index.html#lat=41.6283&lon=-91.7235&zoom=10&layers=Standard')
    cy.wait(300)
    cy.window().then((win) => {
      cy.get('.leaflet-tile-pane').children().should('have.length', 1)
      cy.get('#map-Clouds label').click({ force: true })
      cy.get('.leaflet-tile-pane').children().should('have.length', 2)
      cy.get('img').should('have.attr', 'src').and('contains', 'openweathermap.org/map/clouds')
    }) 
  })
  
  it('loads correct owmloading.gif with config option set', function() {
    cy.openWindow('/example/oneLinerCodeExample.html')
    cy.wait(300)
    let LEL;
    cy.window()
      .then((win) => {
        LEL = win.LEL
      })
      .then(() => {
        expect(LEL.overlayMaps.current.options.imageLoadingUrl).to.equal('https://raw.githubusercontent.com/buche/leaflet-openweathermap/master/owmloading.gif')
      })
  })
});