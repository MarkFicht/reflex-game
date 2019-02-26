import React from 'react';
import * as firebase from 'firebase';

import WhoWin from '../components/gameover/WhoWin';

import logo from '../components/other/logo';
import gameover from '../sound/gameover.mp3';


class GameOver extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            players: [],
            playersFromGame: [],
            pending: true
        }
        this.gameOverVoice = null;
    }

    componentDidMount() {
        
        /** Redirect to HOME */
        if (!this.props.location.state) {
            this.props.history.push('/');
        }

        this._isMounted = true;

        /**  */
        if (this._isMounted) {

            this.setState({
                playersFromGame: this.props.location.state,
                pending: false
            });

            this.gameOverVoice = setTimeout( () => {

                this.gameover = new Audio(gameover).play();
                this.gameover.volume = .4;
                clearTimeout( this.gameOverVoice );
            }, 1500);

            // firebase.database().ref('/users').remove();
        }
    }

    componentWillUnmount() {
        clearTimeout( this.gameOverVoice );
    }

    playAgain = () => {
        if ( this._isMounted ) {
            this.props.history.push('/');
        }
    };

    //--- RENDER ---//
    render() {

        if (this.state.pending) {
            return null;
        }

        return (
            <div>
                <div className="div-gameover">

                    { logo }
                    <p className='game-over'> GAME OVER </p>

                    <WhoWin playersFromGame={this.state.playersFromGame} />

                    <button className="btn-gameover" onClick={ this.playAgain }>Play again?</button>
                </div>
            </div>
        );
    }
}

export default GameOver;