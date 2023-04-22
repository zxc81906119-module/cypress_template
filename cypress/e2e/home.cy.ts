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

    it.only("the features on the homepage are correct", () => {
      //eq  https://docs.cypress.io/api/commands/eq
      //fist https://docs.cypress.io/api/commands/first 取得第一個
      //last https://docs.cypress.io/api/commands/last  取得最後一個
      cy.get("dt").should("have.length", 3)
      cy.get("dt").eq(0).contains("4 Courses")
      cy.get("dt").eq(1).contains("25+ Lessons")
      cy.get("dt").eq(2).contains("Free and Open Source")
    })
  })

  context("Courses section", () => {
     it("Course: Testing Your First Next.js Application",()=>{
      //https://docs.cypress.io/api/commands/find
      //https://docs.cypress.io/api/commands/get#Get-vs-Find
      //get會從root開始找selector 而 find 可以依照前一個selector繼續往下找
       cy.getByData("course-0").find("a").eq(3).click()
       //https://docs.cypress.io/api/commands/location
       cy.location("pathname").should("eq","/testing-your-first-application")
     })

     it("Course: Testing Foundations",()=>{
       cy.getByData("course-1").find("a").eq(3).click()
       cy.location("pathname").should("eq","/testing-foundations")
     })

     it("Course: Cypress Fundamentals",()=>{
       cy.getByData("course-2").find("a").eq(3).click()
       cy.location("pathname").should("eq","/cypress-fundamentals")
     })

  })

})