import '../styles/Card.css'

function Card(props) {
    return (
        <div className='card'>
            <p>{props.word}</p>
        </div>
    )
}

export default Card;