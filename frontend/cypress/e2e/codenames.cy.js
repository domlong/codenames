describe('Codenames', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:8080/api/testing/reset')
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function() {
    cy.contains('Crudnames')
  })

  it('game can be hosted', function() {
    cy.contains('Host Game').click()
  })

})