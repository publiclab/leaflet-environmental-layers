describe('Layer filtering in LEL layers menu', function() {
  it('has global layers in the default map view', function() {
    cy.openWindow('/example/index.html#lat=43.00&lon=-4.07&zoom=3&layers=Standard')
    cy.wait(300)
    cy.get('.leaflet-control-layers').trigger('mouseover')
    cy.get('[data-cy=layer]').should('have.css', 'display', 'block').then((layers) => {
      const layersArray = Array.prototype.slice.call(layers)
      console.log(layersArray.filter(layer => layer.style.display === 'block'))
      expect(layersArray.filter(layer => layer.style.display === 'block').length).to.equal(9)
    })
    cy.get('#map-menu-aqicnLayer').parent().should('have.css', 'display', 'block')
    cy.get('#map-menu-eonetFiresLayer').parent().should('have.css', 'display', 'block')
    cy.get('#map-menu-luftdaten').parent().should('have.css', 'display', 'block')
    cy.get('#map-menu-openaq').parent().should('have.css', 'display', 'block')
    cy.get('#map-menu-openInfraMap').should('have.css', 'display', 'block')
    cy.get('#map-openInfraMap.layers-sub-list.collapse').children().then((layers) => {
      const layersArray = Array.prototype.slice.call(layers)
      expect(layersArray.map(layer => layer.style.display === 'block').length).to.equal(4)
    })
    cy.get('#map-menu-opensense').parent().should('have.css', 'display', 'block')
    cy.get('#map-menu-openWeatherMap').should('have.css', 'display', 'block')
    cy.get('#map-openWeatherMap.layers-sub-list.collapse').children().then((layers) => {
      const layersArray = Array.prototype.slice.call(layers)
      expect(layersArray.map(layer => layer.style.display === 'block').length).to.equal(13)
    })
    cy.get('#map-menu-purpleair').should('have.css', 'display', 'block')
    cy.get('#map-purpleair.layers-sub-list.collapse').children().then((layers) => {
      const layersArray = Array.prototype.slice.call(layers)
      expect(layersArray.map(layer => layer.style.display === 'block').length).to.equal(2)
    })
    cy.get('#map-menu-PLpeople').parent().should('have.css', 'display', 'block')
  })

  it('has new layers at map view [38.565, -100.767] at zoom 5', function() {
    cy.window().its('map').invoke('setView',[38.565, -100.767], 5)
    cy.wait(300)
    cy.get('[data-cy=layer]').should('have.css', 'display', 'block').then((layers) => {
      const layersArray = Array.prototype.slice.call(layers)
      expect(layersArray.filter(layer => layer.style.display === 'block').length).to.equal(14)
    })
    cy.get('#map-menu-fractracker').parent().should('have.css', 'display', 'block')
    cy.get('#map-menu-fracTrackerMobile').parent().should('have.css', 'display', 'block')
    cy.get('#map-menu-justiceMap').should('have.css', 'display', 'block')
    cy.get('#map-justiceMap.layers-sub-list.collapse').children().then((layers) => {
      const layersArray = Array.prototype.slice.call(layers)
      expect(layersArray.map(layer => layer.style.display === 'block').length).to.equal(9)
    })
    cy.get('#map-menu-pfasLayer').parent().should('have.css', 'display', 'block')
    cy.get('#map-menu-toxicReleaseLayer').parent().should('have.css', 'display', 'block')
  })

  it('has new layers at map view [40.872, -81.749] at zoom 6', function() {
    cy.window().its('map').invoke('setView',[40.872, -81.749], 6)
    cy.wait(300)
    cy.get('[data-cy=layer]').should('have.css', 'display', 'block').then((layers) => {
      const layersArray = Array.prototype.slice.call(layers)
      expect(layersArray.filter(layer => layer.style.display === 'block').length).to.equal(16)
    })
    cy.get('#map-menu-indigenousLands').should('have.css', 'display', 'block')
    cy.get('#map-indigenousLands.layers-sub-list.collapse').children().then((layers) => {
      const layersArray = Array.prototype.slice.call(layers)
      expect(layersArray.map(layer => layer.style.display === 'block').length).to.equal(3)
    })
    cy.get('#map-menu-Unearthing').parent().should('have.css', 'display', 'block')
  })

  it('has new layers at mapzoom 8', function() {
    cy.window().its('map').invoke('setView',[40.872, -81.749], 8)
    cy.wait(300)
    cy.get('[data-cy=layer]').should('have.css', 'display', 'block').then((layers) => {
      const layersArray = Array.prototype.slice.call(layers)
      console.log(layersArray.filter(layer => layer.style.display === 'block'))
      expect(layersArray.filter(layer => layer.style.display === 'block').length).to.equal(16)
    }) 
    cy.get('#map-menu-odorreport').parent().should('have.css', 'display', 'block')
    cy.get('#map-menu-Unearthing').parent().should('have.css', 'display', 'none')
  })

})