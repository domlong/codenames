import '../styles/Card.css'
import { PlayerRoles } from './consts';

function Card({
    word,
    category,
    playerRole,
    revealCard,
    isRevealed,
    id
}) {

    function determineCardColour(isRevealed, category, playerRole) {
        if ( isRevealed ) {
            return categoryMap[category];
        }
        if ( playerRole !== PlayerRoles.Spymaster) {
            return categoryMap[0];
        }
        return categoryMap[category];
    }

    const categoryMap = {
        0: 'neutral',
        1: 'teamA',
        2: 'teamB',
        3: 'assassin'
    }

    // const cardColour = 
    //     (isRevealed && categoryMap[category]) ||
    //     ((playerRole !== PlayerRoles.Spymaster) && categoryMap[0]) ||
    //     categoryMap[category];

    const cardColour = determineCardColour(isRevealed, category, playerRole);

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