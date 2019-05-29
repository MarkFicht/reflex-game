import React, { Component } from 'react'

export default class PlayerReady extends Component {
    _isMounted = false

    state = {
        hideBtns: false
    }

    componentDidMount = () => this._isMounted = true

    componentDidUpdate = () => {
        const { players, howManyOnline, __prepareTimeBool } = this.props

        // Effect for hiding btns slow
        if ( !this.state.hideBtns && this._isMounted && howManyOnline === 2 ) {

            if (players[0].btnRdy && players[1].btnRdy) {
                this.setState({ hideBtns: true })

                // Should be change 'startPrepare' on TRUE, once.
                __prepareTimeBool()     
            }
        }
    }

    componentWillUnmount = () => this._isMounted = false

    render() {

        const { players, side, appropriatePlayer, ID_URL, howManyOnline, __playerRdy } = this.props

        const btnRdyClass = `btn-ready${side + 1}`
        const btnRdyWithEffect = appropriatePlayer ? `` : ` btn-ready-noEffect`
        const btnRdySlowHide = !this.state.hideBtns ? `` : ` btn-ready-opacity`

        const btnRdy = players[side] ? players[side].btnRdy : null
        const btnColor = btnRdy ? 'limegreen' : 'tomato'
        const btnCaption = btnRdy ? 'OK' : 'Ready?'
        const style = { color: btnColor, borderColor: btnColor }

        return (
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
        )
    }
}
