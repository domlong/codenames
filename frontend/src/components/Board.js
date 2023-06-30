import { useState, useMemo, useRef } from 'react'
import Grid from './Grid'
import Clue from './Clue'
import '../styles/Grid.css'
import '../styles/Board.css'
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
  const [invalidGameId, setInvalidGameId] = useState(false)
  const timerId = useRef(null)
  const previousGameId = useRef(null)

  // networking stuff
  const waitTime = 1000

  const fetchBoardState = async (gameId) => {
    const gameUrl = '/boards/' + gameId
    const response = await fetch(gameUrl)
    if(response.ok) {
      const data = await response.json()
      setKey(data.boardKey)
      setRevealedCards(data.revealedCards)
      setCurrentGuessingTeam(data.currentGuessingTeam)
      setClue(data.clue)
      setWords(data.words)
      setStartingTeam(data.startingTeam)
      if(data.nextGameId){
        joinGame(data.nextGameId)
      }
    }
    return response.ok
  }

  const fetchNewGame = async () => {
    try {
      const response = await fetch('/newGame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      const data = await response.json()
      if(data) {
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
      }
    } catch (error) {
      console.error('Error:', error)
    }
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

        // eslint-disable-next-line
        const _result = await response.text()
      } catch (error) {
        console.error('Error:', error)
      }
  }

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

  const joinGame = async (gameId) => {
    const doesGameExist = await fetchBoardState(gameId)
    if (doesGameExist) {
      setInvalidGameId(false)
      setGameId(gameId)
      startPolling(gameId)
    }
    else {
      setInvalidGameId(true)
    }
  }

  const startPolling = (gameId) => {
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
      <div className='container-centred'>
        <div id='splash'>
          <h1>Crudnames</h1>
          <h3>{`Select Team: ${TeamNames[playerTeam]}`}</h3>
          <button onClick={() => setPlayerTeam(Teams.RED)}>Red Team</button>
          <button onClick={() => setPlayerTeam(Teams.BLUE)}>Blue Team</button>
          <h3>{`Select Role: ${playerRole}`}</h3>
          <button onClick={() => setPlayerRole(PlayerRoles.Spymaster)}>Spymaster (cluegiver)</button>
          <button onClick={() => setPlayerRole(PlayerRoles.Operative)}>Operative (guesser)</button>
          <div id="join-game">
            <input type="number" placeholder="Enter Game ID" onChange={e => setGameIdInput(e.target.value)}></input>
            <button onClick={() => joinGame(gameIdInput)}>Join Room</button>
          </div>
          <button onClick={hostGame}>Create Room</button>
      </div>
      <div id='invalid-game' className={`${invalidGameId ? 'alert-shown' : 'alert-hidden'}`}
          onTransitionEnd={() => setInvalidGameId(false)}>
              <p>Game does not exist. Enter valid game ID or create a room.</p>
          </div>
      </div>
    )
  }

  return (

    <div id='board'>
      <div id='splash'>
        <h1>Crudnames</h1>
        <div id='gameId'>
          <h2 style={{ display: 'inline' }}>{`Game ID: ${gameId}`}</h2>
          <button onClick={() => {navigator.clipboard.writeText(gameId)}}>Copy Game ID</button>
        </div>
        <h2 style={{ color: `var(--${getTeamName(playerTeam).toLowerCase()})` }}>You are on team {getTeamName(playerTeam)}</h2>
        {!isGameOver &&
        <div>
          {/* <h2 style={{ color: `${getTeamName(currentGuessingTeam)}` }}>{`IT IS ${getTeamName(currentGuessingTeam)}'S TURN`}</h2> */}
          <h2>{`red: ${scores[Teams.RED]}, blue: ${scores[Teams.BLUE]}`}</h2>
        </div>
        }
        {isGameOver &&
          <div>
            <h2>GAME OVER</h2>
            <h2 style={{ color: `var(--${getTeamName(winner).toLowerCase()})` }}>{`${getTeamName(winner)} WINS!!`}</h2>
          </div>
        }
        <button onClick={togglePlayerRole} disabled={isGameOver}>Toggle Role</button>
        <button onClick={togglePlayerTeam} disabled={isGameOver}>Toggle Team</button>
        <button onClick={handleFinishTurn} disabled={isGameOver}>Finish Turn</button>
        <button onClick={startNewGame}>New Game</button>
      </div>
      <Clue
        clue={clue}
        sendClue={sendClue}
        itIsYourTurn={itIsYourTurn}
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