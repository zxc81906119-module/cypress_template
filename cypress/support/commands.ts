/// <reference types="cypress" />

Cypress.Commands.add("getByData", (selector) => {
    // 注意 ``
   // https://docs.cypress.io/guides/references/best-practices
    return cy.get(`[data-test=${selector}]`)
})