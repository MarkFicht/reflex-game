import React, { Component } from 'react'
import ShouldAddNewScores from './ShouldAddNewScores'

class WhoWin extends Component {
    
    render() {
        if ( !this.props.playersFromGame ) return null

        const player1 = this.props.playersFromGame[0]
        const player2 = this.props.playersFromGame[1]

        const winner = player1.points > player2.points ? player1 : player2
        const looser = player1.points < player2.points ? player1 : player2
        const wasDraw = player1.points === player2.points ? true : false

        const displayDraw = (
            <div>
                DRAW: <span className='text-winner'>{ player1.nick }</span> & <span className='text-winner'>{ player2.nick }</span>
                <br />
                SCORE: <span className='text-winner'>{ player1.points }</span>
            </div>
        )
        const displayWinner = (
            <div>
                WINNER: <span className='text-winner'>{ winner.nick }</span> SCORE: <span className='text-winner'>{ winner.points }</span>
                <br />
                looser: <span className='text-looser'>{ looser.nick }</span> score: <span className='text-looser'>{ looser.points }</span>
            </div>
        )

        return (
            <div className='game-winner-container'>
                { wasDraw ? displayDraw : displayWinner }

                <ShouldAddNewScores 
                    simpleValid={ this.props.simpleValid } 
                    winner={ winner } 
                    isDraw={ wasDraw } 
                    playersFromGame={ this.props.playersFromGame }
                />
            </div>
        )
    }
}
export default WhoWin