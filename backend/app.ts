import express from 'express';
import cors from 'cors';
import wordList from './words';
import middleware from './utils/middleware';
import { shuffleArray, generateUniqueNumbers } from './utils/lobby_helper';
import { Team, Board } from './types';

const app = express();

app.use(cors());
// app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);

const lobbies: Board[] = [];
const maxGames = 100000;
const generateUniqueGameId = generateUniqueNumbers(maxGames);

function generateNewBoardState() {
    const newKey: Team[] = [
      ...Array<Team>(8).fill(Team.RED),
      ...Array<Team>(8).fill(Team.BLUE),
      ...Array<Team>(7).fill(Team.NEUTRAL),
      Team.BLACK
    ];
    const newStartingTeam = Math.random() < 0.5 ? Team.RED : Team.BLUE;
    newKey.push(newStartingTeam);

    const newBoardState: Board = {
        gameId: generateUniqueGameId(),
        boardKey: shuffleArray(newKey) as Team[],
        words: shuffleArray(wordList).slice(0,25) as string[],
        startingTeam: newStartingTeam,
        revealedCards: [],
        currentGuessingTeam: newStartingTeam,
        clue: { text: '', number: 0 }
    };
    return newBoardState;
}

app.get('/boards', (_request, response) => {
    response.json(lobbies);
});

// post to new game endpoint
// CHANGE THIS TO A POST CALL
app.get('/newGame', (_request, response) => {
    const newBoardState = generateNewBoardState();
    lobbies.push(newBoardState);

    // doesn't work on old JS versions
    // response.json(lobbies.at(-1))
    response.json(lobbies[lobbies.length-1]);
});

// get game state for specific game ID
app.get('/boards/:id', (request, response) => {
    const id = Number(request.params.id);
    const board = lobbies.find(board => board.gameId === id);
    if (board) {
        response.json(board);
    } else {
        response.status(404).end();
    }
});

app.patch('/boards/:id', (request, response) => {
    const id = Number(request.params.id);
    const boardIndex = lobbies.findIndex(board => board.gameId === id);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const entries = Object.entries(request.body);
    entries.forEach(entry => {
        const [attribute, value] = entry;
        if (!attribute) {
            response.status(404).end();
        } else {
            lobbies[boardIndex][attribute] = value;
        }
    })
    response.send(`Board #${id} updated`);
});

// testing
app.post('/api/testing/reset', (_request, response) => {
    lobbies.length = 0;
    response.status(204).end();
});


// module.exports = app

// export default (app: Application) => app;
export default app;