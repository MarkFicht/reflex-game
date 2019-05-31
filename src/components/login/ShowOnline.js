import React, { Component } from 'react'

class ShowOnline extends Component {
    render() {
        const { onlinePlayer } = this.props
        const redColorWhenFull = onlinePlayer < 2 ? '#5c7b1e' : 'red'

        return (
            <p className='online-players'>ONLINE PLAYERS:
                <span style={{ color: redColorWhenFull }}>
                    { onlinePlayer }/2
                </span>
            </p>
        )
    }
}
export default ShowOnline