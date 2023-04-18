import Card from "./Card";
import '../styles/Grid.css'
import { TeamStyleTags } from "./consts";

function Grid({
  words,
  boardKey,
  startingTeam,
  playerRole,
  revealCard,
  revealedCards
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