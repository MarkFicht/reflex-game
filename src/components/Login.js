import React, { Component } from 'react';
import * as firebase from 'firebase';
import bgSong from '../sound/bg_dynamic.m4a';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

//---
class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            value: 'bardock',
            urlImg: '',
            displayValidation: false,
            onlinePlayer: 0,
            instruction: false,
            audioMute: true,
        };
        this.showValidation = null;
        this.audio = new Audio(bgSong);
        this.audio.loop = true;
    };


    componentDidMount() {
        firebase.database().ref('/users').on('value', snap => {
            const val = snap.val();
            // console.log(val);

            let currentOnline = [];
            for (let key in val) {
                currentOnline.push({ nickname: val[key].nickname })
            }

            this.setState({ onlinePlayer: currentOnline.length })
            // console.log(this.state.onlinePlayer);
        })
    }


    audioOnOff = () => {
        this.setState( (prevState) => {
            return { audioMute: !prevState.audioMute };
        })
    }


    handleTextPlayer = e => {
        this.setState({ name: e.target.value })
    };


    handleSelectTag = e => {
        this.setState({ value: e.target.value });
        console.log(this.state.value); // Show prev value, because setState is async
        // I will create own SelectBox in the future: https://www.youtube.com/watch?v=HvUI8bkLmk4
    };


    showInstruction = () => {
        this.setState({ instruction: !this.state.instruction })
    };


    //--- Add new player to Firebase / Redirection / Choosing avatar in game
    handleClickGame = () => {

        if (this.state.name.length >= 3 && this.state.name.length < 10 && this.state.onlinePlayer < 2) {

            const storageImgPlayer = firebase.storage().ref('/imgPlayers/');
            storageImgPlayer.child(`${this.state.value}.gif`).getDownloadURL().then( (url) => {

                console.log(url);
                this.setState({ urlImg:  url});

                let randomChar = '';
                switch ( Math.floor( Math.random() * 3 + 1 ) ) {
                    case 1:
                        randomChar = 'x'
                        break;
                    case 2:
                        randomChar = 'y'
                        break;
                    case 3:
                        randomChar = 'z'
                        break;
                }

                //---
                firebase.database().ref('/users').push({
                    nickname: this.state.name,
                    points: 0,
                    imgPlayer: this.state.urlImg,
                    readyPlayer: false,
                    char: randomChar,
                }).then( (e) => this.props.history.push('/game') )

            }).catch( (error) => {
                // console.log(`Error: ${ error.code }`)
            })
        }
        else {
            this.setState({ displayValidation: true })
            clearTimeout(this.showValidation);

            this.showValidation = setTimeout( () => {
                this.setState({ displayValidation: false })

            }, 2000)
        }
    };


    componentWillUnmount() {
        clearTimeout(this.showValidation);
    }


    render() {

        const validationVar = this.state.name.length >= 3 && this.state.name.length < 10;
        const styles = { color: validationVar ? '#5c7b1e' : 'red' };

        if (this.state.audioMute) {
            this.audio.volume = 0;
            this.audio.pause();
        } else {
            this.audio.volume = 0.65;
            this.audio.play();
        }

        return (
            <div>
                <div className="audio" onClick={this.audioOnOff}>
                    { this.state.audioMute
                        ? <FontAwesomeIcon icon="volume-off" color='tomato' />
                        : <FontAwesomeIcon icon="volume-up" color='tomato' />

                    }
                </div>

                <div className='fixed-logo'>
                    <h1 className="logo">
                        Reflex game
                    </h1>
                </div>

                <div className="div-login">
                    <label>
                        <p>Podaj Nick: </p>
                        <input placeholder='Nickname' type='text' value={this.state.name} onChange={this.handleTextPlayer}/>
                        <div className="nick-validation">
                            { validationVar
                                ? <p>
                                    <FontAwesomeIcon icon="check-circle" style={ styles } />
                                </p>

                                : <p>
                                    <FontAwesomeIcon icon="times-circle" style={ styles } />
                                </p>
                            }
                        </div>
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

                    <div className='btn-validation'>
                        <button className='btn-login' onClick={this.handleClickGame}>{ 'GRAJ' }</button>
                        <button className='btn-login' onClick={this.showInstruction}>{ 'Instrukcja' }</button>
                        <button className='btn-login'>{ 'Rekordy' }</button>

                        <div className="info-online" style={{ display: this.state.displayValidation ? 'block' : 'none' }}>
                            { this.state.onlinePlayer >= 2
                                ? <p>Jest 2 graczy. Poczekaj chwilkę.</p>
                                : null
                            }
                            { validationVar
                                ? null
                                : <p>Nick musi zawierac od 3 do 9 znakow!</p>
                            }
                        </div>
                    </div>

                    <div className='online-players'>
                        <p>ONLINE PLAYERS:
                            <span style={{ color: this.state.onlinePlayer < 2 ? '#5c7b1e' : 'red' }}> { this.state.onlinePlayer }/2</span>
                        </p>
                    </div>

                    <div className="create-by">
                        <p>Game create by <span><i>Marek Ficht</i></span></p>
                        <p>All rights reserved &copy;</p>
                    </div>
                </div>

                <div className='instruction' style={{ display: this.state.instruction ? 'block' : 'none'}}>
                    <div className='instruction-center'>
                        <div className='close-instruction' onClick={this.showInstruction}>x</div>
                        <h2>Zasady gry:</h2>
                        <ol>
                            <li><strong>1.</strong> Wersja Beta.</li>
                            <li><strong>2.</strong> Aktualnie korzystamy tylko z myszki.</li>
                            <li><strong>3.</strong> Gra polega na kliknięciu właściwego znaku, który wyświetlany jest losowo nad przyciskami: X Y Z.</li>
                            <li><strong>4.</strong> Punkty mogą być odejmowane!</li>
                            <li><strong>5.</strong> Wygyrwa gracz, który uzbiera więcej punktów w czasie 30 sek.</li>
                        </ol>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;