const express = require('express')
const app = express()

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
let revealedCards = [ 0, 1, 2, 0, 1, 2, 3];

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

    newBoardState = {
        boardKey: shuffleArray(newKey),
        startingTeam: newStartingTeam,
        revealedCards: revealedCards
    }
    return newBoardState
}

app.get('/', (request, response) => {
    response.send(`<h1>pog it's codenames</h1>`)
})

// post to new game endpoint
app.get('/newGame', (request, response) => {
    newBoardState = generateNewBoardState();
    response.json(newBoardState)
})

// get game state
app.get('/boardState', (request, response) => {
    response.json(revealedCards)
})

// post game state
app.post('/boardState', (request, response) => {
    console.log(request.body)
})

const PORT = 8080
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

// add role + team select at start of front-end app