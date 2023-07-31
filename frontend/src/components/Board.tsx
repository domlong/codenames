import { useState, useMemo, useRef, useEffect } from 'react'
import Grid from './Grid'
import Clue from './Clue'
import '../styles/Grid.css'
import '../styles/Board.css'
import { TeamNames } from '../consts'
import { Team, Role, Clue as ClueType } from '../types'

function Board() {
  const [key, setKey] = useState([])
  const [revealedCards, setRevealedCards] = useState<number[]>([])
  const [playerRole, setPlayerRole] = useState<Role>(Role.Operative)
  const [playerTeam, setPlayerTeam] = useState<Team>(Team.RED)
  const [startingTeam, setStartingTeam] = useState<Team>()
  const [currentGuessingTeam, setCurrentGuessingTeam] = useState<Team | null>(null)
  const [clue, setClue] = useState<ClueType>({ text: '', number: 0 })
  const [words, setWords] = useState([])
  const [gameIdInput, setGameIdInput] = useState(0)
  const [gameId, setGameId] = useState<number | null>(null)
  const [invalidGameId, setInvalidGameId] = useState(false)
  const [waitingToJoin, setWaitingToJoin] = useState(false)
  const timerId = useRef<ReturnType<typeof setInterval> | null>(null)
  const previousGameId = useRef<number | null>(null)

  // networking stuff
  const waitTime = 1000

  const parseRoomNo = (roomNo: string) => {
    const parsed = parseInt(roomNo)
    if(isNaN(parsed)) return 0
    return parsed
  }

  useEffect(() => {
    const parsedUrl = new URL(window.location.href)
    const roomNo = parsedUrl.pathname.replaceAll('/','').replace('room','')

    if(roomNo) {
      const cleanedRoomNo = parseRoomNo(roomNo)
      setGameIdInput(cleanedRoomNo)
      setWaitingToJoin(true)
    }
  }, [])

  useEffect(() => {
    if(gameId){
      const parsedBaseUrl = new URL(window.location.origin)
      const newRoomUrl = parsedBaseUrl + 'room/' + gameId
      history.pushState(null, 'Codenames', newRoomUrl)
    }
  }, [gameId])

  const fetchBoardState = async (gameId: number) => {
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

  async function patchBoardState(board: object, gameId: number) {
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
    if(playerRole === Role.Operative) {
      setPlayerRole(Role.Spymaster)
    }
    if(playerRole === Role.Spymaster) {
      setPlayerRole(Role.Operative)
    }
  }

  const togglePlayerTeam = () => {
    if(playerTeam === Team.RED) {
      setPlayerTeam(Team.BLUE)
    }
    if(playerTeam === Team.BLUE) {
      setPlayerTeam(Team.RED)
    }
  }

  const itIsYourTurn = playerTeam === currentGuessingTeam

  const selectCard = (cardId: number) => {
    // disabled mandatory clue while testing
    // if(itIsYourTurn && playerRole===PlayerRoles.Operative && !waitingForClue) {
      if(itIsYourTurn && playerRole===Role.Operative) {
        if (!revealedCards.includes(cardId)) {
          setRevealedCards([...revealedCards, cardId])
          patchBoardState({
            revealedCards: [...revealedCards, cardId]
          }, gameId as number)
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
    const lastCardCategory = key[revealedCards.slice(-1)[0]]
    const revealedCardColours = revealedCards.map(cardId => key[cardId])
    const scores: { [key in Team]?: number } = {
      [Team.RED]: revealedCardColours.filter(teamCard => teamCard === Team.RED).length,
      [Team.BLUE]: revealedCardColours.filter(teamCard => teamCard === Team.BLUE).length
    }

    if(lastCardCategory === Team.BLACK && currentGuessingTeam) {
      scores[currentGuessingTeam] = 9
    }
    return scores
  }, [revealedCards, currentGuessingTeam, key])

  const togglePlayerTeamTurn = () => {
    if(currentGuessingTeam === Team.RED && gameId) {
      setCurrentGuessingTeam(Team.BLUE)
      patchBoardState({
        currentGuessingTeam: Team.BLUE,
        clue: { text: '', guesses: 0 }
      }, gameId)
    }
    else if(gameId) {
      setCurrentGuessingTeam(Team.RED)
      patchBoardState({
        currentGuessingTeam: Team.RED,
        clue: { text: '', number: 0 }
      }, gameId)
    }
    setClue({ text: '', number: 0 })
  }

  function checkWinCondition() {
    return (
      Object.values(scores).includes(9)
      || (scores[Team.RED] === 8 && startingTeam === Team.BLUE)
      || (scores[Team.BLUE] === 8 && startingTeam === Team.RED)
    )
  }

  const startNewGame = () => {
    if(timerId.current !== null) {
      clearInterval(timerId.current)
      previousGameId.current = gameId
    }
    fetchNewGame()
  }


  const isGameOver = checkWinCondition()

  function getTeamName(teamNum: Team) {
    return Team[teamNum]
  }

  const winner = (scores[Team.RED] ?? 0)  > (scores[Team.BLUE] ?? 0) ? Team.RED : Team.BLUE


  const joinGame = async (gameId: number) => {
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

  const startPolling = (gameId: number) => {
    if(timerId.current !== null) {
      clearInterval(timerId.current)
    }
    timerId.current = setInterval(() => fetchBoardState(gameId), waitTime)
  }

  function hostGame() {
    startNewGame()
  }

  const sendClue = (newClue: ClueType) => {
    setClue(newClue)
    patchBoardState({
      clue: newClue
    }, gameId as number)
  }

  const waitingForClue = clue.text.length === 0

  const isClueGiver = playerRole === Role.Spymaster
                        && playerTeam === currentGuessingTeam

  if (!gameId || waitingToJoin) {
    return (
      <div className='container-centred'>
        <div id='splash'>
          <h1>Crudnames</h1>
          <h3>{`Select Team: ${TeamNames[playerTeam]}`}</h3>
          <button onClick={() => setPlayerTeam(Team.RED)}>Red Team</button>
          <button onClick={() => setPlayerTeam(Team.BLUE)}>Blue Team</button>
          <h3>{`Select Role: ${playerRole}`}</h3>
          <button onClick={() => setPlayerRole(Role.Spymaster)}>Spymaster (cluegiver)</button>
          <button onClick={() => setPlayerRole(Role.Operative)}>Operative (guesser)</button>
          {waitingToJoin
            ?
            <div id="join-game">
              <button onClick={() => {joinGame(gameIdInput); setWaitingToJoin(false)}}>Join Room {gameIdInput}</button>
          </div>
          :
          <>
          <div id="join-game">
            <input type="number" placeholder="Enter Game ID" onChange={e => setGameIdInput(parseInt(e.target.value) || 0)}></input>
            <button onClick={() => joinGame(gameIdInput)}>Join Room</button>
          </div>
          <button onClick={hostGame}>Create Room</button>
        </>
          }
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
      <div id='game-info'>
        <div id='splash'>
          <h1>Crudnames</h1>
          <div id='gameId'>
            <h2 style={{ display: 'inline' }}>{`Game ID: ${gameId}`}</h2>
            <button onClick={() => {navigator.clipboard.writeText(gameId.toString())}}>Copy Game ID</button>
          </div>
          <h2 style={{ color: `var(--${getTeamName(playerTeam).toLowerCase()})` }}>You are on team {getTeamName(playerTeam)}</h2>
          {!isGameOver &&
          <div>
            <h2>{`red: ${scores[Team.RED]}, blue: ${scores[Team.BLUE]}`}</h2>
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
      </div>
      <Grid
        words={words}
        boardKey={key}
        startingTeam={startingTeam as Team}
        playerRole={playerRole}
        revealCard={selectCard}
        revealedCards={revealedCards}
        isGameOver={isGameOver}
      />
    </div>
  )
}

export default Board