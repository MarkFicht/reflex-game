import React, { Component } from 'react'
import * as firebase from 'firebase'

const GameContext = React.createContext()

export default class GameProvider extends Component {
    _isMounted = false

    state = {
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

            if (this._isMounted) { 

                this.setState({ 
                    players: usersGame,
                    howManyOnline: usersGame.length,
                    pending: false 
                }) 
            }
        })

        /** Download Game State */
        firebase.database().ref('/game').on('value', snap => {

            const val = snap.val()
            if (this._isMounted) { this.setState({ disconnect: val.disconnect }) }
        })
    }

    componentWillUnmount = () => this._isMounted = false

    /** 
     * Change State Function
     */
    startGame = () => this.setState({ startTime: true })


    /** 
     * Firebase Function 
     * */
    playerRdy = (objPlayers, ID_URL, bool, isMounted) => {
        let playerExist = objPlayers[ID_URL] ? objPlayers[ID_URL] : false

        if (!bool || !isMounted || !playerExist) return null

        firebase.database().ref('/users/' + playerExist.who).update({
            readyPlayer: !playerExist.btnRdy
        })
    }

    render() {

        if (this.state.pending) return null

        return (
            <GameContext.Provider value={{
                __playerRdy: this.playerRdy,
                __startGame: this.startGame,
                disconnect: this.state.disconnect,
                time: this.state.time,
                prepare: this.state.prepare,
                howManyOnline: this.state.howManyOnline,
                players: this.state.players
            }}>
                { this.props.children }
            </GameContext.Provider>
        )
    }
}

export const GameConsumer = GameContext.Consumer
