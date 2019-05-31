import React, { Component } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import bgSong1 from "../../sound/bg_dynamic.m4a"
import bgSong2 from "../../sound/bg_dynamic2.mp3"
import bgSong3 from "../../sound/bg_dynamic3.mp3"

export default class Music extends Component {
    constructor(props) {
        super(props)
        this.state = {
            playMusic: false,
            // whichMusic: 1,
        }
        this.audio = new Audio(bgSong1)
        this.audio.loop = true
        this.audio.volume = 0.25
        this.musicButton = null
    }

    componentDidMount = () => this.audioOnOff()

    componentWillUnmount = () => this.audio.pause()

    audioOnOff = () => {
        if (!this.state.playMusic) {

            this.audio.pause()
            this.musicButton = <FontAwesomeIcon icon="volume-off" color='tomato' />
        } else {

            this.audio.play()
            this.musicButton = <FontAwesomeIcon icon="volume-up" color='tomato' />
        }

        this.setState( (prevState) => { return { playMusic: !prevState.playMusic } })
    }

    handleChange = e => {
        console.log('work')
    }

    render() {
        return (
            <div>
                <button className="audio" onClick={this.audioOnOff}>{ this.musicButton }</button>
                
                <fieldset className='check-music'>

                    <legend>Music</legend>
                    <label><input type="radio" name='music' onChange={this.handleChange} /><span className='check-music__btn'>1</span></label>
                    <label><input type="radio" name='music' onChange={this.handleChange} /><span className='check-music__btn'>2</span></label>

                </fieldset>
            </div>
        )
    }
}