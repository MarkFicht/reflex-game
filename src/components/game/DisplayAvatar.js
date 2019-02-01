import React, { Component } from 'react';

class DisplayAvatar extends Component {
    render() {
        const nr = this.props.nrPlayer;

        return (
            <div className='player'>
                <div className={`player-img${nr + 1}`} style={{ backgroundImage: this.props.users[nr] && `url("${this.props.users[nr].imgPlayer}")` }}>{}</div>
            </div>
        );
    }
}

export default DisplayAvatar;