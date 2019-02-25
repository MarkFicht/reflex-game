import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Redirect } from 'react-router-dom';

import Player from './Player';

import countdownPrepare from '../../sound/countdownPrepare.wav';
import countdownTime from '../../sound/countdownTime.mp3';


class Timer extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            prepare: 3,
            time: 10,
            startPrepare: false,
            startTime: false,
            scoresPlayers: []
        }
        this.countdownPrepareSound = new Audio( countdownPrepare );
        this.countdownTimeSound = new Audio( countdownTime );
    }

    componentDidMount() {
        this._isMounted = true;

        firebase.database().ref('/users').on('value', snap => {

            const val = snap.val();
            const usersScores = [];

            for (let key in val) {
                usersScores.push({
                    who: key,
                    nickname: val[key].nickname,
                    points: val[key].points
                })
            }

            if ( this._isMounted ) {
                this.setState({ scoresPlayers: usersScores });
            }
        })
    }

    componentDidUpdate() {
        let { howManyOnline, displayBtns, idPlayer } = this.props;

        /** ---For a case: Back Btn in browser--- */
        window.onpopstate = () => {

            if ( this._isMounted ) { 
                const { time } = this.state;

                if (time > 3) {       /** ----------------------TEST-------------------- */
                    firebase.database().ref('/game').update({
                        disconnect: true,
                    })
                }
                // console.log('Time ' + time);
            }
        }

        /** ---Start game--- */
        if (howManyOnline === 2 && idPlayer[1]) {

            if (!this.state.startPrepare && !displayBtns) {

                if (this._isMounted) {

                    this.setState({
                        startPrepare: true
                    })
                    this.startPrepareFoo( this.countdownPrepareSound, .25 );     // startTimeFoo() inside
                }
            }
        }
    }

    componentWillUnmount() {
        this.countdownPrepareSound = null;
        this.countdownTimeSound = null;
        this._isMounted = false;
    }

    startPrepareFoo = (music, volumeParam) => {
        // let audio = new Audio(music);
        // audio.volume = volumeParam;
        // audio.play();

        music.volume = volumeParam;
        music.play();

        const preparePlayers = setInterval(() => {

            this.setState((prevState) => {
                return { prepare: prevState.prepare - 1 }
            })

            if (this.state.prepare < 0) {

                this.setState({
                    startTime: true
                })
                music = null;
                clearInterval(preparePlayers);
                this.startTimeFoo( this.countdownTimeSound, .3 );
            }

        }, 1000)
    }

    startTimeFoo = (music, volumeParam) => {
        // let audio = new Audio(music);
        // audio.volume = volumeParam;

        music.volume = volumeParam;

        const timePlayers = setInterval(() => {

            this.setState((prevState) => {
                return { time: prevState.time - 1 }
            })

            if (this.state.time === 4) {
                music.play();                
            }

            if (this.state.time === 0) {
                music = null;
                clearInterval(timePlayers);
            }

        }, 1000)
    }

    renderRedirectToGameOver = (isMounted) => {
        if (this.state.time === 0 && isMounted) {
            return <Redirect to={{
                pathname: '/gameover',
                state: this.state.scoresPlayers
            }} />
        }
    }

    render() {
        const { prepare, time, startPrepare, startTime } = this.state;
        const countPrepare = prepare === 0 ? 'start' : prepare;
        const timerColor = {
            color:
                (time <= 12 && time > 5 && 'darkorange') ||
                (time <= 5 && 'darkred')
        };

        return (
            <>
                {this.props.idPlayer[1] &&
                    <div className="timer">
                        TIME: <span style={timerColor}>{time}</span>
                    </div>
                }

                {(this.props.idPlayer[1] && startPrepare && !startTime) &&
                    <div className='prepare'>{countPrepare}</div>
                }

                { this.renderRedirectToGameOver(this._isMounted) }

                <Player startTime={startTime} idPlayer={this.props.idPlayer} />
            </>
        )
    }
}

export default Timer;