import React, { Component } from 'react';
import * as firebase from 'firebase';
import good from '../../../sound/good.wav';
import bad from '../../../sound/wrong.mp3';

import randomChar from '../../other/randomChar';

/** THE MECHANISM OF GAME */

class GameButtons extends Component {
    constructor(props) {
        super(props);
        this.good = null;
        this.bad = null;
    }

    componentDidMount() {
        window.addEventListener('keydown', this.keyEvent);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.keyEvent);
    }

    /**
     * Add point
     * Subtract point */
    addSubtractPoint = (id, char, nr_arr) => {

        if (char === this.props.users[nr_arr].char) {

            let newChar = randomChar[Math.floor(Math.random() * 3 + 1) - 1];

            firebase.database().ref('/users/' + id).update({
                points: this.props.users.find((user) => user.id === id).points + 1, // .find() - robi tablice jednoelementowa
                char: newChar,
            })

            this.good = new Audio(good).play();
            this.good = null;
        }
        else {
            firebase.database().ref('/users/' + id).update({
                points: this.props.users.find((user) => user.id === id).points - 1
            })

            this.bad = new Audio(bad).play();
            this.bad = null;
        }
    }

    /** MOUSE */
    clickRandomChar = (id, char, nr_player) => {
        this.addSubtractPoint(id, char, nr_player);
    };

    /** KEYBOARD */
    keyEvent = e => {
        if (!this.props.game) { return null }

        let nr_arr = this.props.nrPlayer;
        let id = this.props.users[nr_arr].id;

        /* a-65, s-83, d-68  ||  x-88, y-89, z-90 */
        if (e.keyCode === 65 || e.keyCode === 83 || e.keyCode === 68) {

            let char = null;

            if (e.keyCode === 65) char = randomChar[0];
            else if (e.keyCode === 83) char = randomChar[1];
            else if (e.keyCode === 68) char = randomChar[2];

            this.addSubtractPoint(id, char, nr_arr);
        }
    }

    render() {
        const nr = this.props.nrPlayer;

        return (
            <div className="btns">
                {randomChar.map(char => {
                    return (
                        <button disabled={this.props.game ? false : true}
                            style={{ cursor: this.props.game ? 'pointer' : 'not-allowed' }}
                            className='btn-game'
                            onClick={e => this.clickRandomChar(this.props.users[nr].id, char, nr)}
                            key={char}>
                            {char}
                        </button>
                    )
                })}
            </div>
        );
    }
}

export default GameButtons;