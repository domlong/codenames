import '../styles/Card.css'

function Card({
    word,
    category,
    playerRole,
    revealCard,
    isRevealed,
    id
}) {

    const categoryMap = {
        0: 'neutral',
        1: 'teamA',
        2: 'teamB',
        3: 'assassin'
    }

    const cardColour = 
    (isRevealed && categoryMap[category]) ||
    ((playerRole !== 'spymaster') && categoryMap[0]) ||
    categoryMap[category];

    return (
        <div
            className={`card ${cardColour} ${isRevealed ? 'revealed' : ''} `}
            onClick={()=>revealCard(id)}
            >
            <p>{word}</p>
        </div>
    )
}

export default Card;