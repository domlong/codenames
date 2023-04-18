import '../styles/Grid.css'
import { useState } from "react";

function Clue(props) {

  const [clueText, setClueText] = useState('')

  const nums = [ ...Array.from({length: 9}, (_, i) => i + 1), 0]

  const buttons = nums.map((x,i) => {
    return (
      <button key={i} onClick={()=>props.setClue([clueText,x])}>{x}</button>
    )
  })
    
  return (
    <div className={`clue`}>
      <input onChange={e => setClueText(e.target.value)}/>
        {buttons}
    </div>
  );
}

export default Clue;