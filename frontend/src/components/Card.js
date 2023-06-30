/* eslint-disable no-unused-vars */
import '../styles/Card.css'
import { PlayerRoles, Teams, TeamStyleTags } from '../consts'

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
            return TeamStyleTags[category]
        }
        if ( playerRole !== PlayerRoles.Spymaster) {
            return TeamStyleTags[Teams.NEUTRAL]
        }
        return TeamStyleTags[category]
    }

    const cardColour = determineCardColour(isRevealed, category, playerRole)

    return (
        <div
            className={`card ${isRevealed ? 'flip' : '' }`}>
            <button onClick={() => revealCard(id)} className="front neutral">{word}</button>
            <div className={`back ${cardColour}`}></div>
        </div>
    )

}

export default Card