import React, { Component } from 'react';
import * as firebase from 'firebase';
import good from '../sound/good.wav';
import bad from '../sound/wrong.mp3';

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

//---
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

//---
class DisplayRandomChar extends Component {
    render() {
        const nr = this.props.nrPlayer;

        return (
            <div className="random-char">{ this.props.game ? this.props.users[nr].char : '?' }</div>
        );
    }
}

//---
class DisplayAvatar extends Component {
    render() {
        const nr = this.props.nrPlayer;

        return (
            <div className='player'>
                <div className={`player-img${nr+1}`} style={{ backgroundImage: this.props.users[nr] && `url("${ this.props.users[nr].imgPlayer }")` }}></div>
            </div>
        );
    }
}

//---
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
        console.log(Number(this.props.match.params.userId))

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

//---
/** PREPARE GAME TIME - Need {...this.props} from parent for redirection */
class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: false,
            prepareTime: 3,
            gameTime: 30,
        }
        this.endPrepare = null; //construktor odswieza caly komponent, dlatego to jest poza
        this.endTime = null;
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
        clearInterval(this.endTime);
    };

    /**
     * Counter of game
     * Redirection to GameOver
     * Restore the countdown
     * Show again btns ready to next game*/
    gameTimer = () => {

        this.endTime = setInterval( () => {

            this.setState( (prevState) => {
                return { gameTime: prevState.gameTime - 1 }
            })

            if (this.state.gameTime === 0) {
                clearInterval(this.endTime);
                this.props.history.push('/gameover')
                induceTimerOnce = true;
                showHideReadyBtns = true;
            }
        }, 1000 )
    }

    /**
     * Prepare counter of game
     * Unlock buttons */
    prepareToCount = () => {
        this.setState({ ready: true })

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

                if (typeof this.props.sendMethod === "function") {
                    this.props.sendMethod(true);
                }

                this.gameTimer();
            }
        }, 1000)
    }

    render() {
        const colorTimer = { color:
                ((this.state.gameTime <= 12 && this.state.gameTime > 5) && 'orange') ||
                 (this.state.gameTime <= 5 && 'red')
        };

        return (
            <div className="timer">
                TIME: <span style={ colorTimer } >{ this.state.gameTime }</span>

                { this.props.users.length > 1 && this.state.ready
                    ?   <div className='prepare'>{ this.state.prepareTime === 0 ? 'start' : this.state.prepareTime }</div>
                    :   null
                }
            </div>
        );
    }
}

//---
/** THE MECHANISM OF GAME */
class GameButtons extends Component {
    constructor(props) {
        super(props);
        this.good = new Audio(good);
        this.bad = null;
    }

    clickRandomChar = (id, char, nr_player) => {
        /** ADD POINT */
        if (char === this.props.users[nr_player].char) {

            let newChar = randomChar[Math.floor( Math.random() * 3 + 1 ) - 1];

            firebase.database().ref('/users/' + id).update({
                points: this.props.users.find( (user) => user.id === id ).points + 1, // .find() - robi tablice jednoelementowa
                char: newChar,
            })

            this.good = new Audio(good).play();
            this.good = null;
        }
        /** SUBTRACT POINT */
        else {
            firebase.database().ref('/users/' + id).update({
                points: this.props.users.find( (user) => user.id === id ).points - 1
            })

            this.bad = new Audio(bad).play();
            this.bad = null;
        }
    };

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
            game: false
        };
    }

    componentDidMount() {
        // Reference to Database
        firebase.database().ref('users').on('value', snap => {
            const val = snap.val(); // console.log(val);

            // Preparing to save in setState
            const usersTable = [];
            for (var key in val) {
                usersTable.push({
                    nickname: val[key].nickname,
                    id: key,
                    points: val[key].points,
                    imgPlayer: val[key].imgPlayer,
                    readyPlayer: val[key].readyPlayer,
                    char: val[key].char,
                })
            }
            this.setState({
                users: usersTable,
                pending: false,
            })

        }, error => { console.log('Error: ' + error.code); })
    }

    /** GAME START */
    gameStart = (paramFromTimer) => {
        this.setState({
            game: paramFromTimer
        })
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
                    <Timer { ...this.props } users={this.state.users} sendMethod={this.gameStart} />

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
                            ? <GameButtons game={this.state.game} nrPlayer={0} users={this.state.users} />
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