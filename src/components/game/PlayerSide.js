import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PlayerReady from './PlayerReady'
import { GameConsumer } from '../../context/GameContext'
import GameButtonsAppropriate from '../game/GameButtonsAppropriate'
import GameButtonsDummy from '../../components/other/GameButtonsDummy'

export default class PlayerSide extends Component {

    render() {

        const { side, ID_URL } = this.props
        const appropriatePlayer = (side === ID_URL) ? true : false
        const rightColor = { color: appropriatePlayer ? '#548687' : 'tomato' }
        // console.log(side, ID_URL, typeof side, typeof ID_URL, appropriatePlayer)

        return (
            <GameConsumer>
                {({ players, howManyOnline, startTime, __playerRdy, __prepareTimeBool }) => (
                    <div className="half-field" style={rightColor}>

                        <PlayerReady 
                            side={side} 
                            appropriatePlayer={appropriatePlayer} 
                            howManyOnline={howManyOnline} 
                            players={players} 
                            ID_URL={ID_URL}
                            __playerRdy={__playerRdy} 
                            __prepareTimeBool={__prepareTimeBool} 
                        />

                        <h3>{players[side] ? players[side].nick : '-'}</h3>

                        <div className="scores">
                            <p>SCORE: <span className="scores-style">{players[side] ? players[side].points : '-'}</span></p>
                        </div>

                        <div className="random-char">{players[side] ? players[side].charInGame : '-'}</div>

                        {(players[side] && appropriatePlayer)
                            ? <GameButtonsAppropriate
                                startTime={startTime}
                                who={players[side].who}
                                correctChar={players[side].charInGame}
                                points={players[side].points}
                            />
                            : GameButtonsDummy 
                        }

                        <div className='player'>
                            <div className={`player-img${side + 1}`} style={{ backgroundImage: players[side] && `url(" ${players[side].imgPlayer} ")` }} >{}</div>
                        </div>
                    </div>
                )}
            </GameConsumer>
        )
    }
}

PlayerSide.propTypes = {
    side: PropTypes.number.isRequired,
    ID_URL: PropTypes.number.isRequired
}
