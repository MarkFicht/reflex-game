import React, { Component } from 'react'
import '../styles/main.css'
import Music from '../components/music/Music'

import Login from '../containers/Login'
import Game from '../containers/Game'
import GameOver from '../containers/GameOver.js'
import GameDisconnect from '../containers/GameDisconnect'
import NotFound from '../containers/NotFound'

import { Route, HashRouter, Switch } from 'react-router-dom'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheckCircle, faTimesCircle, faVolumeUp, faVolumeOff } from '@fortawesome/free-solid-svg-icons'
library.add(faCheckCircle, faTimesCircle, faVolumeUp, faVolumeOff)


//---
class App extends Component {

  render() {
    return (
        <HashRouter>
          <div className="App">

              <Music playMusic={false}/>

              <Switch>
                <Route exact path="/" component={Login} />
                <Route exact path="/game/:userId/:simpleValid" component={Game} />
                <Route exact path="/gamedisconnect" component={GameDisconnect} />
                <Route exact path="/gameover/:userId/:simpleValid" component={GameOver} />
                <Route exact path="*" component={NotFound} />
            </Switch>
          </div>
        </HashRouter>
    );
  }
}

export default App
