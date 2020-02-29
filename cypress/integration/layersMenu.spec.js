describe('Layers menu filters and displays layers on map', function() {
  it('filters layers at map initialization', function() {
    cy.openWindow('/example/index.html#lat=43.00&lon=-83.00&zoom=3&layers=Standard')
    cy.wait(200)
    cy.get('.leaflet-control-layers').trigger('mouseover')
    cy.get('.layer-info-container').should('have.css', 'display', 'block').then((layers) => {
      const layersArray = Array.prototype.slice.call(layers)
      expect(layersArray.filter(layer => layer.style.display === 'block').length).to.equal(9)
    })
    cy.get('.leaflet-control-layers').trigger('mouseout')
  })

  it('adds an alert displaying the number of new layers on map movement', function() {
    cy.window().its('map').invoke('setView',[38.565, -100.767], 5)
    cy.wait(200)
    cy.get('.leaflet-control-layers-toggle .rounded-circle')
      .should('have.css', 'display', 'flex')
      .invoke('text').should('eq', '13')
  })

  it('adds layers to the menu on map movement', function() {
    cy.get('.leaflet-control-layers').trigger('mouseover')
    cy.get('.layer-info-container').should('have.css', 'display', 'block').then((layers) => {
      const layersArray = Array.prototype.slice.call(layers)
      expect(layersArray.filter(layer => layer.style.display === 'block').length).to.equal(14)
    })
  })

  it('removes alert after layer menu is expanded', function() {
    cy.get('.leaflet-control-layers').trigger('mouseout')
    cy.get('.leaflet-control-layers-toggle .rounded-circle')
      .should('have.css', 'display', 'none')
      .invoke('text').should('eq', '')
  })

  it('removes layers from the menu on map movement', function() {
    cy.window().its('map').invoke('setView',[43.00, -83.00], 3)
    cy.wait(300)
    cy.get('.leaflet-control-layers').trigger('mouseover')
    cy.get('.layer-info-container').should('have.css', 'display', 'block').then((layers) => {
      const layersArray = Array.prototype.slice.call(layers)
      expect(layersArray.filter(layer => layer.style.display === 'block').length).to.equal(9)
    })
  })

  it('retains an active layer when map view does not intersect with its extents', function() {
    cy.window().its('map').invoke('setView',[38.565, -100.767], 5)
    cy.wait(300) 
    cy.get('.leaflet-control-layers').trigger('mouseover')
    cy.get('#menu-justiceMap a[data-toggle="collapse"]').click()
    cy.get('div#justiceMap.layers-sub-list.collapse.show').children('div')
      .last('label').click()
      .find('input[type="checkbox"]').should('be.checked')
    cy.window().its('map').invoke('setView',[43.00, -83.00], 3)
    cy.wait(300)
    cy.get('#menu-justiceMap').should('have.css', 'display', 'block')
    cy.get('div#justiceMap.layers-sub-list.collapse.show').children('div')
      .last('label').should('have.css', 'display', 'block')
      cy.get('div#justiceMap.layers-sub-list.collapse.show').children('div')
      .first('label').should('have.css', 'display', 'none')
  })

  it('filters out the layer on map move after it is unchecked', function() {
    cy.get('div#justiceMap.layers-sub-list.collapse.show').children('div')
      .last('label').click()
      .find('input[type="checkbox"]').should('not.be.checked')
    cy.window().its('map').invoke('setView',[43.00, -85.00], 3)
    cy.wait(300)
    cy.get('#menu-justiceMap').should('have.css', 'display', 'none')
    cy.get('div#justiceMap.layers-sub-list.collapse.show').children('div')
      .last('label').should('have.css', 'display', 'none')
  })
})