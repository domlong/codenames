import Card from "./Card";
import '../styles/Grid.css'

function Grid(props) {

  const categoryMap = {
    0: 'neutral',
    1: 'teamA',
    2: 'teamB',
    3: 'assassin'
}

  const cards = props.words.map((x,i) => {
    return (
    <Card key={i} word={x} category={props.boardKey[i]} playerRole={props.playerRole} revealCard={props.revealCard} isRevealed={props.revealedCards.includes(i)} id={i}/>
    )
  })
    
  return (
    <div className={`grid ${categoryMap[props.startingTeam]}`}>
        {cards}
    </div>
  );
}

export default Grid;