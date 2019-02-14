import React, { Component } from 'react';

class BestScore extends Component {
    hideBestScore = e => {
        if (typeof this.props.sendMethod === "function") {
            this.props.sendMethod(false);
        }
    }

    render() {
        return (
            <div className='instruction'>
                <div className='instruction-center'>
                    <div className='close-instruction' onClick={this.hideBestScore}> x </div>
                    <h2>W BUDOWIE :)</h2>
                    <ol>
                        <li><strong>1.</strong> Wersja Beta. Rekordy beda pobierane z Firebase</li>
                    </ol>
                </div>
            </div>
        );
    }
}

export default BestScore;