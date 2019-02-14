import React, { Component } from 'react';

class ShowOnline extends Component {
    render() {
        return <p className='online-players'>ONLINE PLAYERS:
            <span style={{ color: this.props.onlinePlayer < 2 ? '#5c7b1e' : 'red' }}> {this.props.onlinePlayer}/2</span>
        </p>
    }
}

export default ShowOnline;