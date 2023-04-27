import { useEffect, useState, useMemo } from "react";
// import wordList from "../words";
import Grid from "./Grid";
import Clue from "./Clue";
import '../styles/Grid.css'
import { PlayerRoles, Teams } from "./consts";

function shuffleArray(array) {
  const shuffledArray = array.slice()
  for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

function Board() {
  // replace a bunch of these with generic board state to pass between server?
  const [key, setKey] = useState([])
  const [revealedCards, setRevealedCards] = useState([])
  const [playerRole, setPlayerRole] = useState(PlayerRoles.Operative)
  const [playerTeam, setPlayerTeam] = useState(Teams.RED)
  const [startingTeam, setStartingTeam] = useState()
  const [currentGuessingTeam, setCurrentGuessingTeam] = useState(Teams.RED)
  const [clue, setClue] = useState(['', 0])
  const [words, setWords] = useState([])
  const [isGameOver, setIsGameOver] = useState(false)
  const [gameIdInput, setGameIdInput] = useState(0)
  const [gameId, setGameId] = useState(0)

  // networking stuff
  const waitTime = 5000
  const dataUrl = 'http://localhost:8080/boardState'

  const fetchBoardState = () => {
    fetch(dataUrl).then(response => response.json()).then(data => {
      console.log(data)
      if(JSON.stringify(data.boardKey) !== JSON.stringify(key)) {
        setKey(data.boardKey)
      }
      if(data.gameId !== gameId) {
        setGameId(data.gameId)
      }      
      if(JSON.stringify(data.revealedCards) !== JSON.stringify(revealedCards)) {
        setRevealedCards(data.revealedCards)
      }
      
      if(data.currentGuessingTeam !== currentGuessingTeam) {
        setCurrentGuessingTeam(data.currentGuessingTeam)
      }
      if(JSON.stringify(data.clue) !== JSON.stringify(clue)) {
        setClue(data.clue)
      }
      setWords(data.words)
      setStartingTeam(data.startingTeam)
    })
  }

  const fetchNewGame = () => {
    const newGameUrl = 'http://localhost:8080/newGame'
    fetch(newGameUrl).then(response => response.json()).then(data => {
      setRevealedCards([])
      setStartingTeam(data.startingTeam)
      setCurrentGuessingTeam(data.currentGuessingTeam)
      setKey(data.boardKey)
      setWords(data.words)
    })
  }

  useEffect(() => fetchNewGame, [])
  useEffect(() => {
    const intervalId = setInterval(fetchBoardState, waitTime);
      return () => clearInterval(intervalId)
  }, [])

  const togglePlayerRole = (event) => {
    setPlayerRole(event.target.value)
  }

  const togglePlayerTeam = (event) => {
    setPlayerTeam(parseInt(event.target.value))
  }

  const itIsYourTurn = playerTeam === currentGuessingTeam;

  const selectCard = (cardId) => {
    if(itIsYourTurn && playerRole===PlayerRoles.Operative) {
      revealCard(cardId)
      if((currentGuessingTeam !== key[cardId]) ) {
        togglePlayerTeamTurn()
      }
    }
  }

  const handleFinishTurn = () => {
    togglePlayerTeamTurn()
  }

  const revealCard = (cardId) => {
    if (!revealedCards.includes(cardId)) {
      setRevealedCards([...revealedCards, cardId])
    }
  }

  const scores = useMemo(() => {
    const lastCardCategory = key[revealedCards.slice(-1)]
    const revealedCardColours = revealedCards.map(cardId => key[cardId])
    const scores = {
      [Teams.RED]: revealedCardColours.filter(teamCard => teamCard === Teams.RED).length,
      [Teams.BLUE]: revealedCardColours.filter(teamCard => teamCard === Teams.BLUE).length
    }
    if(lastCardCategory === Teams.BLACK) {
      scores[currentGuessingTeam] = 9
    }
    return scores
  }, [revealedCards, currentGuessingTeam, key])

  const togglePlayerTeamTurn = () => {
    if(currentGuessingTeam === Teams.RED) {
      setCurrentGuessingTeam(Teams.BLUE)
    }
    else {
      setCurrentGuessingTeam(Teams.RED)
    }
    setClue(['', 0])
  }

  function checkWinCondition() {
    return (
      Object.values(scores).includes(9)
      || (scores[Teams.RED] === 8 && startingTeam === Teams.BLUE)
      || (scores[Teams.BLUE] === 8 && startingTeam === Teams.RED)
    )
  }

  const startNewGame = () => {
    fetchNewGame()
    // setWords(shuffleArray(wordList).slice(0,25))
    setIsGameOver(false)
  }
  
  const gameOver = () => {
    setIsGameOver(true)
    // reveal all cards to everyone?
  }

  // useEffect(() => startNewGame(), [])

  if (checkWinCondition() && !isGameOver) {
    gameOver()
  }

  function getTeamName(teamNum) {
    return Object.keys(Teams).find(key => Teams[key] === parseInt(teamNum))
  }

  const winner = Object.keys(scores).reduce((a,b) => scores[a] > scores[b] ? a : b );

  const joinGame = () => {

  }

  useEffect(() => {
    async function postJSON(data) {
      try {
        const response = await fetch(dataUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
    
        const result = await response.json();
        console.log("Success:", result);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    postJSON({ 
        revealedCards: revealedCards,
        currentGuessingTeam: currentGuessingTeam,
        clue: clue
    })
  }, [revealedCards, currentGuessingTeam, clue] )

  return (

    <div id='board'>
      <div id='splash'>
        <input type="number" onChange={e => setGameIdInput(e.target.value)}></input>
        <button onClick={fetchBoardState}>Join</button>
        <button onClick={startNewGame}>Host Game</button>
        <h2>{`Game ID: ${gameId}`}</h2>
      </div>
      <h2 style={{ color: `${getTeamName(playerTeam)}`}}>YOU ARE TEAM {getTeamName(playerTeam)}</h2>
      {!isGameOver &&
      <div>
        <h2 style={{ color: `${getTeamName(currentGuessingTeam)}`}}>{`IT IS ${getTeamName(currentGuessingTeam)}'S TURN`}</h2>
        <h2>{`red: ${scores[Teams.RED]}, blue: ${scores[Teams.BLUE]}`}</h2>
      </div>
      }
      {isGameOver &&
        <div>
          <h2>GAME OVER</h2>
          <h2>{`${getTeamName(winner)} WINS!!`}</h2>
        </div>
      }
      <select value={playerRole} onChange={togglePlayerRole} >
        {Object.keys(PlayerRoles).map((key) => (<option key={key} value={PlayerRoles[key]}>{key}</option>))}
      </select>
      <select value={playerTeam} onChange={togglePlayerTeam} >
        <option value={Teams.RED}>Red</option>
        <option value={Teams.BLUE}>Blue</option>
      </select>
      <button onClick={handleFinishTurn}>Finish Turn</button>
      <button onClick={startNewGame}>New Game</button>
      <Grid
        words={words}
        boardKey={key}
        startingTeam={startingTeam}
        playerRole={playerRole}
        revealCard={selectCard}
        revealedCards={revealedCards}
        isGameOver={isGameOver}
      />
      <Clue
        clue={clue}
        setClue={setClue}
        isVisible={
          playerRole === PlayerRoles.Spymaster
          && playerTeam === currentGuessingTeam
        }
      />

    </div>
  );
}

export default Board;