describe('Codenames', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:8080/api/testing/reset')
    cy.visit('http://localhost:8080')
  })

  it('front page can be opened', function() {
    cy.contains('Crudnames')
  })

  it('game can be hosted', function() {
    cy.contains('Host Game').click()
    cy.get('.grid > button').should('have.class', 'card')
  })

  // it('hosted game polls server at correct endpoint', function() {
  //
  // })

})