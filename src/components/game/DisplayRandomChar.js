import React, { Component } from 'react';

class DisplayRandomChar extends Component {
    render() {
        const nr = this.props.nrPlayer;

        return (
            <div className="random-char">{this.props.game ? this.props.users[nr].char : '?'}</div>
        );
    }
}

export default DisplayRandomChar;