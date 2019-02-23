import React, { Component } from 'react';

class WhoWin extends Component {
    state = {
        players: [],
        pending: true
    }

    componentDidMount() {

        this.setState({
            players: this.props.players,
            pending: false
        })
    }

    render() {
        if ( this.state.pending ) { return null; }

        let player1 = this.state.players ? this.state.players[0] : null;
        let player2 = this.state.players ? this.state.players[1] : null;

        let playerA = player1.points > player2.points ? player1 : player2;
        let playerB = player1.points < player2.points ? player1 : player2;
        let wasDraw = player1.points === player2.points ? true : false;

        return (
            <div className='game-winner'>
                {wasDraw
                    ? <div>
                        DRAW: <span className='text-winner'>{player1.nickname}</span> & <span className='text-winner'>{player2.nickname}</span>
                        <br />
                        SCORE: <span className='text-winner'>{player1.points}</span>
                    </div>

                    : <div>
                        WINNER: <span className='text-winner'>{playerA.nickname}</span> SCORE: <span className='text-winner'>{playerA.points}</span>
                        <br />
                        looser: <span className='text-looser'>{playerB.nickname}</span> score: <span className='text-looser'>{playerB.points}</span>
                    </div>
                }
            </div>
        );
    }
}

export default WhoWin;