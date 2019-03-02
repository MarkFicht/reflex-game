import React, { Component } from 'react';
import * as firebase from 'firebase';


class BestScoresBtn extends Component {

    _isMounted = false;
    
    state = {
        scores: [
            { n: 'Marek', s: 100 }, { n: null, s: 0 }, 
            { n: null, s: 0 }, { n: null, s: 0 }, 
            { n: null, s: 0 }, { n: null, s: 0 },
            { n: null, s: 0 }, { n: null, s: 0 },
            { n: null, s: 0 }, { n: null, s: 0 }
        ],
        testBestScores: [],
        pending: true,
        showBestScores: false
    }

    componentDidMount() {
        this._isMounted = true;

        if ( this._isMounted ) {

            firebase.database().ref('/game/bestScores').on('value', snap => {
                console.log(snap.val());

                this.setState({
                    testBestScores: snap.val(),
                })

                console.log(this.state.testBestScores, snap.val().sort( (a, b) => { return b.score - a.score } ));
            })
        }
    }

    showOrHideBestScores = () => {
        this.setState({ showBestScores: !this.state.showBestScores })
    }

    render() {
        const { showBestScores, scores, testBestScores } = this.state;

        const textBestScores = (<>
            <h2>TOP 10 SCORES</h2>
            <ol>
                { scores.map( (player, index) => { 
                    return player.n !== null 
                        ? <li><strong>{index + 1}.</strong>{ `${player.n}: ${player.s}` }</li> 
                        : <li><strong>{index + 1}.</strong>{ `-` }</li>
                } ) }
            </ol>
        </>);

        const textBestScores2 = (<>
            <h2>TOP 10 SCORES</h2>
            <ol>
                { testBestScores.map( (val, index) => { 
                    return val.name !== null 
                        ? <li key={index}><strong>{index + 1}.</strong>{ `${val.name}: ${val.score}` }</li> 
                        : <li key={index}><strong>{index + 1}.</strong>{ `-` }</li>
                } ) }
            </ol>
        </>);

        const bestScores = showBestScores
            ? (<div className='best-scores-background'>
                <div className='best-scores-container'>
                    <div className='best-scores-close' onClick={ this.showOrHideBestScores }> x </div>
                    { textBestScores2 }
                </div>
            </div>)
            : null;

        /** MAIN RENDER */
        return (
            <>
                <button className='btn-login' onClick={ this.showOrHideBestScores }> Rekordy </button>
                { bestScores }
            </>
        );
    }
}

export default BestScoresBtn;