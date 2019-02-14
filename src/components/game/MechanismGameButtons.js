import React, { Component } from 'react';
import * as firebase from 'firebase';

import randomChar from '../../components/other/randomChar';
import good from '../../sound/good.wav';
import wrong from '../../sound/wrong.mp3';


class MechanismGameButtons extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.good = null;
        this.bad = null;
    }

    componentDidMount() {
        this._isMounted = true;

        if (this._isMounted) {
            window.addEventListener('keydown', this.keyEvent);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        window.removeEventListener('keydown', this.keyEvent);
    }

    /** Keyboard support */
    keyEvent = e => {
        // console.log(`keydown na window - dziala. Props ${this.props.startTime},  State ${this.state.startTime}`);
        if (!this.props.startTime) {
            return null;
        }

        /* a-65, s-83, d-68  ||  x-88, y-89, z-90 */
        if (e.keyCode === 65 || e.keyCode === 83 || e.keyCode === 68) {

            let clickedChar = null;

            if (e.keyCode === 65) clickedChar = randomChar[0];
            else if (e.keyCode === 83) clickedChar = randomChar[1];
            else if (e.keyCode === 68) clickedChar = randomChar[2];

            this.addOrSubtractPoint(clickedChar);
        }
    }

    /** Mouse support */
    mouseEvent = clickedChar => {
        if (!this.props.startTime) {
            return null;
        }

        this.addOrSubtractPoint(clickedChar);
    }

    /** Main mechanism of the game */
    addOrSubtractPoint = (clickedChar) => {

        const { who, correctChar, points } = this.props;

        if (clickedChar === correctChar) {

            let charsetLength = randomChar.length;
            let newChar = randomChar[Math.floor(Math.random() * charsetLength + 1) - 1];

            firebase.database().ref('/users/' + who).update({
                points: points + 1,
                char: newChar
            })

            this.good = new Audio(good).play();
            this.good = null;
        }
        else {
            firebase.database().ref('/users/' + who).update({
                points: points - 1
            })

            this.wrong = new Audio(wrong).play();
            this.wrong = null;
        }
    }

    render() {
        const { startTime } = this.props;
        const style = { cursor: startTime ? 'pointer' : 'not-allowed' }

        return (
            <div className="btns">
                {randomChar.map(char => {

                    return <button onClick={e => this.mouseEvent(char)} disabled={!startTime && true} style={style} className='btn-game' key={char}>{char}</button>
                })}
            </div>
        )
    }
}

export default MechanismGameButtons;