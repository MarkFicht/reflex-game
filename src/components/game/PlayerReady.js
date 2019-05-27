import React, { Component } from 'react'
import { GameConsumer } from '../../context/GameContext'

export default class PlayerReady extends Component {
    _isMounted = false

    state = {
        hideBtns: false
    }

    componentDidMount = () => this._isMounted = true

    componentDidUpdate = () => {
        const { players, howManyOnline, __startGame } = this.props

        // Effect for hiding btns slow
        if ( !this.state.hideBtns && this._isMounted && howManyOnline === 2 ) {

            if (players[0].btnRdy && players[1].btnRdy) {
                this.setState({ hideBtns: true })
                __startGame()
            }
        }
    }

    componentWillUnmount = () => this._isMounted = false

    render() {

        const { players, side, appropriatePlayer, ID_URL, howManyOnline } = this.props

        const btnRdyClass = `btn-ready${side + 1}`
        const btnRdyWithEffect = appropriatePlayer ? `` : ` btn-ready-noEffect`
        const btnRdySlowHide = !this.state.hideBtns ? `` : ` btn-ready-opacity`

        const btnRdy = players[side] ? players[side].btnRdy : null
        const btnColor = btnRdy ? 'limegreen' : 'tomato'
        const btnCaption = btnRdy ? 'OK' : 'Ready?'
        const style = { color: btnColor, borderColor: btnColor }

        return (
            <GameConsumer>
                {({ __playerRdy }) => (
                    <>
                        {side < howManyOnline
                            ? <button 
                                className={btnRdyClass + btnRdyWithEffect + btnRdySlowHide}  
                                onClick={e => __playerRdy(players, ID_URL, appropriatePlayer, this._isMounted)}
                                style={style}
                            >{ btnCaption }</button>
                            : null
                        }
                    </>
                )}
            </GameConsumer>
        )
    }
}
