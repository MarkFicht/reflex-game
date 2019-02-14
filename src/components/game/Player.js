import React, { Component } from 'react';
import * as firebase from 'firebase';

import MechanismGameButtons from './MechanismGameButtons';

import gameButtonsDummy from '../../components/game/gameButtonsDummy';


/** + jsx tag: "gameButtonsDummy" */
class Player extends Component {
    _isMounted = false;

    constructor(props, context) {
        super(props, context);
        this.state = {
            users: [],
            pending: true,
            disconnect: null
        }
    }

    componentDidMount() {
        this._isMounted = true;

        /** Saving data from Firebase, to the state */
        firebase.database().ref('users').on('value', snap => {
            const val = snap.val();
            const usersTable = [];

            for (var key in val) {
                usersTable.push({
                    nickname: val[key].nickname,
                    id: key,
                    points: val[key].points,
                    imgPlayer: val[key].imgPlayer,
                    readyPlayer: val[key].readyPlayer,
                    disconnectPlayer: val[key].disconnectPlayer,
                    char: val[key].char,
                })
            }

            if (this._isMounted) {

                this.setState({
                    users: usersTable,
                    pending: false,
                })
            }

        }, error => { console.log('Error in users: ' + error.code); })
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        if (this.state.pending) { return null; }

        const [id, bool] = this.props.idPlayer;
        const { users } = this.state;
        const { startTime } = this.props;

        const rightColor = { color: bool ? '#548687' : 'tomato' };
        const rightGameBtns = users[id] && bool
            ? <MechanismGameButtons
                startTime={startTime}
                idPlayer={this.props.idPlayer}
                who={users[id].id}
                correctChar={users[id].char}
                points={users[id].points} />
            : gameButtonsDummy;

        return (
            <div className="half-field" style={rightColor}>

                <h3>{users[id] ? users[id].nickname : '-'}</h3>

                <div className="scores">
                    <p>SCORE: {users[id] ? users[id].points : '-'}</p>
                </div>

                <div className="random-char">{users[id] ? users[id].char : '-'}</div>

                {/* MechanismGameButtons */}
                {rightGameBtns}

                <div className='player'>
                    <div className={`player-img${id + 1}`} style={{ backgroundImage: users[id] && `url(" ${users[id].imgPlayer} ")` }} >{}</div>
                </div>
            </div>
        )
    }
}

export default Player;