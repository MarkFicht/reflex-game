import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Link } from 'react-router-dom';
import song from '../sound/music1.wav';

//---
class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            value: 'bardock',
            urlImg: '',
            validation: false,
            instruction: false,
        };
    };


    handleTextPlayer = e => {
        this.setState({ name: e.target.value })
    };


    //--- I will create own SelectBox in the future: https://www.youtube.com/watch?v=HvUI8bkLmk4
    handleSelectTag = e => {
        this.setState({ value: e.target.value });

        //--- Shows the previous value - FIXED
        console.log(this.state.value);
    };


    showInstruction = e => {
        this.setState({ instruction: !this.state.instruction })
    };


    //--- Add new player to Firebase / Redirection / Choosing avatar in game
    handleClickGame = e => {

        if (this.state.name.length > 3 && this.state.name.length < 10) {

            const storageImgPlayer = firebase.storage().ref('/imgPlayers/');
            storageImgPlayer.child(`${this.state.value}.gif`).getDownloadURL().then( (url) => {

                console.log(url);
                this.setState({ urlImg:  url});

                //---
                firebase.database().ref('/users').push({
                    nickname: this.state.name,
                    points: 0,
                    imgPlayer: this.state.urlImg
                }).then( (e) => this.props.history.push('/game') )

            }).catch( (error) => {
                // console.log(`Error: ${ error.code }`)
            })
        }
    };


    render() {

        const styles = { color: this.state.name.length > 3 && this.state.name.length < 10 ? '#5c7b1e' : 'red' };

        return (
            <div>
                <div className='fixed-logo'>
                    <h1 className="logo">
                    Reflex game
                    </h1>
                </div>

                <div className="div-login">
                    <label>
                        <p>Podaj Nick: </p>
                        <input placeholder='Nickname' type='text' value={this.state.name} onChange={this.handleTextPlayer}/>
                        <p className="nick-validation" style={ styles }>{ this.state.name.length > 3 && this.state.name.length < 10 ? 'Poprawny nick :)' : 'Nick musi zawierac od 4 do 9 znakow!' }</p>
                    </label>

                    <label>
                        <p>Wybierz postać: </p>
                        <select className='select-player' value={this.state.value} onChange={this.handleSelectTag}>
                            <option value="bardock">Bardock</option>
                            <option value="c18">c18</option>
                            <option value="gokussj3">GokuSsj3</option>
                            <option value="vegeta">Vegeta</option>
                        </select>
                    </label>

                    <div>
                        <button className='btn-login' onClick={this.handleClickGame}>{ 'GRAJ' }</button>
                        <button className='btn-login' onClick={this.showInstruction}>{ 'Instrukcja' }</button>
                        <button className='btn-login'>{ 'Rekordy' }</button>
                    </div>

                    <p className="create-by">
                        Game create by <span><i>Marek Ficht</i></span>
                    </p>
                    <p className="create-by">
                        All rights reserved &copy;
                    </p>
                </div>

                <div className='instruction' style={{ display: this.state.instruction ? 'block' : 'none'}}>
                    <div className='instruction-center'>
                        <div className='close-instruction' onClick={this.showInstruction}>x</div>
                        <h2>Zasady gry:</h2>
                        <ol>
                            <li>1. Jest to wersja Beta. W trakcie budowy.</li>
                            <li>2. Dziala tylko przycisk X podczas gry.</li>
                            <li>3. Wygrywa ten. kto wiecej wyklika, w krotszym czasie.</li>
                        </ol>
                    </div>
                </div>

                {/*<embed src={song} loop="true" style={{opacity: 0}}/>*/}
            </div>
        );
    }
}

export default Login;