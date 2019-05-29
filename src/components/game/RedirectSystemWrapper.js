import React, { Component } from 'react'
import * as firebase from 'firebase'
import { Redirect } from 'react-router-dom'
import { GameConsumer } from '../../context/GameContext'

export default class RedirectSystemWrapper extends Component {

    render() {
        const { location, match, history } = this.props

        return (
            <GameConsumer>
                {({ disconnect, gameOver, time }) => <RedirectSystem disconnect={disconnect} gameOver={gameOver} time={time} location={location} match={match} history={history} />}
            </GameConsumer>
        )
    }
}

class RedirectSystem extends Component {
    _isMounted = false

    componentDidMount = () => {
        this._isMounted = true

        /** REDIRECT to GameDisconnect.js -> CASE: 'refresh/F5' */
        window.onbeforeunload = () => firebase.database().ref('/game').update({ disconnect: true })

        /** REDIRECT to GameDisconnect.js -> CASE: 'Back Btn' */
        window.onpopstate = () => {
            if (this._isMounted) {

                if (this.props.time !== 0 || !this.props.gameOver) { firebase.database().ref('/game').update({ disconnect: true }) }
            }
        }

        /** REDIRECT to NotFound.js -> CASE: 'Not found props location from Login.js' */
        if (!this.props.location.state || this.props.location.state.validChars !== this.props.match.params.simpleValid) {

            this.props.history.push('/*')
        }
    }

    componentWillUnmount = () => this._isMounted = false


    /** --- IF 'disconnect === true' from Firebase ---
    * 1.DropDB
    * 2.Redirect do GameDisconnect
    */
    redirectToGameDisconnect = (isMounted) => {
        if (isMounted) {

            firebase.database().ref('/users').remove()
            firebase.database().ref('/game').update({ disconnect: false })
            return <Redirect to='/gamedisconnect' />
        }
    }

    /** --- IF 'GameOver' ---
    * 1.Redirect do GameOver
    * 2.Send data in this.props.lacation.state
    */
    redirectToGameOver = (isMounted) => {
        const { time, gameOver } = this.props
        if (isMounted && (time === 0 || gameOver)) {
            console.log('przekierowanie do GameOver')
            // const { idPlayer } = this.props;
            // const currentPlayer = idPlayer[0];

            // return <Redirect to={{
            //     pathname: `/gameover/${currentPlayer}/${this.state.scoresPlayers[currentPlayer].validChars}`,
            //     state: this.state.scoresPlayers
            // }} />
        }
    }

    render() {
        return <>
            { this.props.disconnect && this.redirectToGameDisconnect( this._isMounted ) }
            { this.props.gameOver && this.redirectToGameOver( this._isMounted ) }
        </>
    }
}

