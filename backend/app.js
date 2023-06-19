const express = require('express')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const wordList = require('./words').words
const { shuffleArray, generateUniqueNumbers , Teams } = require('./utils/lobby_helper')

app.use(cors());
// app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

const lobbies = [];
const maxGames = 100000
const generateUniqueGameId = generateUniqueNumbers(maxGames)

function generateNewBoardState() {
    const newKey = [
      ...Array(8).fill(Teams.RED),
      ...Array(8).fill(Teams.BLUE),
      ...Array(7).fill(Teams.NEUTRAL),
      Teams.BLACK
    ]
    const newStartingTeam = Math.random() < 0.5 ? Teams.RED : Teams.BLUE;
    newKey.push(newStartingTeam)

    const newBoardState = {
        gameId: generateUniqueGameId(),
        boardKey: shuffleArray(newKey),
        words: shuffleArray(wordList).slice(0,25),
        startingTeam: newStartingTeam,
        revealedCards: [],
        currentGuessingTeam: newStartingTeam,
        clue: { text: '', guesses: 0 }
    }
    return newBoardState
}

app.get('/boards', (request, response) => {
    response.json(lobbies)
})

// post to new game endpoint
// CHANGE THIS TO A POST CALL
app.get('/newGame', (request, response) => {
    const newBoardState = generateNewBoardState()
    lobbies.push(newBoardState)

    // doesn't work on old JS versions
    // response.json(lobbies.at(-1))
    response.json(lobbies[lobbies.length-1])
})

// get game state for specific game ID
app.get('/boards/:id', (request, response) => {
    const id = Number(request.params.id)
    const board = lobbies.find(board => board.gameId === id)
    if (board) {
        response.json(board)
    } else {
        response.status(404).end()
    }
})

app.patch('/boards/:id', (request, response) => {
    const id = Number(request.params.id)
    const boardIndex = lobbies.findIndex(board => board.gameId === id)
    const entries = Object.entries(request.body)
    entries.forEach(entry => {
        const [attribute, value] = entry
        if (!attribute) {
            response.status(404).end()
        } else {
            lobbies[boardIndex][attribute] = value;
        }
    })
    response.send(`Board #${id} updated`)
})

// testing
app.post('/api/testing/reset', (request, response) => {
    lobbies.length = 0
    response.status(204).end()
})


module.exports = app