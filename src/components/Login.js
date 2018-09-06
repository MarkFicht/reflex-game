import React, { Component } from 'react';
// import './Login.css'; // Stary zapis, gdzie mialem w strukturze pliki scss i css w folderze z Komponentem.js.
// Wtedy musialem robic niepotrzebna redundancje na zmienne z kolorami itp.

import { Link } from 'react-router-dom';
import * as firebase from 'firebase';
import song from '../sound/music1.wav';

//---
class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            validation: false,
            instruction: false,
        }
    }

    handleTextPlayer = e => {
        this.setState({
            name: e.target.value,
        })
    }

    handleClick = e => {

        if (this.state.name.length > 3 && this.state.name.length < 10) {
            //przekierowanie

            firebase.database().ref('/users').push({
                nickname: this.state.name,
                points: 0
            }).then( (e) => this.props.history.push('/game'))
        }
    }

    showInstruction = e => {
        this.setState({
            instruction: !this.state.instruction,
        })
    }

    render() {

        // const checkValidation = this.state.name.length > 3 && this.state.name.length < 10;

        const styles = {
            color: this.state.name.length > 3 && this.state.name.length < 10 ? '#5c7b1e' : 'red'
        }
        return (
            <div>
                <h1 className="logo">
                    Reflex game
                </h1>

                <div className="div-login">
                    <p>Podaj Nick: </p>
                    <input type='text' value={this.state.name} onChange={this.handleTextPlayer}/>
                    <p className="nick-validation" style={ styles }>{ this.state.name.length > 3 && this.state.name.length < 10 ? 'Poprawny nick :)' : 'Nick musi zawierac od 4 do 9 znakow!' }</p>
                    <div>
                        <button className='btn-login' onClick={this.handleClick}>{ 'GRAJ' }</button>
                        <button className='btn-login' onClick={this.showInstruction}>{ 'Instrukcja' }</button>
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
                            <li>1. Jakis tekst dfdfdfdfdfdfdfdfdfdfdf.</li>
                            <li>2. Jakis tekst dfdfdfdfdfdfdfdfdfdfdf.</li>
                            <li>3. Jakis tekst dfdfdfdfdfdfdfdfdfdfdf.</li>
                        </ol>
                    </div>
                </div>

                {/*<embed src={song} loop="true" style={{opacity: 0}}/>*/}
            </div>
        );
    }
}

export default Login;