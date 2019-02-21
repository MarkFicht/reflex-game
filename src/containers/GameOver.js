import React from 'react';
import * as firebase from 'firebase';

import WhoWin from '../components/gameover/WhoWin';

import logo from '../components/other/logo';
import gameover from '../sound/gameover.mp3';


class GameOver extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            players: [],
            pending: true
        }
        this.gameOverId = null;
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

        this.gameOverId = setTimeout( () => {
            this.gameover = new Audio(gameover).play();
            this.gameover.volume = .4;
        }, 1500)

        window.addEventListener('beforeunload', (e) => {
            this.playAgain();
        });
    };

    componentWillUnmount() {
        this.playAgain();
        clearTimeout(this.gameOverId);
    }

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