import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as firebase from 'firebase';
import bgSong from '../sound/bg_dynamic.m4a';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

//--- JSX TAG - Static text
const Logo = <h1 className="logo">Reflex game</h1>;

const CreateBy = (
    <div className="create-by">
        <p>Game create by <span><i>Marek Ficht</i></span></p>
        <p>All rights reserved &copy;</p>
    </div>
);

const avatars = [
    {value: 'bardock',  text: 'Bardock'},
    {value: 'c18',      text: 'C18'},
    {value: 'gokussj3', text: 'Goku Ssj3'},
    {value: 'vegeta',   text: 'Vegeta'} ];

const avatarList = avatars.map( char => {
    return <option value={char.value}>{ char.text }</option>
});


//--- REACT COMPONENTS
class Music extends Component {
    constructor(props) {
        super(props);

        this.state = {
            audioMute: true,
        }
        this.audio = new Audio(bgSong);
        this.audio.loop = true;
        this.audio.volume = 0.25;
        this.music = <FontAwesomeIcon icon="volume-off" color='tomato' />;
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

//---
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
                <div className='close-instruction' onClick={this.hideInstruction}> x </div>
                <div className='instruction-center'>
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
    nickText= e => {
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

    //--- RENDER ---//
    render() {
        const nickValidation = this.state.name.length >= 3 && this.state.name.length < 10;

        return (
            <div>

                <Music />
                { Logo }

                {/* ----------------------------------**MAIN CONTAINER - LOGIN**---------------------------------- */}
                <div className="div-login">

                    {/* Nick */}
                    <ChooseNick sendMethod={this.nickText} nickValidation={ nickValidation } />

                    {/* Select Avatar */}
                    <SelectAvatar sendMethod={this.selectTag}/>

                    {/* Buttons */}
                    <button className='btn-login' onClick={this.prepareGame}> GRAJ </button>
                    <button className='btn-login' onClick={e => this.showInstruction(true)}> Instrukcja </button>
                    <button className='btn-login'> Rekordy </button>

                    {/* Validation */}
                    <Validation containerValidation={ this.state.containerValidation } onlinePlayer={ this.state.onlinePlayer } nickValidation={ nickValidation }/>

                    {/* Online players */}
                    <ShowOnline onlinePlayer={this.state.onlinePlayer}/>

                    {/* Footer */}
                    { CreateBy }
                </div>


                {/* ----------------------------------**INSTRUCTION CONTAINER**---------------------------------- */}
                { this.state.instruction && <Instruction sendMethod={this.showInstruction} /> }


                {/* ----------------------------------**SCORE-BOARD CONTAINER**---------------------------------- */}
                {/* I will add in the future */}

            </div>
        );
    }
}

export default Login;