describe('Layer filtering in LEL layers menu', function() {
  it('has global layers in the default map view', function() {
    cy.openWindow('/example/index.html#lat=43.00&lon=-4.07&zoom=3&layers=Standard')
    cy.wait(300)
    cy.get('.leaflet-control-layers').trigger('mouseover')
    cy.get('.layer-info-container').should('have.css', 'display', 'block').then((layers) => {
      const layersArray = Array.prototype.slice.call(layers)
      console.log(layersArray.filter(layer => layer.style.display === 'block'))
      expect(layersArray.filter(layer => layer.style.display === 'block').length).to.equal(9)
    })
    cy.get('#menu-aqicnLayer').should('have.css', 'display', 'block')
    cy.get('#menu-eonetFiresLayer').should('have.css', 'display', 'block')
    cy.get('#menu-luftdaten').should('have.css', 'display', 'block')
    cy.get('#menu-openaq').should('have.css', 'display', 'block')
    cy.get('#groupName-openInfraMap').should('have.css', 'display', 'block')
    cy.get('#openInfraMap.layers-sub-list.collapse').children().then((layers) => {
      const layersArray = Array.prototype.slice.call(layers)
      expect(layersArray.map(layer => layer.style.display === 'block').length).to.equal(4)
    })
    cy.get('#menu-opensense').should('have.css', 'display', 'block')
    cy.get('#groupName-openWeatherMap').should('have.css', 'display', 'block')
    cy.get('#openWeatherMap.layers-sub-list.collapse').children().then((layers) => {
      const layersArray = Array.prototype.slice.call(layers)
      expect(layersArray.map(layer => layer.style.display === 'block').length).to.equal(13)
    })
    cy.get('#groupName-purpleair').should('have.css', 'display', 'block')
    cy.get('#purpleair.layers-sub-list.collapse').children().then((layers) => {
      const layersArray = Array.prototype.slice.call(layers)
      expect(layersArray.map(layer => layer.style.display === 'block').length).to.equal(2)
    })
    cy.get('#menu-PLpeople').should('have.css', 'display', 'block')
  })

  it('has new layers at map view [38.565, -100.767] at zoom 5', function() {
    cy.window().its('map').invoke('setView',[38.565, -100.767], 5)
    cy.wait(300)
    cy.get('.layer-info-container').should('have.css', 'display', 'block').then((layers) => {
      const layersArray = Array.prototype.slice.call(layers)
      expect(layersArray.filter(layer => layer.style.display === 'block').length).to.equal(14)
    })
    cy.get('#menu-fractracker').should('have.css', 'display', 'block')
    cy.get('#menu-fracTrackerMobile').should('have.css', 'display', 'block')
    cy.get('#groupName-justiceMap').should('have.css', 'display', 'block')
    cy.get('#justiceMap.layers-sub-list.collapse').children().then((layers) => {
      const layersArray = Array.prototype.slice.call(layers)
      expect(layersArray.map(layer => layer.style.display === 'block').length).to.equal(9)
    })
    cy.get('#menu-pfasLayer').should('have.css', 'display', 'block')
    cy.get('#menu-toxicReleaseLayer').should('have.css', 'display', 'block')
  })

  it('has new layers at map view [40.872, -81.749] at zoom 6', function() {
    cy.window().its('map').invoke('setView',[40.872, -81.749], 6)
    cy.wait(300)
    cy.get('.layer-info-container').should('have.css', 'display', 'block').then((layers) => {
      const layersArray = Array.prototype.slice.call(layers)
      expect(layersArray.filter(layer => layer.style.display === 'block').length).to.equal(16)
    })
    cy.get('#groupName-indigenousLands').should('have.css', 'display', 'block')
    cy.get('#indigenousLands.layers-sub-list.collapse').children().then((layers) => {
      const layersArray = Array.prototype.slice.call(layers)
      expect(layersArray.map(layer => layer.style.display === 'block').length).to.equal(3)
    })
    cy.get('#menu-Unearthing').should('have.css', 'display', 'block')
  })

  it('has new layers at mapzoom 8', function() {
    cy.window().its('map').invoke('setView',[40.872, -81.749], 8)
    cy.wait(300)
    cy.get('.layer-info-container').should('have.css', 'display', 'block').then((layers) => {
      const layersArray = Array.prototype.slice.call(layers)
      console.log(layersArray.filter(layer => layer.style.display === 'block'))
      expect(layersArray.filter(layer => layer.style.display === 'block').length).to.equal(16)
    }) 
    cy.get('#menu-odorreport').should('have.css', 'display', 'block')
    cy.get('#menu-Unearthing').should('have.css', 'display', 'none')
  })

})