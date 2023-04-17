import Card from "./Card";
import '../styles/Grid.css'

function Grid({
  words,
  boardKey,
  startingTeam,
  playerRole,
  revealCard,
  revealedCards
}) {

  const categoryMap = {
    0: 'neutral',
    1: 'teamA',
    2: 'teamB',
    3: 'assassin'
}

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
    <div className={`grid ${categoryMap[startingTeam]}`}>
        {cards}
    </div>
  );
}

export default Grid;