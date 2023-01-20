import Card from "./Card";
import '../styles/Grid.css'

function Grid(props) {

  const cards = props.words.map((x,i) => {
    return (
    <Card key={i} word={x} category={props.boardKey[i]}/>
    )
  })
    
  return (
    <div className="grid">
        {cards}
    </div>
  );
}

export default Grid;