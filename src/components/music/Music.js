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
            whichMusic: [true, false, false]
        }
        this.audio = null
        this.musicButton = null
    }

    componentDidMount = () => { 
        this.prepareMusic(bgSong1, 0.22)
        this.audioOnOff() 
    }

    componentWillUnmount = () => this.audio = null

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

    prepareMusic = (audio, volume) => {
        this.audio = new Audio(audio)
        this.audio.loop = true
        this.audio.volume = volume
    }

    pickMusic = param => {
        let newPick = [false, false, false]
        newPick[param] = true
        this.audio.pause()

        switch (param) {
            case 0:
                this.prepareMusic(bgSong1, .22)
                break
            case 1:
                this.prepareMusic(bgSong2, .11)
                break
            case 2:
                this.prepareMusic(bgSong3, .14)
                break
            default:
                break
        }
        this.audio.play()

        this.setState({ whichMusic: newPick })
    }

    render() {
        const { whichMusic, playMusic } = this.state

        return (
            <div>
                <button className="audio" onClick={this.audioOnOff}>{ this.musicButton }</button>
                
                <div className={ playMusic ? 'pick-music' : 'pick-music show-pick-music' }>
                    { whichMusic.map((btn, index) => (
                        <button 
                            className={btn ? 'check-music__btn checked-music' : 'check-music__btn'} 
                            onClick={e => this.pickMusic(index)} 
                            disabled={playMusic && true}
                            key={`music_${index}`}
                        ></button>
                    )) }
                </div>
            </div>
        )
    }
}