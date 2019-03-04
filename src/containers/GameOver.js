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
            playersFromGame: [],
            pending: true
        }
        this.gameOverVoice = null;
    }

    componentDidMount() {
        this._isMounted = true;

        /** Redirect to HOME */
        if (!this.props.location.state && this._isMounted) {
            this._isMounted = false;
            this.props.history.push('/');
        }

        /**  */
        if ( this._isMounted ) {
            const { userId, simpleValid } = this.props.match.params;

            firebase.database().ref('/users').on('value', snap => {

                const val = snap.val();
                const prepareDropDB = [];

                for (let key in val) {
                    prepareDropDB.push({
                        validChars: val[key].validChars
                    })
                }

                if ( this._isMounted ) {
                    const validChars = prepareDropDB[userId] ? prepareDropDB[userId].validChars : null;

                    if (validChars === simpleValid) {
                        const endPlayer = `endPlayer${Number(userId) + 1}`;

                        firebase.database().ref('/game').update({
                            [endPlayer]: true,
                        })
                    }
                }
            })     
            
            /**  */
            firebase.database().ref('/game').on('value', snap => {
                const val = snap.val();
                
                if ( this._isMounted && val.endPlayer1 && val.endPlayer2 ) {

                    firebase.database().ref('/game').update({
                        endPlayer1: false,
                        endPlayer2: false
                    })

                    firebase.database().ref('/users').remove();
                }
            })

            /**  */
            // firebase.database().ref('/game/bestScores').on('value', snap => {

            //     console.log('polaczono z best scores', snap.val())
            //     const val = snap.val();
            //     let arr = [];

            //     if ( !val ) {
            //         arr.push({
            //             name: '123',
            //             score: 1
            //         })
            //     } else {
                    
            //         console.log( 'wykonuje elsa', val[ val.length - 1 ].score, this.props.location.state[0].points )
            //         if ( val[ val.length - 1 ].score < this.props.location.state[0].points ) {
            //             console.log('Dodaje rekord', arr);
            //             arr = [ ...val, { name: this.props.location.state[0].nickname, score: this.props.location.state[0].points } ].sort( (a, b) => { return b.score - a.score } );
            //             console.log('Dodano i posortowano', arr);
            //         }

            //     }
            // })

            /**  */
            this.setState({
                playersFromGame: this.props.location.state,
                pending: false
            });

            this.gameOverVoice = setTimeout( () => {

                this.gameover = new Audio(gameover).play();
                this.gameover.volume = .4;
                clearTimeout( this.gameOverVoice );
            }, 1500);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        clearTimeout( this.gameOverVoice );
    }

    playAgain = () => {
        if ( this._isMounted ) {

            this._isMounted = false;
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

                    <WhoWin playersFromGame={this.state.playersFromGame} simpleValid={this.props.match.params.simpleValid} />

                    <button className="btn-gameover" onClick={ this.playAgain }>Play again?</button>
                </div>
            </div>
        );
    }
}

export default GameOver;