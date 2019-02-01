import React, { Component } from 'react';

class Score extends Component {
    render() {
        const nr = this.props.nrPlayer;

        return (
            <div className="scores">
                <p style={this.props.sendStyle}>SCORE: {this.props.users[nr] ? this.props.users[nr].points : '-'}</p>
            </div>
        );
    }
}

export default Score;