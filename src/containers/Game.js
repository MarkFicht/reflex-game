import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import * as firebase from 'firebase';
import countdownPrepare from '../sound/countdown.wav';
import countdown from '../sound/countdown.mp3';

import waitingForPlayers from '../components/other/waitingForPlayers';

import gameButtonsDummy from '../components/game/gameButtonsDummy';
import Nick from '../components/game/Nick';
import Score from '../components/game/Score';
import DisplayRandomChar from '../components/game/DisplayRandomChar';
import DisplayAvatar from '../components/game/DisplayAvatar';

import GetReady from '../components/game/mechanism/GetReady';           /** GET READY - Need {...this.props} from parent -> active suitable btn */
// import Timer from '../components/game/mechanism/Timer';                 /** PREPARE GAME TIME - Need {...this.props} from parent -> redirection */
import GameButtons from '../components/game/mechanism/GameButtons';     /** THE MECHANISM OF GAME */


//--- VARIABLES
let induceTimerOnce = true;
let showHideReadyBtns = true;


/** PREPARE GAME TIME - Need {...this.props} from parent for redirection */
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


        this.endPrepare = setInterval( () => {

            if (this.props.users.length > 1 && this.state.ready) {

                this.setState( (prevState) => {
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
        const colorTimer = { color:
                ((this.props.gameTime <= 12 && this.props.gameTime > 5) && 'orange') ||
                 (this.props.gameTime <= 5 && 'red')
        };

        return (
            <div className="timer">
                TIME: <span style={ colorTimer } >{ this.props.gameTime }</span>

                { this.props.users.length > 1 && this.state.ready
                    ?   <div className='prepare'>{ this.state.prepareTime === 0 ? 'start' : this.state.prepareTime }</div>
                    :   null
                }
            </div>
        );
    }
}




//---  *** REACT MAIN COMPONENT ***  ---//
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            pending: true,
            game: false,
            gameTime: 30,
            disconnect: null,
        };
        this.endTime = null;
        this.countdown = new Audio(countdown);
        this.countdown.volume = .3;
        this.closeBrowser = (ev) =>
        {
            window.removeEventListener('beforeunload', this.closeBrowser);
            this.dropDataBase();
        }
    }

    componentDidMount() {
        induceTimerOnce = true;
        showHideReadyBtns = true;

        window.addEventListener('beforeunload', this.closeBrowser);

        /**
         * Add players to state from Firebase
         * Redirect if database is empty */
        firebase.database().ref('users').on('value', snap => {
            const val = snap.val(); // console.log(val);
            const usersTable = [];

            if (!val) {
                this.props.history.push('/gamedisconnect');
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

        /** Bool for checking connected 2 players */
        firebase.database().ref('game').on('value', snap => {
            const val = snap.val();

            this.setState({
                disconnect: val.disconnect
            })

        }, error => { console.log('Error in game: ' + error.code); })
    }

    componentDidUpdate() {
        if (this.state.disconnect) {
            this.props.history.push('/gamedisconnect')
        }
    }

    componentWillUnmount() {
        clearInterval(this.endTime);
        this.countdown.pause();
        window.removeEventListener('beforeunload', this.closeBrowser);

        // Don't delete online players on EndGame
        if (this.state.gameTime !== 0) { this.dropDataBase() }
    }

    /** GAME START */
    gameStart = (paramFromTimer) => {
        this.setState({
            game: paramFromTimer
        })
    }

    /**
     * Counter of game
     * Redirection to GameOver */
    gameTimer = () => {
        this.endTime = setInterval( () => {

            this.setState( (prevState) => {
                return { gameTime: prevState.gameTime - 1 }
            })

            if (this.state.gameTime === 4) {
                this.countdown.play();
            }

            if (this.state.gameTime === 0) {
                clearInterval(this.endTime);
                this.props.history.push('/gameover')
            }
        }, 1000 )
    }


    /** Delete all players and change bool in Firebase, after disconnect one */
    dropDataBase = () => {
        firebase.database().ref('game/').update({ disconnect: true })
        firebase.database().ref('/users').remove();
    }

    //--- RENDER ---//
    render() {
        if (this.state.pending) {
            return null;
        }
        let sendStyle = { color: '#548687' }

        return (
            <div>
                <div className="div-game">

                    {/* PREPARE GAME & TIME & REDIRECTION */}
                    <Timer { ...this.props } users={this.state.users} gameTime={this.state.gameTime} sendMethod={this.gameStart} sendMethodTimer={this.gameTimer} />

                    {/* Waiting for players */}
                    { this.state.users.length % 2 === 1 && waitingForPlayers }

                    {/* ----------------------------------**PLAYER 1**---------------------------------- */}
                    <div className="half-field">

                        {/* Get ready */}
                        { showHideReadyBtns && <GetReady users={this.state.users} { ...this.props } nrPlayer={0} /> }

                        {/* Nick */}
                        <Nick sendStyle={ Number(this.props.match.params.userId) === 0 ? sendStyle : null } users={this.state.users} nrPlayer={0} />

                        {/* Score */}
                        <Score sendStyle={ Number(this.props.match.params.userId) === 0 ? sendStyle : null } users={this.state.users} nrPlayer={0} />

                        {/* Display random char */}
                        <DisplayRandomChar game={this.state.game} nrPlayer={0} users={this.state.users} />

                        {/* Game buttons - MECHANISM HERE */}
                        { Number(this.props.match.params.userId) === 0
                            ? <GameButtons game={this.state.game} { ...this.props } nrPlayer={0} users={this.state.users} />
                            : gameButtonsDummy }

                        {/* Avatar */}
                        <DisplayAvatar users={this.state.users} nrPlayer={0} />

                    </div>

                    {/* ----------------------------------**PLAYER 2**---------------------------------- */}
                    <div className="half-field">

                        {/* Get ready */}
                        { showHideReadyBtns && <GetReady users={this.state.users} { ...this.props } nrPlayer={1} /> }

                        {/* Nick */}
                        <Nick sendStyle={ Number(this.props.match.params.userId) === 1 ? sendStyle : null } users={this.state.users} nrPlayer={1}/>

                        {/* Score */}
                        <Score sendStyle={ Number(this.props.match.params.userId) === 1 ? sendStyle : null } users={this.state.users} nrPlayer={1} />

                        {/* Display random char */}
                        <DisplayRandomChar game={this.state.game} nrPlayer={1} users={this.state.users} />

                        {/* Game buttons - MECHANISM HERE */}
                        { Number(this.props.match.params.userId) === 1
                            ? <GameButtons game={this.state.game} nrPlayer={1} users={this.state.users} />
                            : gameButtonsDummy }

                        {/* Avatar */}
                        <DisplayAvatar users={this.state.users} nrPlayer={1} />

                    </div>

                </div>
            </div>
        )
    }
}
export default Game;