import React, { Component } from 'react'
import { GameConsumer } from '../../context/GameContext'
import WaitingForPlayers from '../other/WaitingForPlayers'
import countdownPrepare from '../../sound/countdownPrepare.mp3'
import countdownTime from '../../sound/countdownTime.mp3'

export default class GameTimerWrapper extends Component {

    render() {
        return (
            <GameConsumer>
                {({ howManyOnline, time, prepare, startTime, startPrepare, __gameOverTrue, __startPrepareCountdown, __startRealCountdown, __realTimeBool }) => (
                    <>
                        { (howManyOnline % 2 === 1) && WaitingForPlayers }

                        <RealTime 
                            time={time} 
                            startTime={startTime}
                            __startRealCountdown={__startRealCountdown}
                            __gameOverTrue={__gameOverTrue}
                        />

                        <PrepareTime 
                            prepare={prepare} 
                            startPrepare={startPrepare}
                            __startPrepareCountdown={__startPrepareCountdown} 
                            __realTimeBool={__realTimeBool} 
                        /> 
                    </>
                )}
            </GameConsumer>
        )
    }
}

class RealTime extends Component {

    countdownTimeSound = new Audio(countdownTime)
    useOnce = true

    static defaultProps = { time: 'Error in GameTimerWrapper' }
    
    componentDidUpdate = () => {

        if (this.useOnce && this.props.startTime) {

            this.props.__startRealCountdown()   

            this.countdownTimeSound.volume = .3

            this.useOnce = false
        }

        if (this.props.time === 4) {
            
            this.countdownTimeSound.volume = .3
            this.countdownTimeSound.play()
        }

        if (this.props.time === 0) this.props.__gameOverTrue()
    }

    componentWillUnmount = () => this.countdownTimeSound = null

    render() {
        const { time } = this.props
        const timerColor = { color: (time <= 12 && time > 5 && 'darkorange') || (time <= 5 && 'darkred') }

        return (
            <div className="timer">
                TIME: <span style={timerColor}>{ time }</span>
            </div>
        )
    }
}

class PrepareTime extends Component {

    constructor(props) {
        super(props)
        this.countdownPrepareSound = new Audio(countdownPrepare)
        this.useOnce = true
    }

    static defaultProps = { prepare: 3 }

    componentDidUpdate = () => {

        if (this.useOnce && this.props.startPrepare) {

            this.props.__startPrepareCountdown()

            this.countdownPrepareSound.volume = .3
            this.countdownPrepareSound.play()
            this.countdownPrepareSound = null

            this.useOnce = false
        }
    }

    componentWillUnmount = () => this.countdownPrepareSound = null

    render() {
        const { prepare, startPrepare } = this.props

        if (startPrepare && prepare >= 0) return <div className='prepare'>{prepare === 0 ? 'start' : prepare}</div>
        else return null
    }
}
