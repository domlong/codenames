describe('Codenames', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:8080/api/testing/reset')
    cy.visit('http://localhost:8080')
  })

  it('front page can be opened', function() {
    cy.contains('Crudnames')
  })

  it('lobby can be created', function() {
    cy.contains('Create Room').click()
    cy.get('.grid > div').should('have.class', 'card')
  })

  // it('hosted game polls server at correct endpoint', function() {
  //
  // })

})