import React, { Component } from 'react';
import * as firebase from 'firebase';

import waitingForPlayers from '../components/game/waitingForPlayers';
import gameButtonsDummy from '../components/game/gameButtonsDummy';

import randomChar from '../components/other/randomChar';

import countdownPrepare from '../sound/countdown.wav';
import countdownTime from '../sound/countdown.mp3';
import good from '../sound/good.wav';
import wrong from '../sound/wrong.mp3';


/** 
 * "idPlayer" is arr with 2 objects
 * 1st key: id current player, 
 * 2nd key: bool, checks at what address the player is 
 * */

 /** 
  * Test >                  create "idPlayer"
  * BtnRdy >                who, bool for btnRdy, idPlayer, (REFERENCE TO SELECTED DATA IN FIREBASE)
  * Timer >                 allPlayers, btnsRdyHide - whenToStart, time, idPlayer
  * Player >                whenToStart, time, idPlayer, (MAIN REFERENCE TO FIREBASE) + (LAYOUT PLAYER)
  * MechanismGameButtons >  whenToStart, idPlayer, selectedDataFromFirebase, (UPDATING DATA IN FIREBASE)
  * */

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isInGame: [],
            disconnect: null
        }
        // this.closeBrowser = () => {
        //     this.dropDataBase();
        // }
    }

    componentDidMount() {

        // console.log(this.props.history.block('Are u sure?'));

        firebase.database().ref('/users').on('value', snap => {

            const val = snap.val();
            this.redirectToHome( val );

            // let isInGameArr = [];
            // for (let key in val) {
            //     isInGameArr.push({
            //         isInGame: val[key].isInGame,
            //         simpleValid: val[key].nickname,
            //         who: key
            //     })
            // }
            
        })
    }

    componentDidUpdate() {

        firebase.database().ref('/users').on('value', snap => {

            this.redirectToHome( snap.val() );
            
        })
    }

    componentWillUnmount() {
        // window.removeEventListener('beforeunload', this.closeBrowser);
    }

    /** Remove all players & set disconnect in '/game' on true, when someone:
     * 1.refreshes(F5)
     * 2.press 'back' in browser - COS NIE TRYBI? ???????????????????????????????????/ */
    // dropDataBase = () => {
    //     firebase.database().ref('/game').update({ disconnect: true });
    //     firebase.database().ref('/users').remove();
    // }

    /** Redirect to: GameDisconnect */
    // redirectToGameDisconnect = bool => {

    //     if (bool === false) {
    //         return null;
    //     } else {
    //         this.props.history.push('/gamedisconnect');
    //     }
    // }

    redirectToHome = val => {

        const lengthObj = val ? Object.keys(val).length : null;
        let isInGameArr = [];

        if (lengthObj === null) {
            // console.log('1 test na null');
            return this.props.history.push('/');
        }

        // console.log('2 test nizej');


        for (let key in val) {
            isInGameArr.push({
                isInGame: val[key].isInGame,
                simpleValid: val[key].nickname,
                who: key
            })
        }

        const { userId, simpleValid } = this.props.match.params;

        if ( (lengthObj < Number(userId) + 1) || simpleValid !== isInGameArr[userId].simpleValid ) {
            return this.props.history.push('/');
        }
    }


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
        const btnRdySlowHide = displayBtns ? `` : ` btn-ready-opacity`;        // 2nd option for slow hide btns - conditional "id < howManyOnline"
        const btnCaption = btnRdy ? 'OK' : 'Ready?';
        const btnColor = btnRdy ? 'limegreen' : 'tomato';
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
                    ? <button className={btnRdyClass + btnRdyWithEffect + btnRdySlowHide} style={style} onClick={ e => this.getReadyPlayers(who, bool) }>{ btnCaption }</button> 
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

            if ( !this.state.startPrepare && !displayBtns ) {

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

                <Player startTime={ startTime } idPlayer={this.props.idPlayer} />
            </>
        )
    }

}

class Player extends Component {        // + jsx tag: "gameButtonsDummy"
    constructor(props, context) {
        super(props, context);
        this.state = {
            users: [],
            pending: true,
            disconnect: null
        }
    }

    componentDidMount() {

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

        const [ id, bool ] = this.props.idPlayer;
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
                { rightGameBtns }

                <div className='player'>
                    <div className={`player-img${id + 1}`} style={{ backgroundImage: users[id] && `url(" ${users[id].imgPlayer} ")` }} >{}</div>
                </div>
            </div>
        )
    }
}

class MechanismGameButtons extends Component {
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

    /** Keyboard support */
    keyEvent = e => {
        // console.log(`keydown na window - dziala. Props ${this.props.startTime},  State ${this.state.startTime}`);
        if ( !this.props.startTime ) { 
            return null;
        }

        /* a-65, s-83, d-68  ||  x-88, y-89, z-90 */
        if (e.keyCode === 65 || e.keyCode === 83 || e.keyCode === 68) {

            let clickedChar = null;

            if (e.keyCode === 65)       clickedChar = randomChar[0];
            else if (e.keyCode === 83)  clickedChar = randomChar[1];
            else if (e.keyCode === 68)  clickedChar = randomChar[2];

            this.addOrSubtractPoint( clickedChar );
        }
    }

    /** Mouse support */
    mouseEvent = clickedChar => {
        if (!this.props.startTime) {
            return null;
        }

        this.addOrSubtractPoint( clickedChar );
    }

    /** Main mechanism of the game */
    addOrSubtractPoint = ( clickedChar ) => {

        const { who, correctChar, points } = this.props;

        if ( clickedChar === correctChar ) {

            let charsetLength = randomChar.length;
            let newChar = randomChar[ Math.floor(Math.random() * charsetLength + 1) - 1 ];

            firebase.database().ref( '/users/' + who ).update({
                points: points + 1,
                char: newChar
            })

            this.good = new Audio( good ).play();
            this.good = null;
        }
        else {
            firebase.database().ref('/users/' + who).update({
                points: points - 1
            })

            this.wrong = new Audio( wrong ).play();
            this.wrong = null;
        }
    }

    render() {
        const { startTime } = this.props;
        const style = { cursor: startTime ? 'pointer' : 'not-allowed' }

        return (
            <div className="btns">
                { randomChar.map( char => {

                    return <button onClick={ e => this.mouseEvent(char) } disabled={ !startTime && true } style={style} className='btn-game' key={char}>{ char }</button>   
                }) }
            </div>
        )
    }
}

export default Test;