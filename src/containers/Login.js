import React, { Component } from 'react';
import * as firebase from 'firebase';

import logo from '../components/other/logo';
import createBy from '../components/other/createBy';
import randomChar from '../components/other/randomChar';

import ChooseNick from '../components/login/ChooseNick';
import SelectAvatar from '../components/login/SelectAvatar';
import InstructionBtn from '../components/login/InstructionBtn';
import BestScoresBtn from '../components/login/BestScoresBtn';
import Validation from '../components/login/Validation';
import ShowOnline from '../components/login/ShowOnline';

const randomstring = require("randomstring");


class Login extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            value: 'bardock',
            containerValidation: false,
            onlinePlayer: 0,
        };
        this.fooValidation = null;
    };

    componentDidMount() {
        this._isMounted = true;

        firebase.database().ref('/users').on('value', snap => {
            const val = snap.val();

            let currentOnline = [];
            for (let key in val) { currentOnline.push({ nickname: val[key].nickname }) }

            /** How many online */
            if ( this._isMounted ) {
                this.setState({ onlinePlayer: currentOnline.length });
            }
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
        clearTimeout( this.fooValidation );
    }

    nickText = e => {
        this.setState({ name: e.target.value });
    }

    selectTag = e => {
        this.setState({ value: e.target.value });
    }

    /** ---Main function---
     * Add new player to Firebase + Choosing avatar
     * Redirection to '/game/id/validChars'
     * */
    prepareGame = (_isMounted ) => {
        const { name, onlinePlayer } = this.state;

        if ( name.length >= 3 && name.length < 10 && onlinePlayer < 2 && _isMounted ) {

            const { history } = this.props;
            const storageImgPlayer = firebase.storage().ref('/imgPlayers/');
            const validChars = randomstring.generate(10);

            storageImgPlayer.child(`${this.state.value}.gif`).getDownloadURL().then( (selectedUrlImg) => {
                let newChar = randomChar[Math.floor( Math.random() * 3 + 1 ) - 1];

                firebase.database().ref('/users').push({
                    nickname: this.state.name,
                    points: 0,
                    readyPlayer: false,
                    imgPlayer: selectedUrlImg,
                    char: newChar,
                    validChars: validChars,
                }).then( (e) => { 
                    history.push(`/game/${this.state.onlinePlayer - 1}/${validChars}`) 
                })

            }).catch( (error) => { console.log(`Error: ${error.code}`) });

        } else {
            /** Display of messages validation */
            this.setState({ containerValidation: true })
            clearTimeout( this.fooValidation );

            this.fooValidation = setTimeout( () => {
                this.setState({ containerValidation: false })
            }, 2000)
        }
    }

    //--- RENDER ---//
    render() {
        const { name, containerValidation, onlinePlayer } = this.state;
        const nickValidation = name.length >= 3 && name.length < 10;

        return (
            <div>
                { logo }

                {/* ----------------------------------**MAIN CONTAINER - LOGIN**---------------------------------- */}
                <div className="div-login">

                    {/* Nick */}
                    <ChooseNick sendMethod={ this.nickText } nickValidation={ nickValidation } />

                    {/* Select Avatar */}
                    <SelectAvatar sendMethod={ this.selectTag }/>

                    {/* Buttons */}
                    <button className='btn-login' onClick={ e => this.prepareGame( this._isMounted ) }> Graj </button>
                    <InstructionBtn />
                    <BestScoresBtn />

                    {/* Validation */}
                    <Validation containerValidation={ containerValidation } onlinePlayer={ onlinePlayer } nickValidation={ nickValidation }/>

                    {/* Online players */}
                    <ShowOnline onlinePlayer={ onlinePlayer }/>

                    {/* Footer */}
                    { createBy }
                </div>
            </div>
        );
    }
}

export default Login;