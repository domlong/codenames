import '../styles/Grid.css'
import { useState } from "react";

function Clue({
  clue,
  setClue,
  isVisible
}) {

  const [clueText, setClueText] = useState('')

  const nums = [ 0, ...Array.from({length: 9}, (_, i) => i + 1)]

  const waitingForClue = clue[0] === '';

  const buttons = nums.map((num, index) => {
    return (
      <button key={index} onClick={()=>setClue([clueText, num])}>{num}</button>
    )
  })
    
  return (
    <div className={`clue`}>
      { isVisible &&
        <div>
          <input onChange={e => setClueText(e.target.value)}/>
          {buttons}
          </div>
      }
      <h2>{ waitingForClue ? 'Waiting for clue...' : `Clue: ${clue[0]}, ${clue[1]}`}</h2>
    </div>
  );
}

export default Clue;