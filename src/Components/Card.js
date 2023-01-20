import '../styles/Card.css'

function Card(props) {

    const categoryMap = {
        0: 'neutral',
        1: 'teamA',
        2: 'teamB',
        3: 'assassin'
    }

    const cardColour = 
    (props.isRevealed && categoryMap[props.category]) ||
    (props.playerRole !== 'spymaster') && categoryMap[0] ||
    categoryMap[props.category];

    return (
        <div
            className={`card ${cardColour}`}
            onClick={()=>props.revealCard(props.id)}
            >
            <p>{props.word}</p>
        </div>
    )
}

export default Card;