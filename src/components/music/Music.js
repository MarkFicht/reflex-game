import React from "react";
import { Component } from "react";
import bgSong1 from "../../sound/bg_dynamic.m4a";
import bgSong2 from "../../sound/bg_dynamic2.mp3";
import bgSong3 from "../../sound/bg_dynamic3.mp3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Music extends Component {
    constructor(props) {
        super(props);
        this.state = {
            audioMute: this.props.playMusic,
            // whichMusic: 1,
        }

        this.audio = new Audio(bgSong1);
        this.audio.loop = true;
        this.audio.volume = 0.25;
        this.music = null;
    }

    componentDidMount() {
        this.audioOnOff();
    }

    componentWillUnmount() {
        this.audio.pause()
    }

    audioOnOff = () => {
        if (!this.state.audioMute) {
            this.audio.pause();
            this.music = <FontAwesomeIcon icon="volume-off" color='tomato' />;
        }
        else {
            this.audio.play();
            this.music = <FontAwesomeIcon icon="volume-up" color='tomato' />;
        }

        this.setState( (prevState) => { return { audioMute: !prevState.audioMute } })
    }

    // handleChange = e => {
    //     console.log('work')
    // }

    render() {
        return (
            <div>
                <div className="audio" onClick={this.audioOnOff}>{ this.music }</div>

                {/* <idv className="audio">
                    <label htmlFor="music">Music</label>
                    <input type="checkbox" id="music" />
                </idv> */}
                
                {/*<fieldset className='under-audio'>*/}

                    {/*<legend>Music</legend>*/}
                    {/*<label><input type="radio" name='music' onChange={this.handleChange} checked/><span className='check'>1</span></label>*/}
                    {/*<label><input type="radio" name='music' onChange={this.handleChange}/><span className='check'>2</span></label>*/}

                {/*</fieldset>*/}
            </div>
        );
    }
}

export default Music;