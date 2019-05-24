import React, { Component } from 'react'
import PlayerReady from './PlayerReady'

export default class PlayerSide extends Component {

    render() {
        return (
            <div className="half-field" style={{}}>

                <PlayerReady />

                <h3>{'-'}</h3>

                <div className="scores">
                    <p>SCORE: <span className="scores-style">{'-'}</span></p>
                </div>

                <div className="random-char">{'-'}</div>

                {/* MechanismGameButtons */}
                {}
                <div className="btns">
                    <button className='btn-game'>a</button>
                    <button className='btn-game'>s</button>
                    <button className='btn-game'>d</button>
                </div>

                <div className='player'>
                    <div className={`player-img1`} style={{}} >{}</div>
                </div>
            </div>
        )
    }
}
