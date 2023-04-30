import '../styles/Card.css'
import { PlayerRoles, Teams, TeamStyleTags } from './consts';

function Card({
    id,
    word,
    category,
    playerRole,
    revealCard,
    isRevealed,
    gameOver,

}) {

    // Make button to let Operatives see the entire board if game is over

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
        <button
            className={`card ${cardColour} ${isRevealed ? 'revealed' : ''} `}
            onClick={()=>revealCard(id)}
            disabled={gameOver}
        >
            <p>{word}</p>
        </button>
    )
}

export default Card;