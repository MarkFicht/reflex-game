import React, { Component } from 'react';
import * as firebase from 'firebase';

import waitingForPlayers from '../components/game/waitingForPlayers';

import countdownPrepare from '../sound/countdown.wav';
import countdownTime from '../sound/countdown.mp3';


/** 
 * idPlayer is arr 
 * 0: id current player, 
 * 1: bool, checks at what address the player is 
 * */

 /** 
  * Test > create idPlayer
  * BtnRdy > who, bool for btnRdy, idPlayer
  * Timer > allPlayers, btnsRdyHide, idPlayer
  * MechanismOfGame > 
  * Player >
  * */

class Test extends Component {

    render() {
        const ID_URL = Number(this.props.match.params.userId);

        return (
            <div className="div-game">
                <BtnRdy idPlayer={ [0, ID_URL === 0] } {...this.props} />
                <BtnRdy idPlayer={ [1, ID_URL === 1] } {...this.props} />
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
                this.startPrepareFoo();     // startTimeFoo() inside
            }
        }
    }

    startPrepareFoo = () => {
        const preparePlayers = setInterval( () => {

            this.setState( (prevState) => {
                return { prepare: prevState.prepare - 1 }
            })

            if (this.state.prepare < 0) {

                this.setState({
                    startTime: true
                })
                clearInterval( preparePlayers );
                this.startTimeFoo();
            }

            // if (this.state.gameTime === 4) {
            //     this.countdown.play();
            // }

            // if (this.state.gameTime === 0) {
            //     clearInterval(this.endTime);
            //     // this.resultsPlayers();
            //     this.props.history.push('/gameover')
            // }
        }, 1000)
    }

    startTimeFoo = () => {
        const timePlayers = setInterval( () => {

            this.setState( (prevState) => {
                return { time: prevState.time - 1 }
            })

            if (this.state.time < 0) {

                this.setState({
                    startPrepare: false,
                    startTime: false
                })
                clearInterval( timePlayers );
            }

        }, 1000)
    }

    render() {
        const { prepare, time, startPrepare, startTime } = this.state;
        const countPrepare = prepare === 0 ? 'start' : prepare;

        return (
            <>
                { this.props.idPlayer[1] && 
                    <div className="timer">
                        TIME: <span>{ time }</span>
                    </div> 
                }
                
                { (this.props.idPlayer[1] && startPrepare && !startTime) && 
                    <div className='prepare'>{ countPrepare }</div> 
                }

                <MechanismOfGame time={ time } idPlayer={this.props.idPlayer} />
            </>
        )
    }

}

class MechanismOfGame extends Component {
    constructor(props) {
        super(props);
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

        return (
            <>
                <Player users={this.state.users} idPlayer={this.props.idPlayer} />
            </>
        )
    }
}

class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: this.props.users,
            idPlayer: this.props.idPlayer
        }
    }

    render() {
        const [ id, bool ] = this.props.idPlayer;
        let { users } = this.props;

        return (
            <div className="half-field">
            
                <h3>{ users[id] ? users[id].nickname : '-' }</h3>
            
                <div className="scores">
                    <p>SCORE: { users[id] ? users[id].points : '-' }</p>
                </div>

                <div className="random-char">{ users[id] ? users[id].char : '-' }</div>

                <div className="btns">
                    <button className='btn-game'> A </button>
                    <button className='btn-game'> S </button>
                    <button className='btn-game'> D </button>
                </div>

                <div className='player'>
                    <div className={`player-img${id + 1}`} style={{ backgroundImage: users[id] && `url(" ${users[id].imgPlayer} ")` }} >{  }</div>
                </div>
            </div>
        )
    }

}


//---  *** REACT MAIN COMPONENT ***  ---//
// class Game1 extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             users: [],
//             pending: true,
//             game: false,
//             gameTime: 30,
//             disconnect: null,
//         };
//         this.endTime = null;
//         this.countdown = new Audio(countdown);
//         this.countdown.volume = .3;
//         this.closeBrowser = (ev) =>
//         {
//             window.removeEventListener('beforeunload', this.closeBrowser);
//             this.dropDataBase();
//         }
//     }

//     componentDidMount() {
//         induceTimerOnce = true;
//         showHideReadyBtns = true;

//         window.addEventListener('beforeunload', this.closeBrowser);

//         /**
//          * Add players to state from Firebase
//          * Redirect if database is empty */
//         firebase.database().ref('users').on('value', snap => {
//             const val = snap.val(); // console.log(val);
//             const usersTable = [];

//             if (!val) {
//                 this.props.history.push('/gamedisconnect');
//             }

//             for (var key in val) {
//                 usersTable.push({
//                     nickname: val[key].nickname,
//                     id: key,
//                     points: val[key].points,
//                     imgPlayer: val[key].imgPlayer,
//                     readyPlayer: val[key].readyPlayer,
//                     disconnectPlayer: val[key].disconnectPlayer,
//                     char: val[key].char,
//                 })
//             }
//             this.setState({
//                 users: usersTable,
//                 pending: false,
//             })

//         }, error => { console.log('Error in users: ' + error.code); })

//         /** Bool for checking connected 2 players */
//         firebase.database().ref('game').on('value', snap => {
//             const val = snap.val();

//             this.setState({
//                 disconnect: val.disconnect
//             })

//         }, error => { console.log('Error in game: ' + error.code); })
//     }

//     componentDidUpdate() {
//         if (this.state.disconnect) {
//             this.props.history.push('/gamedisconnect')
//         }
//     }

//     componentWillUnmount() {
//         clearInterval(this.endTime);
//         this.countdown.pause();
//         window.removeEventListener('beforeunload', this.closeBrowser);

//         // Don't delete online players on EndGame
//         if (this.state.gameTime !== 0) { this.dropDataBase() }
//     }

//     /** GAME START */
//     gameStart = (paramFromTimer) => {
//         this.setState({
//             game: paramFromTimer
//         })
//     }

//     /**
//      * Counter of game
//      * Redirection to GameOver */
//     gameTimer = () => {
//         this.endTime = setInterval( () => {

//             this.setState( (prevState) => {
//                 return { gameTime: prevState.gameTime - 1 }
//             })

//             if (this.state.gameTime === 4) {
//                 this.countdown.play();
//             }

//             if (this.state.gameTime === 0) {
//                 clearInterval(this.endTime);
//                 this.props.history.push('/gameover')
//             }
//         }, 1000 )
//     }


//     /** Delete all players and change bool in Firebase, after disconnect one */
//     dropDataBase = () => {
//         firebase.database().ref('game/').update({ disconnect: true })
//         firebase.database().ref('/users').remove();
//     }

//     //--- RENDER ---//
//     render() {
//         if (this.state.pending) {
//             return null;
//         }
//         let sendStyle = { color: '#548687' }

//         return (
//             <div>
//                 <div className="div-game">

//                     {/* PREPARE GAME & TIME & REDIRECTION */}
//                     <Timer { ...this.props } users={this.state.users} gameTime={this.state.gameTime} sendMethod={this.gameStart} sendMethodTimer={this.gameTimer} />

//                     {/* Waiting for players */}
//                     { this.state.users.length % 2 === 1 && waitingForPlayers }

//                     {/* ----------------------------------**PLAYER 1**---------------------------------- */}
//                     <div className="half-field">

//                         {/* Get ready */}
//                         { showHideReadyBtns && <GetReady users={this.state.users} { ...this.props } nrPlayer={0} /> }

//                         {/* Nick */}
//                         <Nick sendStyle={ Number(this.props.match.params.userId) === 0 ? sendStyle : null } users={this.state.users} nrPlayer={0} />

//                         {/* Score */}
//                         <Score sendStyle={ Number(this.props.match.params.userId) === 0 ? sendStyle : null } users={this.state.users} nrPlayer={0} />

//                         {/* Display random char */}
//                         <DisplayRandomChar game={this.state.game} nrPlayer={0} users={this.state.users} />

//                         {/* Game buttons - MECHANISM HERE */}
//                         { Number(this.props.match.params.userId) === 0
//                             ? <GameButtons game={this.state.game} { ...this.props } nrPlayer={0} users={this.state.users} />
//                             : gameButtonsDummy }

//                         {/* Avatar */}
//                         <DisplayAvatar users={this.state.users} nrPlayer={0} />

//                     </div>

//                     {/* ----------------------------------**PLAYER 2**---------------------------------- */}
//                     <div className="half-field">

//                         {/* Get ready */}
//                         { showHideReadyBtns && <GetReady users={this.state.users} { ...this.props } nrPlayer={1} /> }

//                         {/* Nick */}
//                         <Nick sendStyle={ Number(this.props.match.params.userId) === 1 ? sendStyle : null } users={this.state.users} nrPlayer={1}/>

//                         {/* Score */}
//                         <Score sendStyle={ Number(this.props.match.params.userId) === 1 ? sendStyle : null } users={this.state.users} nrPlayer={1} />

//                         {/* Display random char */}
//                         <DisplayRandomChar game={this.state.game} nrPlayer={1} users={this.state.users} />

//                         {/* Game buttons - MECHANISM HERE */}
//                         { Number(this.props.match.params.userId) === 1
//                             ? <GameButtons game={this.state.game} nrPlayer={1} users={this.state.users} />
//                             : gameButtonsDummy }

//                         {/* Avatar */}
//                         <DisplayAvatar users={this.state.users} nrPlayer={1} />

//                     </div>

//                 </div>
//             </div>
//         )
//     }
// }
export default Test;