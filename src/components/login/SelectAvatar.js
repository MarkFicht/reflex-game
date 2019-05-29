import React, { Component } from 'react'
import AvatarList from '../other/AvatarList'

class SelectAvatar extends Component {
    state = { value: 'bardock' }

    selectAvatar = e => {
        if (typeof this.props.sendMethod === "function") {
            this.props.sendMethod(e)
        }

        // I will create own SelectBox in the future: https://www.youtube.com/watch?v=HvUI8bkLmk4
        this.setState({ value: e.target.value })    
    }

    render() {
        return (
            <div>
                <label htmlFor="selectAvatar">Wybierz postać:</label>
                <select id='selectAvatar' className='select-player' value={this.state.value} onChange={this.selectAvatar}>
                    { AvatarList }
                </select>
            </div>
        );
    }
}
export default SelectAvatar