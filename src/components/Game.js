import React, {Component} from 'react';
import * as firebase from 'firebase';

import good from '../sound/good.wav';
import bad from '../sound/wrong.mp3';

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
        this.good = new Audio(good);
        this.bad = new Audio(bad);
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


    //--- The mechanism of the game
    handleClick = (e, id, char, nr_player) => {

        // Add point
        if (char === this.state.users[nr_player].char) {

            let randomChar = '';
            switch ( Math.floor( Math.random() * 3 + 1 ) ) {
                case 1:
                    randomChar = 'x'
                    break;
                case 2:
                    randomChar = 'y'
                    break;
                case 3:
                    randomChar = 'z'
                    break;
            }

            firebase.database().ref('/users/' + id).update({
                points: this.state.users.find( (user) => user.id === id ).points + 1, // .find() - robi tablice jednoelementowa
                char: randomChar,
            })

            this.good.play();
        }
        // Subtract point
        else {
            firebase.database().ref('/users/' + id).update({
                points: this.state.users.find( (user) => user.id === id ).points - 1
            })

            this.bad.play();
        }
    };


    //--- Counter of game + redirection to GameOver
    prepareGameAndTimeGame() {

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


    componentWillUnmount() {
        clearTimeout(this.pauseTime);
        clearInterval(this.readyInterval);
        clearInterval(this.gameTime);
    };


    render() {

        if (this.state.pending) {
            return null;
        }

        return (
            <div>
                <div className="div-game">
                    <div className="timer">
                        TIME: <span style={{ color: this.state.gameTime <= 10 && 'orange' }} >{ this.state.gameTime }</span>
                    </div>

                    <div className="half-field">
                        <p>{this.state.users[0].nickname}</p>

                        <div className="scores">
                            <p>SCORE: {this.state.users[0].points}</p>
                        </div>

                        <div className="random-char">{ this.state.game ? this.state.users[0].char : '?' }</div>

                        <div className="btns">
                            <button disabled={this.state.game ? false : true} style={{cursor: this.state.game ? 'pointer' : 'not-allowed'}} className='btn-game' onClick={e => this.handleClick(e, this.state.users[0].id, 'x', 0)}>X</button>
                            <button disabled={this.state.game ? false : true} style={{cursor: this.state.game ? 'pointer' : 'not-allowed'}} className='btn-game' onClick={e => this.handleClick(e, this.state.users[0].id, 'y', 0)}>Y</button>
                            <button disabled={this.state.game ? false : true} style={{cursor: this.state.game ? 'pointer' : 'not-allowed'}} className='btn-game' onClick={e => this.handleClick(e, this.state.users[0].id, 'z', 0)}>Z</button>
                        </div>

                        <div className='player'>
                            <div className="player-img1" style={{ backgroundImage: `url("${ this.state.users[0].imgPlayer }")` }}></div>
                        </div>
                    </div>

                    <div className="half-field">
                        <p>{this.state.users[1] ? this.state.users[1].nickname : '-'}</p>

                        <div className="scores">
                            <p>SCORE: {this.state.users[1] ? this.state.users[1].points : '-'}</p>
                        </div>

                        <div className="random-char">{ this.state.game ? this.state.users[1].char : '?' }</div>

                        <div className="btns">
                            <button disabled={this.state.game ? false : true} style={{cursor: this.state.game ? 'pointer' : 'not-allowed'}} className='btn-game' onClick={e => this.handleClick(e, this.state.users[1].id, 'x', 1)}>X</button>
                            <button disabled={this.state.game ? false : true} style={{cursor: this.state.game ? 'pointer' : 'not-allowed'}} className='btn-game' onClick={e => this.handleClick(e, this.state.users[1].id, 'y', 1)}>Y</button>
                            <button disabled={this.state.game ? false : true} style={{cursor: this.state.game ? 'pointer' : 'not-allowed'}} className='btn-game' onClick={e => this.handleClick(e, this.state.users[1].id, 'z', 1)}>Z</button>
                        </div>

                        <div className='player'>
                            <div className="player-img2" style={{ backgroundImage: this.state.users[1] && `url("${ this.state.users[1].imgPlayer }")` }}></div>
                        </div>
                    </div>

                    {this.state.users.length % 2 === 1
                        ? <div className="connection-info">
                            <p>Oczekiwanie na polaczanie</p>
                            <p>gracza</p>
                        </div>

                        : null
                    }

                    {this.state.users.length > 1 && this.state.prepare
                        ? <div className='prepare'>
                            <p>{this.state.prepareTime === 0 ? 'start' : this.state.prepareTime}</p>
                        </div>

                        : null
                    }
                </div>
            </div>
        )
    }
}

export default Game;