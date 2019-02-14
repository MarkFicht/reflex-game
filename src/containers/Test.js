import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Redirect } from 'react-router-dom';

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
  * Test >                  create "idPlayer", RedirectToHomeMechanism
  * BtnRdy >                who, bool for btnRdy, idPlayer, (REFERENCE TO SELECTED DATA IN FIREBASE)
  * Timer >                 allPlayers, btnsRdyHide - whenToStart, time, idPlayer, RedirectToGameOver
  * Player >                whenToStart, time, idPlayer, (MAIN REFERENCE TO FIREBASE) + (LAYOUT PLAYER)
  * MechanismGameButtons >  whenToStart, idPlayer, selectedDataFromFirebase, (UPDATING DATA IN FIREBASE)
  * */

class Test extends Component {
    _isMounted = false;

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
        this._isMounted = true;
        if ( !this._isMounted ) { return null; }

        firebase.database().ref('/users').on('value', snap => {

            const val = snap.val();
            const changeOnArr = this.changeOnArr( val, this._isMounted );
            this.redirectToHome( changeOnArr, this._isMounted );
            
            /** Test of memory leak */
            // console.log( 'Zaleznosc z przekierowaniem z this.props.history podczas dropDB. Przeciek pamieci, gdy null: ' + changeOnArr );
        })
    }

    componentDidUpdate() {
        if ( !this._isMounted ) { return null; }

        /** For a case where someone manually enters the address */
        firebase.database().ref('/users').on('value', snap => {

            const val = snap.val();
            const changeOnArr = this.changeOnArr( val, this._isMounted );
            this.redirectToHome( changeOnArr, this._isMounted );
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
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

    changeOnArr = (val, isMounted) => {
        if (!isMounted || !val) { return null; }

        const returnArr = [];
        for ( let key in val) {
            returnArr.push({
                who: key,
                validChars: val[key].validChars
            })
        }

        return returnArr;
    }

    redirectToHome = (arr, isMounted) => {

        if (!isMounted) { return null; }

        const arrLength = arr ? arr.length : null;
        const { userId, simpleValid } = this.props.match.params;
        const { history } = this.props;

        if ( arrLength === null || (arrLength - 1 < Number(userId)) ) {

            return history.push('/gamedisconnect');
        } 
        else if (  arr[userId].validChars !== simpleValid ) {

            return history.push('/*');
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
    _isMounted = false;

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
        this._isMounted = true;
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

            if ( this._isMounted ) {

                this.setState({
                    btnRdy: id < currentOnline.length ? currentOnline[id].readyPlayer : null,
                    who: id < currentOnline.length ? currentOnline[id].who : null,
                    howManyOnline: currentOnline.length,
                    arrStatusPlayers: currentOnline
                })
            }
        })
    }

    componentDidUpdate() {
        const { howManyOnline, displayBtns, arrStatusPlayers } = this.state;

        if ( howManyOnline === 2 && displayBtns && this._isMounted ) {
            
            if ( arrStatusPlayers[0].readyPlayer && arrStatusPlayers[1].readyPlayer ) {
                this.setState({
                    displayBtns: false
                })
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getReadyPlayers = (who, bool, isMounted) => {

        if (!bool || !isMounted) { return null; }

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
                    ? <button className={btnRdyClass + btnRdyWithEffect + btnRdySlowHide} style={style} onClick={ e => this.getReadyPlayers(who, bool, this._isMounted) }>{ btnCaption }</button> 
                    : null 
                }

                <Timer howManyOnline={ howManyOnline } displayBtns={ displayBtns } idPlayer={this.props.idPlayer} />
            </>
        )
    }
}

class Timer extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            prepare: 3,
            time: 2,
            startPrepare: false,
            startTime: false
        }
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentDidUpdate() {
        let { howManyOnline, displayBtns, idPlayer } = this.props;

        if ( howManyOnline === 2 && idPlayer[1] ) {

            if ( !this.state.startPrepare && !displayBtns ) {

                if ( this._isMounted ) {

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
                { this.props.idPlayer[1] && 
                    <div className="timer">
                        TIME: <span style={ timerColor }>{ time }</span>
                    </div> 
                }
                
                { (this.props.idPlayer[1] && startPrepare && !startTime) && 
                    <div className='prepare'>{ countPrepare }</div> 
                }

                { this.renderRedirectToGameOver( this._isMounted ) }

                <Player startTime={ startTime } idPlayer={this.props.idPlayer} />
            </>
        )
    }

}

class Player extends Component {        // + jsx tag: "gameButtonsDummy"
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

            if ( this._isMounted ) {

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
    _isMounted = false;

    constructor(props) {
        super(props);
      
        this.good = null;
        this.bad = null;
    }

    componentDidMount() {
        this._isMounted = true;

        if ( this._isMounted ) {
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