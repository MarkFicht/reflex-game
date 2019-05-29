import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import * as firebase from 'firebase'
import Logo from '../components/other/Logo'

class GameDisconnect extends Component {
    _isMounted = false
    redirectInterval = null

    state = { redirectTime: 3 }

    componentDidMount = () => {
        this._isMounted = true

        if (this._isMounted) {

            this.redirectInterval = setInterval(() => {

                this.setState({ redirectTime: this.state.redirectTime - 1 })
            }, 1000)

            /** Restart: Bool for checking connected 2 players */
            firebase.database().ref('/game').update({
                disconnect: false,
                endPlayer1: false,
                endPlayer2: false
            })
        }  
    }

    componentWillUnmount = () => {
        this._isMounted = false
        clearTimeout(this.redirectInterval)
    }

    render() {
        const { redirectTime } = this.state
        
        return (
            <div className='disconnected'>
                { Logo }
                <p> Jeden z graczy wyszedł lub został rozłączony. </p>
                <p> Gra została przerwana. </p>
                <h3>{ `Przekierowanie za: ${ redirectTime }` }</h3>
                { redirectTime < 0 && <Redirect to='/' />}
            </div>
        );
    }
}
export default GameDisconnect