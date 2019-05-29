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
        time: 5,
        startPrepare: false,
        startTime: false,
        gameOver: false
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
            if (this._isMounted) { 
                this.setState({ 
                    disconnect: val.disconnect,
                    gameOver: val.gameOver
                    //prepare: val.prepare,
                    //time: val.time
                }) 
            }
        })
    }

    componentWillUnmount = () => {
        this._isMounted = false
        this.startPrepareCountdown = null
        this.startRealCountdown = null
    }

    /** 
     * Change State Function
     */
    prepareTimeBool = () => this.setState({ startPrepare: true })
    realTimeBool = () => this.setState({ startTime: true })

    startPrepareCountdown = () => {

        const prepareId = setInterval(() => {

            this.setState(prevState => {
                return { prepare: prevState.prepare - 1 }
            })

            if (this.state.prepare < 0) {

                this.setState({ startTime: true })
                clearInterval(prepareId)
            }
        }, 1000)
    }

    startRealCountdown = () => {

        const timeId = setInterval(() => {

            this.setState((prevState) => {
                return { time: prevState.time - 1 }
            })

            if (this.state.time === 0) {

                clearInterval(timeId)
            }
        }, 1000)
    }


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

    gameOverBool = () => firebase.database().ref('/game').update({ gameOver: true })
    

    render() {

        if (this.state.pending) return null

        return (
            <GameContext.Provider value={{
                __playerRdy: this.playerRdy,
                __gameOverBool: this.gameOverBool,
                __prepareTimeBool: this.prepareTimeBool,
                __realTimeBool: this.realTimeBool,
                __startPrepareCountdown: this.startPrepareCountdown,
                __startRealCountdown: this.startRealCountdown,
                disconnect: this.state.disconnect,
                gameOver: this.state.gameOver,
                time: this.state.time,
                prepare: this.state.prepare,
                startTime: this.state.startTime,
                startPrepare: this.state.startPrepare,
                howManyOnline: this.state.howManyOnline,
                players: this.state.players
            }}>
                { this.props.children }
            </GameContext.Provider>
        )
    }
}

export const GameConsumer = GameContext.Consumer
