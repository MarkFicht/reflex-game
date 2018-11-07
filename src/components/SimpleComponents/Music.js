import React from "react";
import { Component } from "react";
import bgSong from "../../sound/bg_dynamic.m4a";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Music extends Component {
    constructor(props) {
        super(props);
        this.state = {
            audioMute: this.props.playMusic,
        }

        this.audio = new Audio(bgSong);
        this.audio.loop = true;
        this.audio.volume = 0.3;
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

    render() {
        return <div className="audio" onClick={this.audioOnOff}>{ this.music }</div>;
    }
}

export default Music;