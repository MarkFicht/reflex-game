import React, { Component } from 'react';
import * as firebase from 'firebase';

import waitingForPlayers from '../components/game/waitingForPlayers';
import gameButtonsDummy from '../components/game/gameButtonsDummy';

import countdownPrepare from '../sound/countdown.wav';
import countdownTime from '../sound/countdown.mp3';


/** 
 * idPlayer is arr with 2 objects
 * 1st key: id current player, 
 * 2nd key: bool, checks at what address the player is 
 * */

 /** 
  * Test >              create idPlayer
  * BtnRdy >            who, bool for btnRdy, idPlayer
  * Timer >             allPlayers, btnsRdyHide, time, idPlayer
  * MechanismOfGame >   whenToStart, time, idPlayer
  * Player >
  * */

class Test extends Component {

    render() {
        const ID_URL = Number(this.props.match.params.userId);

        return (
            <div className="div-game">
                <BtnRdy idPlayer={ [0, ID_URL === 0] } />
                <BtnRdy idPlayer={ [1, ID_URL === 1] } />
            </div>
        )
    }
}

class BtnRdy extends Component {        // + component: "Waiting for all players"
    constructor(props) {
        super(props);
        this.state = {
            btnRdy: null,
            who: null,
            howManyOnline: 0,
            arrStatusPlayers: null,
            displayBtns: true
        }
    }

    componentDidMount() {
        const [ id, bool ] = this.props.idPlayer;

        firebase.database().ref('/users').on('value', snap => {
            const val = snap.val();

            let currentOnline = [];

            for (let key in val) {
                currentOnline.push({ 
                    readyPlayer: val[key].readyPlayer,
                    who: key
                })
            }

            this.setState({ 
                btnRdy: id < currentOnline.length ? currentOnline[ id ].readyPlayer : null,
                who: id < currentOnline.length ? currentOnline[ id ].who : null,
                howManyOnline: currentOnline.length,
                arrStatusPlayers: currentOnline 
            })
        })
    }

    componentDidUpdate() {
        const { howManyOnline, displayBtns, arrStatusPlayers } = this.state;

        if (howManyOnline === 2 && displayBtns) {
            
            if (arrStatusPlayers[0].readyPlayer && arrStatusPlayers[1].readyPlayer) {
                this.setState({
                    displayBtns: false
                })
            }
        }
    }

    getReadyPlayers = (who, bool) => {

        if (!bool) {
            return null;
        }

        firebase.database().ref('/users/' + who).update({
            readyPlayer: !this.state.btnRdy
        })

        this.setState({
            btnRdy: !this.state.btnRdy
        })
    }

    render() {
        const [ id, bool ] = this.props.idPlayer;
        const { who, btnRdy, howManyOnline, displayBtns } = this.state;

        const btnRdyClass = `btn-ready${ id + 1 }`;
        const btnRdyWithEffect = bool ? `` : ` btn-ready-noEffect`;
        const btnCaption = btnRdy ? 'OK' : 'Ready?';
        const btnColor = btnRdy ? 'green' : 'tomato';
        const style = { 
            color: btnColor, 
            borderColor: btnColor 
        };

        return (
            <>
                {/* Waiting for players */}
                { howManyOnline % 2 === 1 && waitingForPlayers }

                {/* { id < howManyOnline && displayBtns */}
                { id < howManyOnline
                    ? <button className={btnRdyClass + btnRdyWithEffect} style={style} onClick={ e => this.getReadyPlayers(who, bool) }>{ btnCaption }</button> 
                    : null 
                }

                <Timer howManyOnline={ howManyOnline } displayBtns={ displayBtns } idPlayer={this.props.idPlayer} />
            </>
        )
    }
}

class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prepare: 3,
            time: 30,
            startPrepare: false,
            startTime: false
        }
    }

    componentDidUpdate() {
        let { howManyOnline, displayBtns, idPlayer } = this.props;

        if ( howManyOnline === 2 && idPlayer[1] ) {
            // console.log('cDU z Timer.js ' + displayBtns);

            if ( !this.state.startPrepare && !displayBtns ) {
                // console.log('Zmieniono stan raz. ' + this.state.startPrepare);

                this.setState({ 
                    startPrepare: true 
                })
                this.startPrepareFoo( countdownPrepare, .25 );     // startTimeFoo() inside
            }
        }
    }

    startPrepareFoo = (music, volumeParam) => {
        let audio = new Audio(music);
        audio.volume = volumeParam;
        audio.play();

        const preparePlayers = setInterval( () => {

            this.setState( (prevState) => {
                return { prepare: prevState.prepare - 1 }
            })

            if (this.state.prepare < 0) {

                this.setState({
                    startTime: true
                })
                audio = null;
                clearInterval( preparePlayers );
                this.startTimeFoo( countdownTime, .3 );
            }

        }, 1000)
    }

    startTimeFoo = (music, volumeParam) => {
        let audio = new Audio(music);
        audio.volume = volumeParam;

        const timePlayers = setInterval( () => {

            this.setState( (prevState) => {
                return { time: prevState.time - 1 }
            })

            if (this.state.time === 4) {
                audio.play();
            }

            if (this.state.time === 0) {
                audio = null;
                clearInterval( timePlayers );
            }

        }, 1000)
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
                { this.props.idPlayer[1] && 
                    <div className="timer">
                        TIME: <span style={ timerColor }>{ time }</span>
                    </div> 
                }
                
                { (this.props.idPlayer[1] && startPrepare && !startTime) && 
                    <div className='prepare'>{ countPrepare }</div> 
                }

                <MechanismOfGame time={ time } startTime={ startTime } idPlayer={this.props.idPlayer} />
            </>
        )
    }

}

class MechanismOfGame extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            users: [],
            pending: true,
            disconnect: null,
            startGame: false,
            time: this.props.time,
        }
    }

    componentDidMount() {

        /** Saving data from Firebase, to the state */
        firebase.database().ref('users').on('value', snap => {
            const val = snap.val(); 
            const usersTable = [];

            /** Check connection */ 
            if (!val) {
                // this.props.history.push('/gamedisconnect');
            }

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
            this.setState({
                users: usersTable,
                pending: false,
            })

        }, error => { console.log('Error in users: ' + error.code); })
    }

    render() {
        if (this.state.pending) {
            return null;
        }

        const [id, bool] = this.props.idPlayer;
        const { users } = this.state;

        const rightColor = { color: bool ? '#548687' : 'tomato' };
        const rightGameBtns = users[id] && bool ? <MechanismGameButtons /> : gameButtonsDummy;

        return (
            <div className="half-field" style={rightColor}>

                <h3>{users[id] ? users[id].nickname : '-'}</h3>

                <div className="scores">
                    <p>SCORE: {users[id] ? users[id].points : '-'}</p>
                </div>

                <div className="random-char">{users[id] ? users[id].char : '-'}</div>

                { rightGameBtns }

                <div className='player'>
                    <div className={`player-img${id + 1}`} style={{ backgroundImage: users[id] && `url(" ${users[id].imgPlayer} ")` }} >{}</div>
                </div>
            </div>
        )
    }
}

class PlayerLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: this.props.users,
            idPlayer: this.props.idPlayer
        }
    }

    render() {
        const [ id, bool ] = this.props.idPlayer;
        const { users } = this.props;

        const rightColor = { color: bool ? '#548687' : 'tomato' };
        const rightGameBtns = users[id] && bool ? <MechanismGameButtons /> : gameButtonsDummy;

        return (
            <div className="half-field" style={ rightColor }>
            
                <h3>{ users[id] ? users[id].nickname : '-' }</h3>
            
                <div className="scores">
                    <p>SCORE: { users[id] ? users[id].points : '-' }</p>
                </div>

                <div className="random-char">{ users[id] ? users[id].char : '-' }</div>

                { rightGameBtns }

                <div className='player'>
                    <div className={`player-img${id + 1}`} style={{ backgroundImage: users[id] && `url(" ${users[id].imgPlayer} ")` }} >{  }</div>
                </div>
            </div>
        )
    }

}

class MechanismGameButtons extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
            
    //     }
    // }

    render() {
        return (
            <div className="btns">
                <button className='btn-game'> A </button>
                <button className='btn-game'> S </button>
                <button className='btn-game'> D </button>
            </div>
        )
    }
}

export default Test;