import React, {Component} from 'react';
import * as firebase from 'firebase'

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hideDiv: false,
            prepare: false,
            prepareTime: 3,
            game: false,
            gameTime: 20,
            users: [],
            chars: ['', ''],
            pending: true,
        };
        //construktor odswieza caly komponent, dlatego to jest poza
        this.pauseTime = null;
        this.readyInterval = null;
        this.gameTime = null;
        this.test = null;
    }


    componentDidMount() {

        switch ( Math.floor( Math.random() * 3 + 1 ) ) {
            case 1:
                this.state.chars[0] = 'x'
                this.state.chars[1] = 'y'
                break;
            case 2:
                this.state.chars[0] ='y'
                this.state.chars[1] ='z'
                break;
            case 3:
                this.state.chars[0] = 'z'
                this.state.chars[1] = 'x'
                break;
        }

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
                    getReady: val[key].getReady,
                })
            }

            // Loading current data from Firebase
            this.setState({
                users: usersTable,
                pending: false,
            })

            this.test = setInterval( () => {
                // Counters
                if (this.state.users[0].getReady && this.state.users[1].getReady) {
                // if (table[0].getReady && table[1].getReady) {

                    this.setState({
                        hideDiv: this.state.users[0].getReady && this.state.users[1].getReady
                    })

                    clearTimeout(this.pauseTime);
                    clearInterval(this.readyInterval);
                    clearInterval(this.gameTime);
                    clearInterval(this.test);

                    // Prepare counter
                    this.pauseTime = setTimeout( () => {
                        this.setState({ prepare: true })

                        this.readyInterval = setInterval( () => {
                            if (this.state.prepareTime === 0) {
                                clearInterval(this.readyInterval);

                                //--- Hide div prepare
                                this.setState({
                                    prepare: false,
                                    game: true,
                                })
                            }

                            if (this.state.users.length > 1 && this.state.prepare) {
                                this.setState({ prepareTime: this.state.prepareTime - 1 })
                            }
                        }, 1000)
                    }, 250);

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
            }, 100)

        }, error => { console.log('Error: ' + error.code); })
    }


    //--- Get ready to play and countdown of time
    checkPlayerReady = (e, id) => {

        firebase.database().ref('/users/' + id).update({
            getReady: !this.state.users.find( (user) => user.id === id ).getReady
        })

        firebase.database().ref('users').on('value', snap => {
            const val = snap.val();
            console.log(val);

            let table = [];
            for (var key in val) {
                table.push({
                    getReady: val[key].getReady,
                })
            }

            // Counters
            // if (this.state.users[0].getReady && this.state.users[1].getReady) {
            if (table[0].getReady && table[1].getReady) {

                this.setState( prevState => {
                    hideDiv: table[0].getReady && table[1].getReady
                })

                clearTimeout(this.pauseTime);
                clearInterval(this.readyInterval);
                clearInterval(this.gameTime);

                // Prepare counter
                this.pauseTime = setTimeout( () => {
                    this.setState({ prepare: true })

                    this.readyInterval = setInterval( () => {
                        if (this.state.prepareTime === 0) {
                            clearInterval(this.readyInterval);

                            //--- Hide div prepare
                            this.setState({
                                prepare: false,
                                game: true,
                            })
                        }

                        if (this.state.users.length > 1 && this.state.prepare) {
                            this.setState({ prepareTime: this.state.prepareTime - 1 })
                        }
                    }, 1000)
                }, 250);

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
        }, error => { console.log('Error: ' + error.code); })
    }


    //--- The mechanism of the game
    handleClick = (e, id, char_player, nr_player) => {

        // Add point
        if (char_player === this.state.chars[nr_player]) {

            firebase.database().ref('/users/' + id).update({
                points: this.state.users.find( (user) => user.id === id ).points + 1
                // .find() - robi tablice jednoelementowa
            })

            let nr = Math.floor( Math.random() * 3 + 1 );
            switch (nr) {
                case 1:
                    this.state.chars[nr_player] = 'x'
                    break;
                case 2:
                    this.state.chars[nr_player] ='y'
                    break;
                case 3:
                    this.state.chars[nr_player] = 'z'
                    break;
            }
        }
        // Subtract point
        else {
            firebase.database().ref('/users/' + id).update({
                points: this.state.users.find( (user) => user.id === id ).points - 1
            })
        }
    };


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
                    <div className="timer">{`TIME: ${this.state.gameTime}`}</div>

                    <div className="half-field">
                        <p>{this.state.users[0].nickname}</p>

                        <div className="scores">
                            <p>SCORE: {this.state.users[0].points}</p>
                        </div>

                        <div className="random-char">{ this.state.game ? this.state.chars[0] : '?' }</div>

                        { this.state.users[0] && !this.state.hideDiv
                            ? <button disabled={ this.state.users.length === 2 ? false : true }
                                      style={{ cursor: this.state.users.length === 2 ? 'pointer' : 'not-allowed',
                                               color: this.state.users[0].getReady ? 'green' : 'red'}}
                                      className="check-ready" onClick={ e => this.checkPlayerReady(e, this.state.users[0].id) }>Ready?</button>
                            : null
                        }

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

                        <div className="random-char">{ this.state.game ? this.state.chars[1] : '?' }</div>

                        { this.state.users[1] && !this.state.hideDiv
                            ? <button disabled={this.state.users.length === 2 ? false : true}
                                      style={{ cursor: this.state.users.length === 2 ? 'pointer' : 'not-allowed',
                                               color: this.state.users[1].getReady ? 'green' : 'red'}}
                                      className="check-ready" onClick={ e => this.checkPlayerReady(e, this.state.users[1].id) }>Ready?</button>
                            : null
                        }

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