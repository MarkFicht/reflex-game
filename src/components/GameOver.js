import React, { Component } from 'react';
import * as firebase from 'firebase';

import logo from './static/logo';

//--- REACT COMPONENTS
class WhoWin extends Component {
    render() {
        let player1 = this.props.players[0];
        let player2 = this.props.players[1];

        let playerA = player1.points > player2.points ? player1 : player2;
        let playerB = player1.points < player2.points ? player1 : player2;
        let wasDraw = player1.points === player2.points ? true : false;

        return (
            <div className='game-winner'>
                { wasDraw
                    ? <div>
                        DRAW: <span className='text-winner'>{ player1.nickname }</span> & <span className='text-winner'>{ player2.nickname }</span>
                        <br />
                        SCORE: <span className='text-winner'>{ player1.points }</span>
                    </div>

                    : <div>
                        WINNER: <span className='text-winner'>{ playerA.nickname }</span> SCORE: <span className='text-winner'>{ playerA.points }</span>
                        <br/>
                        looser: <span className='text-looser'>{ playerB.nickname }</span> score: <span className='text-looser'>{ playerB.points }</span>
                    </div>
                }
            </div>
        );
    }
}

//---  *** REACT MAIN COMPONENT ***  ---//
class GameOver extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            players: [],
            pending: true
        }
    }

    componentDidMount() {
        firebase.database().ref('/users').on('value', snap => {
            const value = snap.val();

            if(!value) {
                this.props.history.push('/');
            }

            const players = [];
            for(var key in value) {
                players.push(value[key]);
            }

            this.setState({
                players: players,
                pending: false
            })
        });
    };

    playAgain = () => {
        firebase.database().ref('/users').remove();
    };

    //--- RENDER ---//
    render() {

        if (this.state.pending) {
            return null;
        }

        return (
            <div>
                <div className="div-gameover">

                    {/* Logo */}
                    { logo }
                    {/* GameOver - Text */}
                    <p className='game-over'> GAME OVER </p>
                    {/* Winner */}
                    <WhoWin players={this.state.players} />
                    {/* Play again + Drop DataBase */}
                    <button className="btn-gameover" onClick={this.playAgain}>Play again?</button>

                </div>
            </div>
        );
    }
}

export default GameOver;