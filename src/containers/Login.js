import React, { Component } from 'react'
import * as firebase from 'firebase'

import Logo from '../components/other/Logo'
import CreateBy from '../components/other/CreateBy'
import { randomChar } from '../components/other/randomChar'

import ChooseNick from '../components/login/ChooseNick'
import SelectAvatar from '../components/login/SelectAvatar'
import InstructionBtn from '../components/login/InstructionBtn'
import BestScoresBtn from '../components/login/BestScoresBtn'
import Validation from '../components/login/Validation'
import ShowOnline from '../components/login/ShowOnline'
const randomstring = require("randomstring")

class Login extends Component {
    _isMounted = false
    fooValidation = null

    state = {
        name: '',
        value: 'bardock',
        containerValidation: false,
        onlinePlayer: 0,
    }

    componentDidMount = () => {
        this._isMounted = true

        firebase.database().ref('/users').on('value', snap => {
            const val = snap.val()
            let currentOnline = []

            for (let key in val) { currentOnline.push({ nick: val[key].nick }) }

            /** How many online */
            if ( this._isMounted ) { this.setState({ onlinePlayer: currentOnline.length }) }
        })

        /** Restart: Bool for checking connected 2 players */
        firebase.database().ref('/game').update({ disconnect: false })
    }

    componentWillUnmount = () => {
        this._isMounted = false
        clearTimeout( this.fooValidation )
    }

    nickText = e => { this.setState({ name: e.target.value }) }
    selectTag = e => { this.setState({ value: e.target.value }) }

    /** ---Main function---
     * Add new player to Firebase + Choosing avatar
     * Redirection to '/game/:id/:validChars'
     * */
    prepareGame = async ( _isMounted ) => {
        const { name, onlinePlayer } = this.state

        if ( name.length >= 3 && name.length < 10 && onlinePlayer < 2 && _isMounted ) {

            const { history } = this.props
            const storageImgPlayer = await firebase.storage().ref('/imgPlayers/')
            const validChars = randomstring.generate(10)

            storageImgPlayer.child(`${this.state.value}.gif`).getDownloadURL().then(selectedUrlImg => {
                let newChar = randomChar[Math.floor( Math.random() * 3 + 1 ) - 1]

                firebase.database().ref('/users').push({
                    nick: this.state.name,
                    points: 0,
                    readyPlayer: false,
                    imgPlayer: selectedUrlImg,
                    char: newChar,
                    validChars: validChars,
                }).then(r => {

                    history.push({
                        pathname: `/game/${this.state.onlinePlayer - 1}/${validChars}`,
                        state: { validChars }
                    })
                }).catch( error => console.log(`Error in FB database: ${error}`) )
            }).catch( error => console.log(`Error in FB storage: ${error}`) )

        } else {
            /** Display of messages validation */
            this.setState({ containerValidation: true })
            clearTimeout( this.fooValidation )

            this.fooValidation = setTimeout(() => { this.setState({ containerValidation: false }) }, 2000)
        }
    }

    //--- RENDER ---//
    render() {
        const { name, containerValidation, onlinePlayer } = this.state
        const nickValidation = name.length >= 3 && name.length < 10

        return (
            <div>
                { Logo }
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
                    { CreateBy }
                </div>
            </div>
        )
    }
}
export default Login