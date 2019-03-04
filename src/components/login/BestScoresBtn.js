import React, { Component } from 'react';
import * as firebase from 'firebase';


class BestScoresBtn extends Component {

    _isMounted = false;
    
    state = {
        displayTop10: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        bestScores: [],
        pending: true,
        showBestScores: false
    }

    componentDidMount() {
        this._isMounted = true;

        if ( this._isMounted ) {

            firebase.database().ref('/game/bestScores').on('value', snap => {
                console.log(snap.val());

                if ( this._isMounted && snap.val() ) {
                    this.setState({
                        bestScores: snap.val(),
                    })
                }

                // console.log(this.state.bestScores, snap.val().sort( (a, b) => { return b.score - a.score } ));
            })
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    showOrHideBestScores = () => {
        this.setState({ showBestScores: !this.state.showBestScores })
    }

    render() {
        const { showBestScores, bestScores, displayTop10 } = this.state;

        const listBestScores = (<>
            <h2>TOP 10 SCORES</h2>
            <ol>
                { displayTop10.map( (val, index) => { 
                    let player = bestScores[index]; 

                    return player !== undefined 
                        ? <li key={index}><strong>{index + 1}.</strong>{ `${player.name}: ${player.score}` }</li> 
                        : <li key={index}><strong>{index + 1}.</strong>{ `-` }</li>
                } ) }
            </ol>
        </>);

        const containerBestScores = showBestScores
            ? (<div className='best-scores-background'>
                <div className='best-scores-container'>
                    <div className='best-scores-close' onClick={ this.showOrHideBestScores }> x </div>
                    { listBestScores }
                </div>
            </div>)
            : null;

        /** MAIN RENDER */
        return (
            <>
                <button className='btn-login' onClick={ this.showOrHideBestScores }> Rekordy </button>
                { containerBestScores }
            </>
        );
    }
}

export default BestScoresBtn;