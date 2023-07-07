import '../styles/Grid.css'
import { useState } from 'react'
import { Clue as ClueType } from '../types'

interface Props {
  clue: ClueType
  sendClue: (clue: ClueType) => void
  itIsYourTurn: boolean
  isVisible: boolean
  waitingForClue: boolean
  gameOver: boolean
}

function Clue({
  clue,
  sendClue,
  itIsYourTurn,
  isVisible,
  waitingForClue,
  gameOver
}: Props) {

  const [clueText, setClueText] = useState('')

  const nums = [ 0, ...Array.from({ length: 9 }, (_, i) => i + 1)]

  const buttons = nums.map((num, index) => {
    return (
      <button key={index} onClick={() => sendClue({ text: clueText, number: num })}>{num}</button>
    )
  })

  const cluePrompt = () => {
    if(gameOver) {
      return 'GAME OVER'
    }
    if(waitingForClue) {
      if(isVisible) {
        return 'Please enter clue.'
      }
      else return 'Waiting for clue...'
    }
    else {
      return `Clue: ${clue.text}, ${clue.number}`
    }
  }

  return (
    <div className={'clue'}>
      {!gameOver && <h2>{`It is your ${itIsYourTurn ? 'team\'s ' : 'opponent\'s '} turn.`}</h2>}
      <h2>{cluePrompt()}</h2>
      { isVisible && waitingForClue &&
        <div>
          <input onChange={e => setClueText(e.target.value)}/>
          {buttons}
          </div>
      }
    </div>
  )
}

export default Clue