import React, { Component } from 'react';
import countdownPrepare from '../../../sound/countdown.wav';


/** PREPARE GAME TIME - Need {...this.props} from parent for redirection */

let induceTimerOnce = true;
let showHideReadyBtns = true;

class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: false,
            prepareTime: 3,
        }
        this.endPrepare = null; //construktor odswieza caly komponent, dlatego to jest poza
        this.countdownPrepare = new Audio(countdownPrepare);
        this.countdownPrepare.volume = .3;
    }

    componentDidUpdate() {
        if (induceTimerOnce && this.props.users.length === 2 && this.props.users[0].readyPlayer && this.props.users[1].readyPlayer) {
            this.prepareToCount();

            induceTimerOnce = false;
            showHideReadyBtns = false;
        }
    }

    componentWillUnmount() {
        clearInterval(this.endPrepare);
        this.countdownPrepare.pause();
    };

    /**
     * Prepare counter of game
     * Unlock buttons */
    prepareToCount = () => {
        this.setState({ ready: true })
        this.countdownPrepare.play();


        this.endPrepare = setInterval(() => {

            if (this.props.users.length > 1 && this.state.ready) {

                this.setState((prevState) => {
                    return { prepareTime: prevState.prepareTime - 1 }
                })
            }

            if (this.state.prepareTime < 0) {
                clearInterval(this.endPrepare);

                // Hide div prepare
                this.setState({
                    ready: false,
                })

                /** Start Real-Time Game from component Game */
                if (typeof this.props.sendMethod === "function") {
                    this.props.sendMethod(true);
                }
                if (typeof this.props.sendMethodTimer === "function") {
                    this.props.sendMethodTimer();
                }
            }
        }, 1000)
    }

    render() {
        const colorTimer = {
            color:
                ((this.props.gameTime <= 12 && this.props.gameTime > 5) && 'orange') ||
                (this.props.gameTime <= 5 && 'red')
        };

        return (
            <div className="timer">
                TIME: <span style={colorTimer} >{this.props.gameTime}</span>

                {this.props.users.length > 1 && this.state.ready
                    ? <div className='prepare'>{this.state.prepareTime === 0 ? 'start' : this.state.prepareTime}</div>
                    : null
                }
            </div>
        );
    }
}

export default Timer;