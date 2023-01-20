import '../styles/Card.css'

function Card(props) {

    const categoryMap = {
        0: 'neutral',
        1: 'teamA',
        2: 'teamB',
        3: 'assassin'
    }

    return (
        <div className={`card ${categoryMap[props.category]}`} >
            <p>{props.word}</p>
        </div>
    )
}

export default Card;