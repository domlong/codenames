const express = require('express')
const cors = require('cors')
const wordList = require('./words').words

const app = express()

// app.use(cors({origin: 'http://localhost:3000'}));
app.use(cors());
app.use(express.json())

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(requestLogger)
// app.use(express.static('build'))

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

let boardState = {};
const lobbies = [];

const generateUniqueNumbers = (max) => {
    const chosenNumbers = new Set();
    return () => {
      if (chosenNumbers.size === max) {
        throw new Error('No more uniques!');
      }
      let num;
      do {
        num = Math.floor(Math.random() * max)
      } while (chosenNumbers.has(num));
      chosenNumbers.add(num);
      return num;
    };
}

const maxGames = 100000
const generateUniqueGameId = generateUniqueNumbers(100000)

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
        clue: { text: '', guesses: 0}
    }
    return newBoardState
}

app.get('/', (request, response) => {
    response.send(`<h1>pog it's codenames</h1>`)
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

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})