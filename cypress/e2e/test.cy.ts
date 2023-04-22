describe('template spec', () => {
    //https://docs.cypress.io/api/commands/task#See-also

    beforeEach(() => {
       
    })

    it("test", () => {
        cy.visit(Cypress.config("baseUrl"))
        const dbName = 'stagingA'
        const query = 'SELECT * FROM users'
        cy.task('queryDatabase', { dbName, query })
            .then((result) => {
                expect(result).to.have.length(1)
                expect(result[0].name).to.equal('test')
            }
        )
    })
})