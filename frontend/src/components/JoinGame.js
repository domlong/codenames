import { useState } from 'react'
import { Teams, TeamNames, PlayerRoles } from '../consts'


function JoinGame({ joinFromUrl, playerRole, playerTeam, setPlayerRole, setPlayerTeam, gameIdInput, setGameIdInput, joinGame, hostGame, invalidGameId, setInvalidGameId }) {
    return (
      <div className='container-centred'>
        <div id='splash'>
          <h1>Crudnames</h1>
          <h3>{`Select Team: ${TeamNames[playerTeam]}`}</h3>
          <button onClick={() => setPlayerTeam(Teams.RED)}>Red Team</button>
          <button onClick={() => setPlayerTeam(Teams.BLUE)}>Blue Team</button>
          <h3>{`Select Role: ${playerRole}`}</h3>
          <button onClick={() => setPlayerRole(PlayerRoles.Spymaster)}>Spymaster (cluegiver)</button>
          <button onClick={() => setPlayerRole(PlayerRoles.Operative)}>Operative (guesser)</button>
          <div id="join-game">
            <input type="number" placeholder="Enter Game ID" onChange={e => setGameIdInput(e.target.value)}></input>
            <button onClick={() => joinGame(gameIdInput)}>Join Room</button>
          </div>
          <button onClick={hostGame}>Create Room</button>
      </div>
      <div id='invalid-game' className={`${invalidGameId ? 'alert-shown' : 'alert-hidden'}`}
          onTransitionEnd={() => setInvalidGameId(false)}>
              <p>Game does not exist. Enter valid game ID or create a room.</p>
          </div>
      </div>
    )
}

export default JoinGame