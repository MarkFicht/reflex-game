import React, { Component } from 'react';
import '../styles/main.css';
import Music from './SimpleComponents/Music';

import Login from '../components/Login';
import Game from '../components/Game';
import GameOver from '../components/GameOver.js';

import { Route, HashRouter, Switch } from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheckCircle, faTimesCircle, faVolumeUp, faVolumeOff } from '@fortawesome/free-solid-svg-icons'
library.add(faCheckCircle, faTimesCircle, faVolumeUp, faVolumeOff);


//---
class App extends Component {

  render() {
    return (
        <HashRouter>
          <div className="App">

              <Music playMusic={true}/>

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
