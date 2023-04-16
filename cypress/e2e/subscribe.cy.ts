describe("Newsletter Subscribe Form", () => {
    beforeEach(() => {
        cy.visit(Cypress.config('baseUrl'))
    })

    it("allows users to subscribe to the email list", () => {
        cy.getByData("email-input").type("tom@aol.com")
        cy.getByData("submit-button").click()
        cy.getByData("success-message").should("exist").contains("tom@aol.com")
    })

    it("does NOT allow an invalid email address", () =>{
        cy.getByData("email-input").type("tom")
        cy.getByData("submit-button").click()

        // https://docs.cypress.io/api/commands/should
        //.should(chainers)
        // https://docs.cypress.io/guides/references/assertions#Chai
        // https://www.chaijs.com/api/bdd/ 
        cy.getByData("success-message").should("not.exist")
    })

    it("does NOT allow already subscribed email addresses", () => {
        cy.getByData("email-input").type("john@example.com")
        cy.getByData("submit-button").click()
        //可自訂化timeout
        cy.getByData("server-error-message").should("exist").contains("already exists",{timeout:1000})
    })
})