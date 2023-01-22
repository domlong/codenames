import { useEffect, useState } from "react";
import wordList from "../words";
import Grid from "./Grid";
import '../styles/Grid.css'

function Board() {
  const [key, setKey] = useState([])
  const [revealedCards, setRevealedCards] = useState([])
  const [playerRole, setPlayerRole] = useState('operative')
  const [playerTeam, setPlayerTeam] = useState(1)
  const [startingTeam, setStartingTeam] = useState()
  const [isRedsTurn, setIsRedsTurn] = useState(false)
  const [scores, setScores] = useState({1: 0, 2: 0})
  const [words, setWords] = useState([])
  const [initialised, setInitialised] = useState(false)

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  const generateNewBoardKey = () => {
    const newKey = [ ...Array(8).fill(1), ...Array(8).fill(2), ...Array(7).fill(0), 3]
    const newStartingTeam = Math.floor(Math.random() * 2 + 1)
    newKey.push(newStartingTeam)
    setStartingTeam(newStartingTeam)
    setIsRedsTurn(newStartingTeam===1)
    shuffleArray(newKey)
    setKey(newKey)
  }

  const togglePlayerRole = (event) => {
    setPlayerRole(event.target.value)
  }

  const togglePlayerTeam = (event) => {
    setPlayerTeam(parseInt(event.target.value))
  }

  const itIsYourTurn = isRedsTurn ? playerTeam===1 : playerTeam===2;

  const selectCard = (cardId) => {
    if(itIsYourTurn) {
        revealCard(cardId)
        if((isRedsTurn && key[cardId] !== 1) || (!isRedsTurn && key[cardId] !== 2) ) {
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
    setIsRedsTurn(prevState => !prevState)
  }

  const checkWinCondition = () => {
    return (
      Object.values(scores).includes(9) ||
      (scores[1] === 8 && startingTeam===2) ||
      (scores[2] === 8 && startingTeam===1)     
    )
  }

  const startNewGame = () => {
    setRevealedCards([])
    generateNewBoardKey()
    shuffleArray(wordList)
    setWords(wordList.slice(0,25))
  }

  if(!initialised) {
    shuffleArray(wordList)
    generateNewBoardKey()
    setWords(wordList.slice(0,25))
    setInitialised(true)
  }
    
  return (
    <div id='board'>
      <h2>IT IS {isRedsTurn ? "RED'S" : "BLUE'S"} TURN</h2>
      <h2>{`red: ${scores[1]}, blue: ${scores[2]}`}</h2>
      <h2>{`TEAM IS ${playerTeam}`}</h2>
      <select value={playerRole} onChange={togglePlayerRole} >
        <option value='spymaster'>Spymaster</option>
        <option value='operative'>Operative</option>
      </select>
      <select value={playerTeam} onChange={togglePlayerTeam} >
        <option value={1}>Red</option>
        <option value={2}>Blue</option>
      </select>
      <button onClick={handleFinishTurn}>Finish Turn</button>
      <button onClick={startNewGame}>New Game</button>
      <Grid words={words} boardKey={key} startingTeam={startingTeam} playerRole={playerRole} revealCard={selectCard} revealedCards={revealedCards}/>
    </div>
  );
}

export default Board;