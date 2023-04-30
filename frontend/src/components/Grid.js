import Card from "./Card";
import '../styles/Grid.css'
import { TeamStyleTags } from "./consts";

function Grid({
  words,
  boardKey,
  startingTeam,
  playerRole,
  revealCard,
  revealedCards,
  isGameOver
}) {

  const cards = words.map((word,index) => {
    return (
      <Card
        key={index}
        word={word}
        category={boardKey[index]}
        playerRole={playerRole}
        revealCard={revealCard}
        isRevealed={revealedCards.includes(index)}
        gameOver={isGameOver}
        id={index}
      />
    )
  })
    
  return (
    <div className={`grid ${TeamStyleTags[startingTeam]}`}>
        {cards}
    </div>
  );
}

export default Grid;