import React, { Component } from 'react';
import * as firebase from 'firebase';

import good from '../sound/good.wav';
import bad from '../sound/wrong.mp3';

//--- Data
let induceOnce = true;
const randomChar = ['X', 'Y', 'Z'];

const waitingForPlayers = (
    <div className="connection-info">
        <p>Oczekiwanie na polaczanie</p>
        <p>gracza</p>
    </div>
);


//--- REACT COMPONENTS
class Nick extends Component {
    render() {
        const nr = this.props.nrPlayer;

        return <h3>{this.props.users[nr] ? this.props.users[nr].nickname : '-'}</h3>;
    }
}

//---
class Score extends Component {
    render() {
        const nr = this.props.nrPlayer;

        return (
            <div className="scores">
                <p>SCORE: {this.props.users[nr] ? this.props.users[nr].points : '-'}</p>
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
/** PREPARE GAME TIME */
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

    componentWillUnmount() {
        clearInterval(this.endPrepare);
        clearInterval(this.endTime);
    };

    /**
     * Counter of game
     * Redirection to GameOver */
    gameTimer = () => {

        this.endTime = setInterval( () => {

            this.setState( (prevState) => {
                return { gameTime: prevState.gameTime - 1 }
            })

            if (this.state.gameTime === 0) {
                clearInterval(this.endTime);
                this.props.history.push('/gameover')
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
        // Start game time
        if (induceOnce && this.props.users.length === 2) {
            this.prepareToCount();

            // Induce only once!
            induceOnce = false;
        }

        return (
            <div className="timer">
                TIME: <span style={{ color: this.state.gameTime <= 10 && 'orange' }} >{ this.state.gameTime }</span>

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
        this.bad = new Audio(bad);
    }

    clickRandomChar = (id, char, nr_player) => {
        /** ADD POINT */
        if (char === this.props.users[nr_player].char) {

            let newChar = randomChar[Math.floor( Math.random() * 3 + 1 ) - 1];

            firebase.database().ref('/users/' + id).update({
                points: this.props.users.find( (user) => user.id === id ).points + 1, // .find() - robi tablice jednoelementowa
                char: newChar,
            })

            this.good.play();
        }
        /** SUBTRACT POINT */
        else {
            firebase.database().ref('/users/' + id).update({
                points: this.props.users.find( (user) => user.id === id ).points - 1
            })

            this.bad.play();
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
                                onClick={e => this.clickRandomChar(this.props.users[nr].id, char, nr)}>
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

        return (
            <div>
                <div className="div-game">

                    {/* Prepare game & Time & Redirection */}
                    <Timer users={this.state.users} sendMethod={this.gameStart} />

                    {/* Waiting for players */}
                    { this.state.users.length % 2 === 1 && waitingForPlayers }

                    {/* ----------------------------------**PLAYER 1**---------------------------------- */}
                    <div className="half-field">

                        {/* Nick */}
                        <Nick users={this.state.users} nrPlayer={0} />
                        {/* Score */}
                        <Score users={this.state.users} nrPlayer={0} />
                        {/* Display random char */}
                        <DisplayRandomChar game={this.state.game} nrPlayer={0} users={this.state.users} />
                        {/* Game buttons - MECHANISM HERE */}
                        <GameButtons game={this.state.game} nrPlayer={0} users={this.state.users} />
                        {/* Avatar */}
                        <DisplayAvatar users={this.state.users} nrPlayer={0} />

                    </div>

                    {/* ----------------------------------**PLAYER 2**---------------------------------- */}
                    <div className="half-field">

                        {/* Nick */}
                        <Nick users={this.state.users} nrPlayer={1}/>
                        {/* Score */}
                        <Score users={this.state.users} nrPlayer={1} />
                        {/* Display random char */}
                        <DisplayRandomChar game={this.state.game} nrPlayer={1} users={this.state.users} />
                        {/* Game buttons - MECHANISM HERE */}
                        <GameButtons game={this.state.game} nrPlayer={1} users={this.state.users} />
                        {/* Avatar */}
                        <DisplayAvatar users={this.state.users} nrPlayer={1} />

                    </div>

                </div>
            </div>
        )
    }
}

export default Game;