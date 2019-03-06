import React, { Component } from 'react';

import Winner from './Winner';

class WhoWin extends Component {
    _isMounted = false;

    state = {
        pending: true
    };

    componentDidMount() {
        this._isMounted = true;

        if ( this._isMounted ) {

            this.setState({
                pending: false
            })
        }
    }
    
    componentWillUnmount() {
        this._isMounted = false;
    }

    
    render() {
        if ( this.state.pending && !this.props.playersFromGame ) { return null; };

        const player1 = this.props.playersFromGame[0];
        const player2 = this.props.playersFromGame[1];

        const winner = player1.points > player2.points ? player1 : player2;
        const looser = player1.points < player2.points ? player1 : player2;
        const wasDraw = player1.points === player2.points ? true : false;

        const displayDraw = (
            <div>
                DRAW: <span className='text-winner'>{ player1.nickname }</span> & <span className='text-winner'>{ player2.nickname }</span>
                <br />
                SCORE: <span className='text-winner'>{ player1.points }</span>
            </div>
        );

        const displayWinner = (
            <div>
                WINNER: <span className='text-winner'>{ winner.nickname }</span> SCORE: <span className='text-winner'>{ winner.points }</span>
                <br />
                looser: <span className='text-looser'>{ looser.nickname }</span> score: <span className='text-looser'>{ looser.points }</span>
            </div>
        );

        /**  */
        return (
            <div className='game-winner-container'>
                { wasDraw ? displayDraw : displayWinner }

                <Winner simpleValid={ this.props.simpleValid } winner={ winner } isDraw={ wasDraw } playersFromGame={ this.props.playersFromGame }/>
            </div>
        );
    };
};

export default WhoWin;