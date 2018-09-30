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
            displayValidation: false,
            onlinePlayer: 0,
            instruction: false,
        };
        this.showValidation = null;
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


    handleTextPlayer = e => {
        this.setState({ name: e.target.value })
    };


    handleSelectTag = e => {
        this.setState({ value: e.target.value });
        console.log(this.state.value); // Show prev value, because setState is async
        // I will create own SelectBox in the future: https://www.youtube.com/watch?v=HvUI8bkLmk4
    };


    showInstruction = e => {
        this.setState({ instruction: !this.state.instruction })
    };


    //--- Add new player to Firebase / Redirection / Choosing avatar in game
    handleClickGame = e => {

        if (this.state.name.length > 3 && this.state.name.length < 10 && this.state.onlinePlayer < 2) {

            const storageImgPlayer = firebase.storage().ref('/imgPlayers/');
            storageImgPlayer.child(`${this.state.value}.gif`).getDownloadURL().then( (url) => {

                console.log(url);
                this.setState({ urlImg:  url});

                //---
                firebase.database().ref('/users').push({
                    nickname: this.state.name,
                    points: 0,
                    imgPlayer: this.state.urlImg,
                    readyPlayer: false,
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

                    <div className='btn-validation'>
                        <button className='btn-login' onClick={this.handleClickGame}>{ 'GRAJ' }</button>
                        <button className='btn-login' onClick={this.showInstruction}>{ 'Instrukcja' }</button>
                        <button className='btn-login'>{ 'Rekordy' }</button>

                        <div className="info-online" style={{ display: this.state.displayValidation ? 'block' : 'none' }}>
                            { this.state.onlinePlayer >= 2
                                ? <p>Jest 2 graczy. Poczekaj chwilkę.</p>
                                : null
                            }
                            { this.state.name.length > 3 && this.state.name.length < 10
                                ? null
                                : <p>Nick musi zawierac od 4 do 9 znakow!</p>
                            }
                        </div>
                    </div>

                    <div className='online-players'>
                        <p>ONLINE PLAYERS:
                            <span style={{ color: this.state.onlinePlayer < 2 ? '#5c7b1e' : 'red' }}> { this.state.onlinePlayer }/2</span>
                        </p>
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
                            <li><strong>1.</strong> Jest to wersja Beta. Brakuje zabezpieczeń, przekierowań, itp.</li>
                            <li><strong>2.</strong> Aktualnie korzystamy tylko z myszki.</li>
                            <li><strong>3.</strong> Gra polega na kliknięciu właściwego znaku, który wyświetlany jest losowo nad przyciskami: X Y Z.</li>
                            <li><strong>4.</strong> Punkty mogą być odejmowane!</li>
                            <li><strong>5.</strong> Wygyrwa gracz, który uzbiera więcej punktów w czasie 20 sek.</li>
                        </ol>
                    </div>
                </div>

                {/*<embed src={song} loop="true" style={{opacity: 0}}/>*/}
            </div>
        );
    }
}

export default Login;