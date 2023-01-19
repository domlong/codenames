import { useState } from "react";
import wordList from "../words";
import Card from "./Card";

function Grid() {

  const words = wordList.slice(0,25)
  const cards = words.map((x,i) => {
    return (
    <Card key={i} word={x} />
    )
  })
    
  return (
    <div className="Grid">
        {cards}
    </div>
  );
}

export default Grid;