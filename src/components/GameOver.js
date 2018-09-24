import React, { Component } from 'react';
import * as firebase from 'firebase'

class GameOver extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            players: [],
            pending: true
        }
    }


    componentDidMount() {

        //--- Downloading data and checking for Redirection
        firebase.database().ref('/users').on('value', snap => {
            const value = snap.val();

            if(!value) {
                this.props.history.push('/');
            }
            const players = [];

            for(var key in value) {
                players.push(value[key]);
            }

            this.setState({
                players: players,
                pending: false
            })
        });
    };


    playAgain = () => {
        firebase.database().ref('/users').remove();
    };


    render() {

        if (this.state.pending) { return null; }

        return (
            <div>
                {console.log(this.state.players)}
                <div className="div-gameover">
                    <h1 className="logo">
                        Reflex game
                    </h1>
                    <p className='game-over'> GAME OVER </p>
                    <p className='game-winner'>
                        Winner is:  <span className='text-winner'>{
                             this.state.players[0].points > this.state.players[1].points
                                ? this.state.players[0].nickname
                                : this.state.players[1].nickname
                    }</span>
                     </p>
                    <button className="btn-gameover" onClick={this.playAgain}>Play again?</button>
                </div>
            </div>
        );
    }

}

export default GameOver;