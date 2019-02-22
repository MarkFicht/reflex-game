import React, { Component } from 'react';

class BestScoresBtn extends Component {
    
    state = {
        showBestScores: false
    }

    showOrHideBestScores = () => {
        this.setState({ showBestScores: !this.state.showBestScores })
    }

    render() {
        const { showBestScores } = this.state;

        const textBestScores = (<>
            <h2>W BUDOWIE :)</h2>
            <ol>
                <li><strong>1.</strong> Wersja Beta. Rekordy beda pobierane z Firebase</li>
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