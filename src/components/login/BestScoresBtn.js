import React, { Component } from 'react';

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
        pending: true,
        showBestScores: false
    }

    componentDidMount() {
        this._isMounted = true;

        if ( this._isMounted ) {

        }
    }

    showOrHideBestScores = () => {
        this.setState({ showBestScores: !this.state.showBestScores })
    }

    render() {
        const { showBestScores, scores } = this.state;

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

        const bestScores = showBestScores
            ? (<div className='best-scores-background'>
                <div className='best-scores-container'>
                    <div className='best-scores-close' onClick={ this.showOrHideBestScores }> x </div>
                    { textBestScores }
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