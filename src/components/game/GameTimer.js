import React, { Component } from 'react'
import { GameConsumer } from '../../context/GameContext'
import waitingForPlayers from '../../components/other/waitingForPlayers'

export default class GameTimer extends Component {

    render() {
        return (
            <GameConsumer>
                {({ howManyOnline }) => (
                    <>
                        { howManyOnline % 2 === 1 && waitingForPlayers }

                        <div className="timer">
                            TIME: <span style={{}}>{30}</span>
                        </div>
                        <div className='prepare'>{3}</div>
                    </>
                )}
            </GameConsumer>
        )
    }
}
