/* eslint-disable no-unused-vars */
import '../styles/Card.css'
import { TeamStyleTags } from '../consts'
import { Role, Team } from '../types'

interface Props {
    id: number
    word: string
    category: Team
    playerRole: Role
    revealCard: (id: number) => void
    isRevealed: boolean
    gameOver: boolean
}

function Card({
    id,
    word,
    category,
    playerRole,
    revealCard,
    isRevealed,
    gameOver
}: Props) {

    function determineCardColour(isRevealed: boolean, category: Team, playerRole: Role) {
        if ( isRevealed ) {
            return TeamStyleTags[category]
        }
        if ( playerRole !== Role.Spymaster) {
            return TeamStyleTags[Team.NEUTRAL]
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