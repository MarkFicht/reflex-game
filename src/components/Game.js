import React, {Component} from 'react';
// import './Game.css'; // Stary zapis, gdzie mialem w strukturze pliki scss i css w folderze z Komponentem.js

import * as firebase from 'firebase'

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ready: false,
            readyTime: 3,
            gameStart: false,
            gameTime: 10,
            users: [],
            pending: true,
            startGame: false,
            startInterval: false
        };
        //construktor odswieza caly komponent, dlatego to jest poza
        this.pauseTime = null;
        this.readyInterval = null;
        this.gameTime = null;
    }


    componentDidMount() {
        let active = true;

        //--- Downloading data from Firebase
        firebase.database().ref('users').on('value', snap => {
            const val = snap.val();
            console.log(val);

            //--- Preparing to save in setState
            const usersTable = [];

            for (var key in val) {
                usersTable.push({
                    nickname: val[key].nickname,
                    id: key,
                    points: val[key].points,
                    imgPlayer: val[key].imgPlayer
                })
            }

            //--- Preparing counter animation
            if(active && usersTable.length === 2) {
                this.pauseTime = setTimeout(() => {
                    this.setState({
                        ready: true,
                    })

                    this.readyInterval = setInterval(() => {

                        if (this.state.readyTime === 0) {
                            clearInterval(this.readyInterval);

                            //--- Hide div prepare
                            this.setState({
                                ready: false,
                                gameStart: true,
                            })
                        }

                        if (this.state.users.length > 1 && this.state.ready) {
                            this.setState({
                                readyTime: this.state.readyTime - 1,
                            })
                        }
                    }, 1000)
                }, 1500);

                this.gameTime = setInterval( () => {

                    if (this.state.gameStart) {
                        if (this.state.gameTime === 0) {
                            clearInterval(this.gameTime);
                            this.props.history.push('/gameover')
                        }

                        this.setState({
                            gameTime: this.state.gameTime - 1,
                        })
                    }
                }, 1000 )
            }

            if (usersTable.length === 2) {
                active = false;
            }

            //--- Current local data from Firebase
            this.setState({
                users: usersTable,
                pending: false,
                startGame: usersTable.length === 2
            })
        }, error => { console.log('Error: ' + error.code); })
    }


    componentWillUnmount() {
        // clearTimeout(this.pauseTime);
        // clearInterval(this.readyInterval);
        // clearInterval(this.gameTime);

        // error, rozgryzc
        // firebase.database().ref('/users').remove();
    };


    handleClick = (e, id) => {

        firebase.database().ref('/users/' + id).update({
            points: this.state.users.find( (user) => user.id === id ).points + 1
            // .find() - robi tablice jednoelementowa
        })
    };


    render() {

        if (this.state.pending) {
            return null;
        }

        return (
            <div>
                <div className="div-game">
                    <div className="timer">{`TIME:${this.state.gameTime}`}</div>

                    <div className="half-field">
                        <p>{this.state.users[0].nickname}</p>

                        <div className="scores">
                            <p>SCORE: {this.state.users[0].points}</p>
                        </div>

                        <div className="random-char">?</div>

                        <div className="btns">
                            <button disabled={this.state.gameStart ? false : true} style={{cursor: this.state.gameStart ? 'pointer' : 'not-allowed'}} className='btn-game' onClick={e => this.handleClick(e, this.state.users[0].id)}>X</button>
                            <button className='btn-game'>Y</button>
                            <button className='btn-game'>Z</button>
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

                        <div className="random-char">?</div>

                        <div className="btns">
                            <button disabled={this.state.gameStart ? false : true} style={{cursor: this.state.gameStart ? 'pointer' : 'not-allowed'}} className='btn-game' onClick={e => this.handleClick(e, this.state.users[1].id)}>X</button>
                            <button className='btn-game'>Y</button>
                            <button className='btn-game'>Z</button>
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

                    {this.state.users.length > 1 && this.state.ready
                        ? <div className="prepare">
                            <p>{this.state.readyTime === 0 ? 'start' : this.state.readyTime}</p>
                        </div>

                        : null
                    }
                </div>
            </div>
        )
    }
}

export default Game;