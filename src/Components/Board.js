import { useState } from "react";
import wordList from "../words";
import Grid from "./Grid";
import '../styles/Grid.css'

function Board() {
  const [key, setKey] = useState([])
  const words = wordList.slice(0,25)

  const generateNewBoardKey = () => {
    const newKey = [ ...Array(8).fill(1), ...Array(8).fill(2), ...Array(7).fill(0), 3, Math.floor(Math.random() * 2 + 1) ]

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
    }

    shuffleArray(newKey)

    setKey(newKey)
  }

  if (!key.length) {
    generateNewBoardKey()
  }

  console.log(key)
    
  return (
    <Grid words={words} boardKey={key}/>
  );
}

export default Board;