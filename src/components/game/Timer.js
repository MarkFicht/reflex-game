import React, { Component } from 'react';
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
            startTime: false
        }
    }

    componentDidMount() {
        const [id, bool] = this.props.idPlayer;
        this._isMounted = bool ? true : false;
    }

    componentDidUpdate() {
        let { howManyOnline, displayBtns, idPlayer } = this.props;

        if (howManyOnline === 2 && idPlayer[1]) {

            if (!this.state.startPrepare && !displayBtns) {

                if (this._isMounted) {

                    this.setState({
                        startPrepare: true
                    })
                    this.startPrepareFoo(countdownPrepare, .25);     // startTimeFoo() inside
                }
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    startPrepareFoo = (music, volumeParam) => {
        let audio = new Audio(music);
        audio.volume = volumeParam;
        audio.play();

        const preparePlayers = setInterval(() => {

            this.setState((prevState) => {
                return { prepare: prevState.prepare - 1 }
            })

            if (this.state.prepare < 0) {

                this.setState({
                    startTime: true
                })
                audio = null;
                clearInterval(preparePlayers);
                this.startTimeFoo(countdownTime, .3);
            }

        }, 1000)
    }

    startTimeFoo = (music, volumeParam) => {
        let audio = new Audio(music);
        audio.volume = volumeParam;

        const timePlayers = setInterval(() => {

            this.setState((prevState) => {
                return { time: prevState.time - 1 }
            })

            if (this.state.time === 4) {
                audio.play();
            }

            if (this.state.time === 0) {
                audio = null;
                clearInterval(timePlayers);
            }

        }, 1000)
    }

    renderRedirectToGameOver = (isMounted) => {
        if (this.state.time === 0 && isMounted) {
            return <Redirect to='/gameover' />
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

                {this.renderRedirectToGameOver(this._isMounted)}

                <Player startTime={startTime} idPlayer={this.props.idPlayer} />
            </>
        )
    }
}

export default Timer;