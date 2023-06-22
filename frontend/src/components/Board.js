import { useState, useMemo, useRef } from 'react'
// import wordList from "../words";
import Grid from './Grid'
import Clue from './Clue'
import '../styles/Grid.css'
import { PlayerRoles, Teams, TeamNames } from '../consts'

function Board() {
  const [key, setKey] = useState([])
  const [revealedCards, setRevealedCards] = useState([])
  const [playerRole, setPlayerRole] = useState(PlayerRoles.Operative)
  const [playerTeam, setPlayerTeam] = useState(Teams.RED)
  const [startingTeam, setStartingTeam] = useState()
  const [currentGuessingTeam, setCurrentGuessingTeam] = useState(null)
  const [clue, setClue] = useState({ text: '', guesses: 0 })
  const [words, setWords] = useState([])
  const [gameIdInput, setGameIdInput] = useState(0)
  const [gameId, setGameId] = useState(null)
  const timerId = useRef(null)
  const previousGameId = useRef(null)

  // networking stuff
  const waitTime = 3000

  // const clearGamePolling = (intervalId)

  const fetchBoardState = (gameId) => {
    const gameUrl = '/boards/' + gameId
    fetch(gameUrl).then(response => response.json()).then(data => {
      setKey(data.boardKey)

      // ok this doesn't work natty cause setInterval is funky in React
      // see Dan Abramov's post
      //
      // if(JSON.stringify(data.revealedCards) !== JSON.stringify(revealedCards)) {
      //   setRevealedCards(data.revealedCards)
      // }
      setRevealedCards(data.revealedCards)
      setCurrentGuessingTeam(data.currentGuessingTeam)
      setClue(data.clue)
      setWords(data.words)
      setStartingTeam(data.startingTeam)
      if(data.nextGameId){
        joinGame(data.nextGameId)
      }
    })
  }

  const fetchNewGame = () => {
    fetch('/newGame').then(response => response.json()).then(data => {
      setRevealedCards(data.revealedCards)
      setStartingTeam(data.startingTeam)
      setCurrentGuessingTeam(data.currentGuessingTeam)
      setKey(data.boardKey)
      setWords(data.words)
      setGameId(data.gameId)
      timerId.current = setInterval(() => fetchBoardState(data.gameId), waitTime)
      if(previousGameId.current) {
        patchBoardState({
          nextGameId: data.gameId
        }, previousGameId.current)
      }
    })
  }

  async function patchBoardState(board, gameId) {
      const gameUrl = '/boards/' + gameId
      try {
        const response = await fetch(gameUrl, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(board),
        })

        const result = await response.text()
        console.log('Success:', result)
      } catch (error) {
        console.error('Error:', error)
      }
  }

  // useEffect(() => {
  //   const intervalId = setInterval(fetchBoardState, waitTime);
  //     return () => clearInterval(intervalId)
  // }, [])

  const togglePlayerRole = () => {
    if(playerRole === PlayerRoles.Operative) {
      setPlayerRole(PlayerRoles.Spymaster)
    }
    if(playerRole === PlayerRoles.Spymaster) {
      setPlayerRole(PlayerRoles.Operative)
    }
  }

  const togglePlayerTeam = () => {
    if(playerTeam === Teams.RED) {
      setPlayerTeam(Teams.BLUE)
    }
    if(playerTeam === Teams.BLUE) {
      setPlayerTeam(Teams.RED)
    }
  }

  const itIsYourTurn = playerTeam === currentGuessingTeam

  const selectCard = (cardId) => {
    // disabled mandatory clue while testing
    // if(itIsYourTurn && playerRole===PlayerRoles.Operative && !waitingForClue) {
      if(itIsYourTurn && playerRole===PlayerRoles.Operative) {
        if (!revealedCards.includes(cardId)) {
          setRevealedCards([...revealedCards, cardId])
          patchBoardState({
            revealedCards: [...revealedCards, cardId]
          }, gameId)
          if((currentGuessingTeam !== key[cardId]) ) {
            togglePlayerTeamTurn()
          }
        }
    }
  }

  const handleFinishTurn = () => {
    togglePlayerTeamTurn()
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
      patchBoardState({
        currentGuessingTeam: Teams.BLUE,
        clue: { text: '', guesses: 0 }
      }, gameId)
    }
    else {
      setCurrentGuessingTeam(Teams.RED)
      patchBoardState({
        currentGuessingTeam: Teams.RED,
        clue: { text: '', guesses: 0 }
      }, gameId)
    }
    setClue({ text: '', guesses: 0 })
  }

  function checkWinCondition() {
    return (
      Object.values(scores).includes(9)
      || (scores[Teams.RED] === 8 && startingTeam === Teams.BLUE)
      || (scores[Teams.BLUE] === 8 && startingTeam === Teams.RED)
    )
  }

  const startNewGame = () => {
    clearInterval(timerId.current)
    previousGameId.current = gameId
    fetchNewGame()
  }


  const isGameOver = checkWinCondition()

  function getTeamName(teamNum) {
    return Object.keys(Teams).find(key => Teams[key] === parseInt(teamNum))
  }

  const winner = Object.keys(scores).reduce((a,b) => scores[a] > scores[b] ? a : b )

  const joinGame = (gameId) => {
    setGameId(gameId)
    fetchBoardState(gameId)
    clearInterval(timerId.current)
    timerId.current = setInterval(() => fetchBoardState(gameId), waitTime)
  }

  function hostGame() {
    startNewGame()
  }

  const sendClue = (newClue) => {
    setClue(newClue)
    patchBoardState({
      clue: newClue
    }, gameId)
  }

  const waitingForClue = clue.text.length === 0

  const isClueGiver = playerRole === PlayerRoles.Spymaster
                        && playerTeam === currentGuessingTeam

  if (!gameId) {
    return (
      <div id='splash'>
        <h1>Crudnames</h1>
        <input type="number" onChange={e => setGameIdInput(e.target.value)}></input>
        <button onClick={() => joinGame(gameIdInput)}>Join</button>
        <button onClick={hostGame}>Host Game</button>
        <h3>{`Team: ${TeamNames[playerTeam]}`}</h3>
        <button onClick={() => setPlayerTeam(Teams.RED)}>Red Team</button>
        <button onClick={() => setPlayerTeam(Teams.BLUE)}>Blue Team</button>
        <h3>{`Role: ${playerRole}`}</h3>
        <button onClick={() => setPlayerRole(PlayerRoles.Spymaster)}>Spymaster (cluegiver)</button>
        <button onClick={() => setPlayerRole(PlayerRoles.Operative)}>Operative (guesser)</button>
      </div>
    )
  }

  return (

    <div id='board'>
      <h1>Crudnames</h1>
      <div id='gameId'>
        <h2 style={{ display: 'inline' }}>{`Game ID: ${gameId}`}</h2>
        <button onClick={() => {navigator.clipboard.writeText(gameId)}}>Copy Game ID</button>
      </div>
      <h2 style={{ color: `${getTeamName(playerTeam)}` }}>YOU ARE TEAM {getTeamName(playerTeam)}</h2>
      {!isGameOver &&
      <div>
        <h2 style={{ color: `${getTeamName(currentGuessingTeam)}` }}>{`IT IS ${getTeamName(currentGuessingTeam)}'S TURN`}</h2>
        <h2>{`red: ${scores[Teams.RED]}, blue: ${scores[Teams.BLUE]}`}</h2>
      </div>
      }
      {isGameOver &&
        <div>
          <h2>GAME OVER</h2>
          <h2 style={{ color: `${getTeamName(winner)}` }}>{`${getTeamName(winner)} WINS!!`}</h2>
        </div>
      }
      <button onClick={togglePlayerRole} disabled={isGameOver}>Toggle Role</button>
      <button onClick={togglePlayerTeam} disabled={isGameOver}>Toggle Team</button>
      <button onClick={handleFinishTurn} disabled={isGameOver}>Finish Turn</button>
      <button onClick={startNewGame}>New Game</button>
      <Clue
        clue={clue}
        sendClue={sendClue}
        isVisible={isClueGiver}
        waitingForClue={waitingForClue}
        gameOver={isGameOver}
      />
      <Grid
        words={words}
        boardKey={key}
        startingTeam={startingTeam}
        playerRole={playerRole}
        revealCard={selectCard}
        revealedCards={revealedCards}
        isGameOver={isGameOver}
      />
    </div>
  )
}

export default Board