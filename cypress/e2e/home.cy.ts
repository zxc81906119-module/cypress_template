describe('template spec', () => {

  beforeEach(() => {
    // https://docs.cypress.io/guides/references/configuration
    cy.visit(Cypress.config('baseUrl'))
  })

  context("Hero section", () => {
    it("the h1 contains the correct text", () => {
      // https://docs.cypress.io/api/commands/get
      cy.get("h1", { log: false, timeout: Cypress.config('defaultCommandTimeout') })
      // 自創command https://docs.cypress.io/api/cypress-api/custom-commands
      cy.getByData("hero-heading").contains(
        "Testing Next.js Applications with Cypress"
      )
    })

    it("the features on the homepage are correct", () => {
      cy.get("dt").eq(0).contains("4 Courses")
      cy.get("dt").eq(1).contains("25+ Lessons")
      cy.get("dt").eq(2).contains("Free and Open Source")
    })
  })
})