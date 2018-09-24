import React, {Component} from 'react';
import * as firebase from 'firebase'

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            prepare: false,
            prepareTime: 3,
            game: false,
            gameTime: 10,
            users: [],
            pending: true,
        };
        //construktor odswieza caly komponent, dlatego to jest poza
        this.pauseTime = null;
        this.readyInterval = null;
        this.gameTime = null;
    }


    componentDidMount() {
        let active = true;

        //--- Reference to Database
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

            //--- Counters
            if (active && usersTable.length === 2) {

                // Prepare counter
                this.pauseTime = setTimeout(() => {
                    this.setState({ prepare: true })

                    this.readyInterval = setInterval(() => {
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

            if (usersTable.length === 2) {
                active = false;
            }

            //--- Loading current local data from Firebase
            this.setState({
                users: usersTable,
                pending: false,
            })
        }, error => { console.log('Error: ' + error.code); })
    }


    // componentWillUnmount() {
    //     clearTimeout(this.pauseTime);
    //     clearInterval(this.readyInterval);
    //     clearInterval(this.gameTime);
    // };


    handleClick = (e, id, char) => {
        console.log(char);

        firebase.database().ref('/users/' + id).update({
            points: this.state.users.find( (user) => user.id === id ).points + 1
            // .find() - robi tablice jednoelementowa
        })
    };


    render() {

        if (this.state.pending) {
            return null;
        }

        let prepareClass = 'prepare';

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
                            <button disabled={this.state.game ? false : true} style={{cursor: this.state.game ? 'pointer' : 'not-allowed'}} className='btn-game' onClick={e => this.handleClick(e, this.state.users[0].id, 'x')}>X</button>
                            <button disabled={this.state.game ? false : true} style={{cursor: this.state.game ? 'pointer' : 'not-allowed'}} className='btn-game' onClick={e => this.handleClick(e, this.state.users[0].id, 'y')}>Y</button>
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
                            <button disabled={this.state.game ? false : true} style={{cursor: this.state.game ? 'pointer' : 'not-allowed'}} className='btn-game' onClick={e => this.handleClick(e, this.state.users[1].id, 'x')}>X</button>
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

                    {this.state.users.length > 1 && this.state.prepare
                        ? <div className={ prepareClass }>
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