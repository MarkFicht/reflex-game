import React, { Component } from 'react';

class Nick extends Component {
    render() {
        const nr = this.props.nrPlayer;

        return <h3 style={this.props.sendStyle}>{this.props.users[nr] ? this.props.users[nr].nickname : '-'}</h3>;
    }
}

export default Nick;