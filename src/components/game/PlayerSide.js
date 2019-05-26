import React, { Component } from 'react'
import PlayerReady from './PlayerReady'
import { GameConsumer } from '../../context/GameContext'
import MechanismGameButtons from '../game/MechanismGameButtons'
import gameButtonsDummy from '../../components/other/gameButtonsDummy'

export default class PlayerSide extends Component {

    render() {

        const { side, ID_URL } = this.props
        const appropriatePlayer = (side === ID_URL) ? true : false
        // console.log(side, ID_URL, typeof side, typeof ID_URL, appropriatePlayer)
        const rightColor = { color: appropriatePlayer ? '#548687' : 'tomato' }
        // const rightGameBtns = users[id] && bool
        //     ? <MechanismGameButtons
        //         startTime={startTime}
        //         idPlayer={this.props.idPlayer}
        //         who={users[id].id}
        //         correctChar={users[id].char}
        //         points={users[id].points} />
        //     : gameButtonsDummy

        return (
            <GameConsumer>
                {({ players }) => (
                    <div className="half-field" style={ rightColor }>
                        <PlayerReady />

                        <h3>{players[side] ? players[side].nick : '-'}</h3>

                        <div className="scores">
                            <p>SCORE: <span className="scores-style">{players[side] ? players[side].points : '-'}</span></p>
                        </div>

                        <div className="random-char">{players[side] ? players[side].charInGame : '-'}</div>

                        {/* MechanismGameButtons */}
                        {/* {(players[side] && appropriatePlayer)
                            ? <MechanismGameButtons />
                            : gameButtonsDummy
                        } */}

                        <div className="btns">
                            <button className='btn-game'>a</button>
                            <button className='btn-game'>s</button>
                            <button className='btn-game'>d</button>
                        </div>

                        <div className='player'>
                            <div className={`player-img${side + 1}`} style={{ backgroundImage: players[side] && `url(" ${players[side].imgPlayer} ")` }} >{}</div>
                        </div>
                    </div>
                )}
            </GameConsumer>
        )
    }
}
