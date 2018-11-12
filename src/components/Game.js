import React, { Component } from 'react';
import * as firebase from 'firebase';
import good from '../sound/good.wav';
import bad from '../sound/wrong.mp3';
import countdownPrepare from '../sound/countdown.wav';
import countdown from '../sound/countdown.mp3';

import randomChar from './static/randomChar';
import waitingForPlayers from './static/waitingForPlayers';

//--- VARIABLES
let induceTimerOnce = true;
let showHideReadyBtns = true;

//--- JSX TAGS
const gameButtonsDummy = (
    <div className="btns">
        { randomChar.map( char => {
            return <button key={ char } className='btn-game btn-game-noEffect'>{ char }</button>
        }) }
    </div>
);

//--- REACT COMPONENTS
class Nick extends Component {
    render() {
        const nr = this.props.nrPlayer;

        return <h3 style={ this.props.sendStyle }>{this.props.users[nr] ? this.props.users[nr].nickname : '-'}</h3>;
    }
}

class Score extends Component {
    render() {
        const nr = this.props.nrPlayer;

        return (
            <div className="scores">
                <p style={ this.props.sendStyle }>SCORE: {this.props.users[nr] ? this.props.users[nr].points : '-'}</p>
            </div>
        );
    }
}

class DisplayRandomChar extends Component {
    render() {
        const nr = this.props.nrPlayer;

        return (
            <div className="random-char">{ this.props.game ? this.props.users[nr].char : '?' }</div>
        );
    }
}

class DisplayAvatar extends Component {
    render() {
        const nr = this.props.nrPlayer;

        return (
            <div className='player'>
                <div className={`player-img${nr+1}`} style={{ backgroundImage: this.props.users[nr] && `url("${ this.props.users[nr].imgPlayer }")` }}>{}</div>
            </div>
        );
    }
}

/** Need {...this.props} from parent for active suitable btn */
class GetReady extends Component {

    /** GET READY */
    getReadyPlayers = (who, bool) => {
        if (bool) {
            firebase.database().ref('/users/' + who).update({
                readyPlayer: bool
            })
        }
    }

    render() {
        const nr = this.props.nrPlayer;
        let userIsPresent = this.props.users[nr];

        return ( userIsPresent
                ? <button className={ Number(this.props.match.params.userId) === this.props.nrPlayer ? 'btn-ready' : 'btn-ready btn-ready-noEffect'}
                          style={{ color: userIsPresent.readyPlayer ? 'green' : 'tomato', borderColor: userIsPresent.readyPlayer ? 'green' : 'tomato' }}
                          onClick={e => this.getReadyPlayers(userIsPresent.id, Number(this.props.match.params.userId) === this.props.nrPlayer)} >
                    { userIsPresent.readyPlayer ? 'Ready!' : 'Get Ready?' }
                </button>
                : null
        );
    }
}

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

            let newChar = randomChar[Math.floor( Math.random() * 3 + 1 ) - 1];

            firebase.database().ref('/users/' + id).update({
                points: this.props.users.find( (user) => user.id === id ).points + 1, // .find() - robi tablice jednoelementowa
                char: newChar,
            })

            this.good = new Audio(good).play();
            this.good = null;
        }
        else {
            firebase.database().ref('/users/' + id).update({
                points: this.props.users.find( (user) => user.id === id ).points - 1
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

            if (e.keyCode === 65)       char = randomChar[0];
            else if (e.keyCode === 83)  char = randomChar[1];
            else if (e.keyCode === 68)  char = randomChar[2];

            this.addSubtractPoint(id, char, nr_arr);
        }
    }

    render() {
        const nr = this.props.nrPlayer;

        return (
            <div className="btns">
                { randomChar.map( char => {
                    return (
                        <button disabled={this.props.game ? false : true}
                                style={{cursor: this.props.game ? 'pointer' : 'not-allowed'}}
                                className='btn-game'
                                onClick={e => this.clickRandomChar(this.props.users[nr].id, char, nr)}
                                key={ char }>
                            { char }
                        </button>
                    )
                }) }
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