import '../styles/Card.css'
import { PlayerRoles, Teams, TeamStyleTags } from './consts';

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
            return TeamStyleTags[category];
        }
        if ( playerRole !== PlayerRoles.Spymaster) {
            return TeamStyleTags[Teams.NEUTRAL];
        }
        return TeamStyleTags[category];
    }

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