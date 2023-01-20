import { useState } from "react";
import wordList from "../words";
import Grid from "./Grid";
import '../styles/Grid.css'

function Board() {
  const [key, setKey] = useState([])
  const [revealedCards, setRevealedCards] = useState([])
  const [playerRole, setPlayerRole] = useState('operative')
  const [playerTeam, setPlayerTeam] = useState(1)
  const [startingTeam, setStartingTeam] = useState()
  const [isRedsTurn, setIsRedsTurn] = useState()
  // const [scores, setScores] = useState([0,0])
  const [words, setWords] = useState([])
  const [initialised, setInitialised] = useState(false)

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  const generateNewBoardKey = () => {
    const newKey = [ ...Array(8).fill(1), ...Array(8).fill(2), ...Array(7).fill(0), 3, Math.floor(Math.random() * 2 + 1) ]
    setStartingTeam(newKey[24])
    setIsRedsTurn(newKey[24]===1)
    shuffleArray(newKey)
    setKey(newKey)
  }

  const togglePlayerRole = (event) => {
    setPlayerRole(event.target.value)
  }

  const togglePlayerTeam = (event) => {
    setPlayerTeam(event.target.value)
  }

  const selectCard = (cardId) => {
    revealCard(cardId)
    if(isRedsTurn && key[cardId] !== 1 || (!isRedsTurn && key[cardId] !== 2) ) {
      togglePlayerTeamTurn()
    }
    if(checkWinCondition()) {console.log('game over')}
  }

  const handleFinishTurn = () => {
    togglePlayerTeamTurn()
  }

  const revealCard = (cardId) => {
    if (!revealedCards.includes(cardId)) {
      setRevealedCards([...revealedCards, cardId])
    }
  }

  const togglePlayerTeamTurn = () => {
    setIsRedsTurn(prevState => !prevState)
  }

  const checkWinCondition = () => {
    const scores = [];
    scores.push(revealedCards.filter(x => key[x]===1 ).length)
    scores.push(revealedCards.filter(x => key[x]===2 ).length)

    console.log(revealedCards)
    console.log(scores)

    return (
      scores.includes(9) ||
      scores[0] === 8 && startingTeam===2 ||
      scores[1] === 8 && startingTeam===1      
    )

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
      {console.log('starting team:', startingTeam)}
      {console.log("is red's turn",isRedsTurn)}
      <select value={playerRole} onChange={togglePlayerRole} >
        <option value='spymaster'>Spymaster</option>
        <option value='operative'>Operative</option>
      </select>
      <select value={playerTeam} onChange={togglePlayerTeam} >
        <option value={1}>Red</option>
        <option value={2}>Blue</option>
      </select>
      <button onClick={handleFinishTurn}>Finish Turn</button>
      <Grid words={words} boardKey={key} startingTeam={startingTeam} playerRole={playerRole} revealCard={selectCard} revealedCards={revealedCards}/>
    </div>
  );
}

export default Board;