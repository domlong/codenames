const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors({origin: 'http://localhost:3000'}));
app.use(express.json())

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }

app.use(requestLogger)

const Teams = {
    NEUTRAL: 0,
    RED: 1,
    BLUE: 2,
    BLACK: 3
};

function shuffleArray(array) {
    const shuffledArray = array.slice()
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

let boardKey = [];
let boardState = {};
let gameId = 0;

function generateNewBoardState() {
    const newKey = [
      ...Array(8).fill(Teams.RED),
      ...Array(8).fill(Teams.BLUE),
      ...Array(7).fill(Teams.NEUTRAL), 
      Teams.BLACK
    ]
    const newStartingTeam = Math.random() < 0.5 ? Teams.RED : Teams.BLUE;
    newKey.push(newStartingTeam)

    boardKey = newKey;

    const newBoardState = {
        boardKey: shuffleArray(newKey),
        startingTeam: newStartingTeam,
        revealedCards: [],
        currentGuessingTeam: newStartingTeam,
        clue: ['', 0],
        gameId: gameId + 1
    }
    return newBoardState
}

app.get('/', (request, response) => {
    response.send(`<h1>pog it's codenames</h1>`)
})

// post to new game endpoint
app.get('/newGame', (request, response) => {
    boardState = generateNewBoardState();
    response.json(boardState)
})

// get game state
app.get('/boardState', (request, response) => {
    response.json(boardState)
})

// post game state
app.post('/boardState', (request, response) => {
    boardState.revealedCards = request.body.revealedCards
    boardState.currentGuessingTeam = request.body.currentGuessingTeam
    boardState.clue = request.body.clue
    response.json('Nice going')
})

const PORT = 8080
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

// add role + team select at start of front-end app