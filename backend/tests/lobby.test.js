const lobbyHelper = require('../utils/lobby_helper')

test('returns single array', () => {
  const array = [ 1 ]

  const result = lobbyHelper.shuffleArray(array)
  expect(result).toEqual( [ 1 ] )
})