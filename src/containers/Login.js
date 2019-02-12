import React, { Component } from 'react';
import * as firebase from 'firebase';

import logo from '../components/other/logo';
import createBy from '../components/other/createBy';
import randomChar from '../components/other/randomChar';

import ChooseNick from '../components/login/ChooseNick';
import SelectAvatar from '../components/login/SelectAvatar';
import Instruction from '../components/login/Instruction';
import BestScore from '../components/login/BestScore';
import Validation from '../components/login/Validation';
import ShowOnline from '../components/login/ShowOnline';

const randomstring = require("randomstring");


class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            value: 'bardock',
            urlImg: '',
            containerValidation: false,
            onlinePlayer: 0,
            instruction: false,
            bestScore: false,
        };
        this.showValidation = null;
    };

    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;

        firebase.database().ref('/users').on('value', snap => {
            const val = snap.val();

            let currentOnline = [];
            for (let key in val) {
                currentOnline.push({ nickname: val[key].nickname })
            }

            if ( this._isMounted ) {
                this.setState({ onlinePlayer: currentOnline.length });
            }
        })

        /** Restart: Bool for checking connected 2 players */
        firebase.database().ref('/game').update({
            disconnect: false,
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
        clearTimeout(this.showValidation);
    }

    //--- MY FUNCTIONS ---//
    nickText = e => {
        this.setState({ name: e.target.value });
    }

    selectTag = e => {
        this.setState({ value: e.target.value });
    }

    /**
     * Add new player to Firebase
     * Redirection to /game/#
     * Choosing avatar in game */
    prepareGame = () => {
        if (this.state.name.length >= 3 && this.state.name.length < 10 && this.state.onlinePlayer < 2) {

            const { history } = this.props;
            const storageImgPlayer = firebase.storage().ref('/imgPlayers/');
            const validChars = randomstring.generate(10);

            storageImgPlayer.child(`${this.state.value}.gif`).getDownloadURL().then( (url) => {

                this.setState({ urlImg:  url});

                let newChar = randomChar[Math.floor( Math.random() * 3 + 1 ) - 1];

                firebase.database().ref('/users').push({
                    nickname: this.state.name,
                    points: 0,
                    imgPlayer: this.state.urlImg,
                    readyPlayer: false,
                    char: newChar,
                    validChars: validChars,
                    disconnectPlayer: false,
                }).then( (e) => history.push(`/test/${this.state.onlinePlayer - 1}/${validChars}`) )

            }).catch( (error) => {
                console.log(`Error: ${ error.code }`)
            })
        }
        else {
            this.setState({ containerValidation: true })
            clearTimeout(this.showValidation);

            this.showValidation = setTimeout( () => {
                this.setState({ containerValidation: false })
            }, 2000)
        }
    }

    showInstruction = (e) => {
        this.setState({ instruction: e })
    }

    showBestScore = e => {
        this.setState({ bestScore: e })
    }

    //--- RENDER ---//
    render() {
        const nickValidation = this.state.name.length >= 3 && this.state.name.length < 10;

        return (
            <div>
                { logo }

                {/* ----------------------------------**MAIN CONTAINER - LOGIN**---------------------------------- */}
                <div className="div-login">

                    {/* Nick */}
                    <ChooseNick sendMethod={this.nickText} nickValidation={ nickValidation } />

                    {/* Select Avatar */}
                    <SelectAvatar sendMethod={this.selectTag}/>

                    {/* Buttons */}
                    <button className='btn-login' onClick={this.prepareGame}> Graj </button>
                    <button className='btn-login' onClick={e => this.showInstruction(true)}> Instrukcja </button>
                    <button className='btn-login' onClick={e => this.showBestScore(true)}> Rekordy </button>

                    {/* Validation */}
                    <Validation containerValidation={ this.state.containerValidation } onlinePlayer={ this.state.onlinePlayer } nickValidation={ nickValidation }/>

                    {/* Online players */}
                    <ShowOnline onlinePlayer={this.state.onlinePlayer}/>

                    {/* Footer */}
                    { createBy }
                </div>

                {/* ----------------------------------**INSTRUCTION CONTAINER**---------------------------------- */}
                { this.state.instruction && <Instruction sendMethod={this.showInstruction} /> }

                {/* ----------------------------------**SCORE-BOARD CONTAINER**---------------------------------- */}
                { this.state.bestScore && <BestScore sendMethod={this.showBestScore} /> }
            </div>
        );
    }
}

export default Login;