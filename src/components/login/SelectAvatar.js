import React, { Component } from 'react';
import avatarList from '../other/avatarList';

class SelectAvatar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'bardock',
        }
    }

    selectAvatar = e => {
        if (typeof this.props.sendMethod === "function") {
            this.props.sendMethod(e);
        }
        this.setState({ value: e.target.value }); // I will create own SelectBox in the future: https://www.youtube.com/watch?v=HvUI8bkLmk4
    }

    render() {
        return (
            <div>
                <label htmlFor="selectAvatar">Wybierz postać:</label>
                <select id='selectAvatar' className='select-player' value={this.state.value} onChange={this.selectAvatar}>
                    {avatarList}
                </select>
            </div>
        );
    }
}

export default SelectAvatar;