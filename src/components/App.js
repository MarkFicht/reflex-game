import React, { Component } from 'react';

import '../styles/main.css';

// import Login from '../Login/Login';
// import Game from '../Game/Game';
// import GameOver from '../GameOver/GameOver.js';
// Old structure, standard, 3 files in 1 folder component: f.e. Login.js, Login.css, Login.scss

import Login from '../components/Login';
import Game from '../components/Game';
import GameOver from '../components/GameOver.js';

import {
    Route,
    HashRouter,
    Switch
} from 'react-router-dom';
import * as firebase from "firebase";

//---
class App extends Component {

  render() {
    return (
        <HashRouter>
          <div className="App">

            <Switch>
                <Route exact path="/" component={Login} />
                <Route exact path="/game" component={Game} />
                <Route exact path="/gameover" component={GameOver} />
            </Switch>
          </div>
        </HashRouter>
    );
  }
}

export default App;
