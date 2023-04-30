import '../styles/Grid.css'
import { useState } from "react";

function Clue({
  clue,
  sendClue,
  isVisible,
  waitingForClue,
  gameOver
}) {

  const [clueText, setClueText] = useState('')

  const nums = [ 0, ...Array.from({length: 9}, (_, i) => i + 1)]

  const buttons = nums.map((num, index) => {
    return (
      <button key={index} onClick={()=>sendClue([clueText, num])}>{num}</button>
    )
  })

  const cluePrompt = () => {
    if(gameOver) {
      return 'GAME OVER'
    }
    if(waitingForClue) {
      return 'Waiting for clue...'
    }
    else {
      return `Clue: ${clue[0]}, ${clue[1]}`
    }
  }

  return (
    <div className={`clue`}>
      <h2>{cluePrompt()}</h2>
      { isVisible &&
        <div>
          <input onChange={e => setClueText(e.target.value)}/>
          {buttons}
          </div>
      }
    </div>
  );
}

export default Clue;