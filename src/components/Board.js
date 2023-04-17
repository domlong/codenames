import { useEffect, useState } from "react";
import wordList from "../words";
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
  const [key, setKey] = useState([])
  const [revealedCards, setRevealedCards] = useState([])
  const [playerRole, setPlayerRole] = useState(PlayerRoles.Operative)
  const [playerTeam, setPlayerTeam] = useState(Teams.RED)
  const [startingTeam, setStartingTeam] = useState()
  const [currentGuessingTeam, setCurrentGuessingTeam] = useState(Teams.RED)
  const [isSpymasterTurn, setIsSpymasterTurn] = useState(true)
  const [clue, setClue] = useState(['', 0])
  const [scores, setScores] = useState({[Teams.RED]: 0, [Teams.BLUE]: 0})
  const [words, setWords] = useState([])
  
  const generateNewBoardKey = () => {
    const newKey = [
      ...Array(8).fill(Teams.RED),
      ...Array(8).fill(Teams.BLUE),
      ...Array(7).fill(Teams.GREY), 
      Teams.BLACK
    ]
    const newStartingTeam = Math.random() < 0.5 ? Teams.RED : Teams.BLUE;
    newKey.push(newStartingTeam)
    setStartingTeam(newStartingTeam)
    // setIsRedsTurn(newStartingTeam===1)
    setCurrentGuessingTeam(newStartingTeam)
    setIsSpymasterTurn(true)
    shuffleArray(newKey)
    setKey(newKey)
  }

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
        if((currentGuessingTeam===Teams.RED && key[cardId] !== Teams.RED) || (currentGuessingTeam===Teams.BLUE && key[cardId] !== Teams.BLUE) ) {
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

  useEffect(() => updateScores(), [revealedCards])

  const updateScores = () => {
    const lastCardCategory = key[revealedCards.slice(-1)]
    if([1,2].includes(lastCardCategory)) {
      setScores({
        ...scores,
        [lastCardCategory]: scores[lastCardCategory] + 1
      })
    }
  }

  const togglePlayerTeamTurn = () => {
    // setIsRedsTurn(prevState => !prevState)
    if(currentGuessingTeam === Teams.RED) {
      setCurrentGuessingTeam(Teams.BLUE)
    }
    else {
      setCurrentGuessingTeam(Teams.RED)
    }

  }

  // const checkWinCondition = () => {
  //   return (
  //     Object.values(scores).includes(9) ||
  //     (scores[1] === 8 && startingTeam===2) ||
  //     (scores[2] === 8 && startingTeam===1)     
  //   )
  // }

  const startNewGame = () => {
    setRevealedCards([])
    generateNewBoardKey()
    setWords(shuffleArray(wordList).slice(0,25))
    setScores({[Teams.RED]: 0, [Teams.BLUE]: 0})
  }
  
useEffect(() => startNewGame(), [])

  return (
    <div id='board'>
      <h2>IT IS {itIsYourTurn ? "YOUR" : "YOUR OPPONENT'S"} TURN</h2>
      <h2>{`red: ${scores[Teams.RED]}, blue: ${scores[Teams.BLUE]}`}</h2>
      <select value={playerRole} onChange={togglePlayerRole} >
        {Object.keys(PlayerRoles).map((key) => (<option key={key} value={PlayerRoles[key]}>{key}</option>))}
      </select>
      <select value={playerTeam} onChange={togglePlayerTeam} >
        <option value={Teams.RED}>Red</option>
        <option value={Teams.BLUE}>Blue</option>
      </select>
      <button onClick={handleFinishTurn}>Finish Turn</button>
      <button onClick={startNewGame}>New Game</button>
      <Grid words={words} boardKey={key} startingTeam={startingTeam} playerRole={playerRole} revealCard={selectCard} revealedCards={revealedCards}/>
      <Clue setClue={setClue} />
      <h2>Clue: {`${clue[0]}, ${clue[1]}`}</h2>
    </div>
  );
}

export default Board;