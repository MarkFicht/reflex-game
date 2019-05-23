import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import * as firebase from 'firebase'

const GameContext = React.createContext()

export default class GameProvider extends Component {
    _isMounted = false

    state = {
        test: 'tescik',
        players: [{
            who: null,
            nick: null,
            charInGame: null,
            imgPlayer: null,
            validChars: null,
            btnRdy: false,
            points: 0
        }, 
        {
            who: null,
            nick: null,
            charInGame: null,
            imgPlayer: null,
            validChars: null,
            btnRdy: false,
            points: 0
        }],
        howManyOnline: 0,
        disconnect: false,
        pending: true,
        prepare: 3,
        time: 30,
        startPrepare: false,
        startTime: false,
    }

    componentDidMount = () => {
        this._isMounted = true

        /** Download Players */
        firebase.database().ref('/users').on('value', snap => {

            const val = snap.val();
            const usersGame = [];

            for (let key in val) {
                usersGame.push({
                    who: key,
                    nick: val[key].nickname,
                    charInGame: val[key].char,
                    imgPlayer: val[key].imgPlayer,
                    validChars: val[key].validChars,
                    btnRdy: val[key].readyPlayer,
                    points: val[key].points
                })
            }

            if (this._isMounted) { this.setState({ players: usersGame, pending: false }) }
        })

        /** Download Game State */
        firebase.database().ref('/game').on('value', snap => {

            const val = snap.val()
            if (this._isMounted) { this.setState({ disconnect: val.disconnect }) }
        })

        /** Redirect to GameDisconnect.js -> CASE: 'refresh/F5' */
        window.onbeforeunload = () => {

            firebase.database().ref('/game').update({ disconnect: true })
            this.props.history.push('/gamedisconnect')
        }

        /** Redirect to NotFound.js -> CASE: 'Back Btn' */
        window.onpopstate = () => {

            if (this._isMounted) {
                const { time } = this.state

                if (time !== 0) { firebase.database().ref('/game').update({ disconnect: true }) }
            }
        }

        /** Redirect to GameDisconnect.js -> CASE: 'Not found props location from Login.js' */
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
            return <Redirect to='/gamedisconnect' />
        }
    }

    render() {

        if (this.state.pending) return null

        return (
            <GameContext.Provider value={{
                test: this.state.test,
                players: this.state.players
            }}>
                { this.props.children }
            </GameContext.Provider>
        )
    }
}

export const GameConsumer = GameContext.Consumer
