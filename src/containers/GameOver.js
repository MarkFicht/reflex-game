import React from 'react'
import * as firebase from 'firebase'
import WhoWin from '../components/gameover/WhoWin'
import Logo from '../components/other/Logo'
import gameOverSound from '../sound/gameover.mp3'

class GameOver extends React.Component {
    _isMounted = false
    gameOverVoice = null

    state = {
        playersFromGame: [],
        pending: true
    }

    componentDidMount = () => {
        this._isMounted = true

        /** CASE: Redirect to Home */
        if ( !this.props.location.state && this._isMounted ) {
            this._isMounted = false
            this.props.history.push('/')
        }

        if ( this._isMounted ) {
            const { userId, simpleValid } = this.props.match.params

            /** Check TRUE for endPlayer */
            firebase.database().ref('/users').on('value', snap => {

                const val = snap.val()
                const prepareDropDB = []

                for (let key in val) {
                    prepareDropDB.push({ validChars: val[key].validChars })
                }

                if ( this._isMounted ) {

                    const validChars = prepareDropDB[userId] ? prepareDropDB[userId].validChars : null

                    if (validChars === simpleValid) {

                        const endPlayer = `endPlayer${Number(userId) + 1}`
                        firebase.database().ref('/game').update({ [endPlayer]: true })
                    }
                }
            }) 
            
            /** Remove safely players, when 2xTRUE for endPlayer + Restart Game */
            firebase.database().ref('/game').on('value', snap => {
                const val = snap.val()

                if ( this._isMounted && val.endPlayer1 && val.endPlayer2 ) {

                    firebase.database().ref('/game').update({
                        endPlayer1: false,
                        endPlayer2: false,
                        gameOver: false
                    })
                    firebase.database().ref('/users').remove()
                }
            })

            /** Prepare appropriate state */
            this.setState({
                playersFromGame: this.props.location.state,
                pending: false
            })

            /** Sound with a delay */
            this.gameOverVoice = setTimeout(() => {

                this.gameover = new Audio(gameOverSound).play()
                this.gameover.volume = .4
                clearTimeout( this.gameOverVoice )
            }, 1500)
        }
    }

    componentWillUnmount = () => {
        this._isMounted = false
        clearTimeout( this.gameOverVoice )
    }

    playAgain = () => this.props.history.push('/')

    render() {
        if (this.state.pending) return null

        return (
            <div>
                <div className="div-gameover">

                    { Logo }
                    <p className='text-game-over'> GAME OVER </p>

                    <WhoWin playersFromGame={this.state.playersFromGame} simpleValid={this.props.match.params.simpleValid} />

                    <button className="btn-gameover" onClick={ this.playAgain }>Play again?</button>
                </div>
            </div>
        )
    }
}
export default GameOver