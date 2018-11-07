import React, { Component } from 'react';
import * as firebase from 'firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import logo from './static/logo';
import createBy from './static/createBy';
import randomChar from './static/randomChar';
import avatarList from './static/avatarList';

//--- REACT COMPONENTS
class ChooseNick extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
        }
    }

    validation = (arg) => {
        if(arg) { return <FontAwesomeIcon icon="check-circle" style={{ color: '#5c7b1e' }} /> }
        else { return <FontAwesomeIcon icon="times-circle" style={{ color: 'red' }} /> }
    }

    inputNick = e => {
        if (typeof this.props.sendMethod === "function") {
            this.props.sendMethod(e);
        }
        this.setState({ name: e.target.value });
    }

    render() {
        return (
            <div>
                <label htmlFor="nick">Podaj Nick:</label>
                <input id='nick' placeholder='Nickname' type='text' value={this.state.name} onChange={this.inputNick}/>
                <div className="validation-icon">{ this.validation(this.props.nickValidation) }</div>
            </div>
        );
    }
}

//---
class SelectAvatar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'bardock',
        }
    }

    selectAvatar = e => {
        if (typeof this.props.sendMethod === "function") {
            this.props.sendMethod(e);
        }
        this.setState({ value: e.target.value }); // I will create own SelectBox in the future: https://www.youtube.com/watch?v=HvUI8bkLmk4
    }

    render() {
        return (
            <div>
                <label htmlFor="selectAvatar">Wybierz postać:</label>
                <select id='selectAvatar' className='select-player' value={this.state.value} onChange={this.selectAvatar}>
                    { avatarList }
                </select>
            </div>
        );
    }
}

//---
class Instruction extends Component {
    hideInstruction = e => {
        if(typeof this.props.sendMethod === "function") {
            this.props.sendMethod(false);
        }
    }

    render() {
        return (
            <div className='instruction'>
                <div className='instruction-center'>
                    <div className='close-instruction' onClick={this.hideInstruction}> x </div>
                    <h2>Zasady gry:</h2>
                    <ol>
                        <li><strong>1.</strong> Wersja Beta. Nadal jest kilka bugów do rozwiazania :)</li>
                        <li><strong>2.</strong> Korzystamy z myszki podczas gry.</li>
                        <li><strong>3.</strong> Musimy kliknąć właściwy znak (wyświetlany losowo) nad przyciskami: X Y Z, by dostać punkt.</li>
                        <li><strong>4.</strong> Punkty są odejmowane za pomyłki!</li>
                        <li><strong>5.</strong> Wygyrwa gracz, który uzbiera więcej punktów w czasie 30 sek.</li>
                    </ol>
                </div>
            </div>
        );
    }
}

//---
class BestScore extends Component {
    hideBestScore = e => {
        if(typeof this.props.sendMethod === "function") {
            this.props.sendMethod(false);
        }
    }

    render() {
        return (
            <div className='instruction'>
                <div className='instruction-center'>
                    <div className='close-instruction' onClick={this.hideBestScore}> x </div>
                    <h2>W BUDOWIE :)</h2>
                    <ol>
                        <li><strong>1.</strong> Wersja Beta. Nadal jest kilka bugów do rozwiazania :)</li>
                        <li><strong>2.</strong> Gracze poki co usuwani sa tylko gdy dojdziemy do konca gry.
                            Brak rozlaczenia, gdy gracz wyjdzie lub gdy nacisnie wstecz, itp.</li>
                    </ol>
                </div>
            </div>
        );
    }
}

//---
class Validation extends Component {
    render() {
        return (
            <div className="validation" style={{ display: this.props.containerValidation ? 'block' : 'none' }}>
                { this.props.onlinePlayer >= 2
                    ? <p>Jest 2 graczy. Poczekaj chwilkę.</p>
                    : null
                }
                { this.props.nickValidation
                    ? null
                    : <p>Nick musi zawierac od 3 do 9 znakow!</p>
                }
            </div>
        );
    }
}

//---
class ShowOnline extends Component {
    render() {
        return <p className='online-players'>ONLINE PLAYERS:
            <span style={{ color: this.props.onlinePlayer < 2 ? '#5c7b1e' : 'red' }}> { this.props.onlinePlayer }/2</span>
        </p>
    }
}


//---  *** REACT MAIN COMPONENT ***  ---//
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

    componentDidMount() {
        firebase.database().ref('/users').on('value', snap => {
            const val = snap.val();

            let currentOnline = [];
            for (let key in val) {
                currentOnline.push({ nickname: val[key].nickname })
            }

            this.setState({ onlinePlayer: currentOnline.length })
        })
    }

    componentWillUnmount() {
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
     * Redirection
     * Choosing avatar in game */
    prepareGame = () => {
        if (this.state.name.length >= 3 && this.state.name.length < 10 && this.state.onlinePlayer < 2) {

            const { history } = this.props;
            const storageImgPlayer = firebase.storage().ref('/imgPlayers/');

            storageImgPlayer.child(`${this.state.value}.gif`).getDownloadURL().then( (url) => {

                this.setState({ urlImg:  url});

                let newChar = randomChar[Math.floor( Math.random() * 3 + 1 ) - 1];

                firebase.database().ref('/users').push({
                    nickname: this.state.name,
                    points: 0,
                    imgPlayer: this.state.urlImg,
                    readyPlayer: false,
                    char: newChar,
                }).then( (e) => history.push('/game') )

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
                    <button className='btn-login' onClick={this.prepareGame}> GRAJ </button>
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