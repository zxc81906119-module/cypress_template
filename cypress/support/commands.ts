/// <reference types="cypress" />

Cypress.Commands.add("getByData", (selector) => {
    // 注意 ``
    return cy.get(`[data-test=${selector}]`)
})