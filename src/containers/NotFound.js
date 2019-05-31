import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Logo from '../components/other/Logo'
// import * as firebase from 'firebase'

class NotFound extends Component {
    state = { redirectTime: 3 }
    redirectInterval = null

    componentDidMount = () => {
        this.redirectInterval = setInterval(() => {

            this.setState({ redirectTime: this.state.redirectTime - 1 })
        }, 1000)

        /** Restart: disconnect */
        // firebase.database().ref('/game').update({ disconnect: false })
    }

    componentWillUnmount = () => clearTimeout(this.redirectInterval)

    render() {
        return (
            <div className='not-found'>
                { Logo }
                <h3> 404 Not found :( </h3>
                <h3>{ `Przekierowanie za: ${this.state.redirectTime}` }</h3>
                { this.state.redirectTime < 0 && <Redirect to='/' />}
            </div>
        )
    }
}
export default NotFound