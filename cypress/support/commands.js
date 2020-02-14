// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('openWindow', (url, features) => {
    const w = Cypress.config('viewportWidth')
    const h = Cypress.config('viewportHeight')
    if (!features) {
      features = `width=${w}, height=${h}`
    }
    console.log('openWindow %s "%s"', url, features)
  
    return new Promise(resolve => {
      if (window.top.aut) {
        console.log('window exists already')
        window.top.aut.close()
      }
      // https://developer.mozilla.org/en-US/docs/Web/API/Window/open
      window.top.aut = window.top.open(url, 'aut', features)
  
      // letting page enough time to load and set "document.domain = localhost"
      // so we can access it
      setTimeout(() => {
        cy.state('document', window.top.aut.document)
        cy.state('window', window.top.aut)
        resolve()
      }, 500)
    })
  })