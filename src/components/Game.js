import React, { Component } from 'react';
import * as firebase from 'firebase';

import good from '../sound/good.wav';
import bad from '../sound/wrong.mp3';

//--- Data
const randomChar = ['X', 'Y', 'Z'];


//--- REACT COMPONENTS
class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameTime: 30,
        }
    }

    // Game counter and redirection to GameOver
    gameTime = e => {

        let timer = setInterval( () => {

            if (this.state.game) {
                if (this.state.gameTime === 0) {
                    clearInterval(this.gameTime);
                    this.props.history.push('/gameover')
                }

                this.setState({ gameTime: this.state.gameTime - 1 })
            }
        }, 1000 )
    }

    render() {
        return (
            <div className="timer">
                TIME: <span style={{ color: this.props.gameTime <= 10 && 'orange' }} >{ this.props.gameTime }</span>
            </div>
        );
    }
}


//---
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
            prepare: false,
            prepareTime: 3,
            game: false,
            gameTime: 30,
            pending: true,
        };
        //construktor odswieza caly komponent, dlatego to jest poza
        this.pauseTime = null;
        this.readyInterval = null;
        this.gameTime = null;
    }

    componentDidMount() {

        // **Prepare counter
        let active = true;

        // Reference to Database
        firebase.database().ref('users').on('value', snap => {
            const val = snap.val();
            console.log(val);

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

            // Start counter
            if (active && usersTable.length === 2) {
                this.prepareGameAndTimeGame();
            }

            // **End counter
            if (usersTable.length === 2) {
                active = false;
            }

            // Loading current data from Firebase
            this.setState({
                users: usersTable,
                pending: false,
            })

        }, error => { console.log('Error: ' + error.code); })
    }

    componentWillUnmount() {
        clearTimeout(this.pauseTime);
        clearInterval(this.readyInterval);
        clearInterval(this.gameTime);
    };

    //--- MY FUNCTIONS ---//
    /**
     * Counter of game
     * Redirection to GameOver */
    prepareGameAndTimeGame = () => {

        // Prepare counter
        this.pauseTime = setTimeout( () => {
            this.setState({ prepare: true })

            this.readyInterval = setInterval( () => {
                if (this.state.prepareTime === 0) {
                    clearInterval(this.readyInterval);

                    // Hide div prepare
                    this.setState({
                        prepare: false,
                        game: true,
                    })
                }

                if (this.state.users.length > 1 && this.state.prepare) {
                    this.setState({ prepareTime: this.state.prepareTime - 1 })
                }
            }, 1000)
        }, 1500);

        // Game counter and redirection to GameOver
        this.gameTime = setInterval( () => {

            if (this.state.game) {
                if (this.state.gameTime === 0) {
                    clearInterval(this.gameTime);
                    this.props.history.push('/gameover')
                }

                this.setState({ gameTime: this.state.gameTime - 1 })
            }
        }, 1000 )
    }

    //--- RENDER ---//
    render() {
        if (this.state.pending) {
            return null;
        }

        return (
            <div>
                <div className="div-game">

                    <Timer gameTime={this.state.gameTime} />

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


                    {/* ----------------------------------**PREPARE GAME**---------------------------------- */}
                    { this.state.users.length % 2 === 1
                        ?   <div className="connection-info">
                                <p>Oczekiwanie na polaczanie</p>
                                <p>gracza</p>
                            </div>
                        :   null
                    }

                    { this.state.users.length > 1 && this.state.prepare
                        ?   <div className='prepare'>
                                <p>{this.state.prepareTime === 0 ? 'start' : this.state.prepareTime}</p>
                            </div>
                        :   null
                    }
                </div>
            </div>
        )
    }
}

export default Game;