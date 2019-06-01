import React, { Component } from 'react'
import GameProvider from '../context/GameContext'
import GameTimerWrapper from '../components/game/GameTimerWrapper'
import RedirectSystemWrapper from '../components/game/RedirectSystemWrapper'
import PlayerSide from '../components/game/PlayerSide'

  /** ---Structure---
   * Game >                             (FB + P)     Render Provider from GameContext.js
   *    RedirectSystemWrapper >         (R + C)      Redirect to /GameDisconnected /GameOver /NotFound. 
   *    GameTimerWrapper >              (S + C)      All countdowns of the game
   *    PlayerSide(x2) >                (C)          Unique side for appropriatePlayer.
   *        PlayerReady >               (C)          Start game, when 2 players ready
   *        GameButtonsAppropriate >    (FB + M + C) Main mechanism
   * 
   *  ---LEGEND---
   *  (FB)  Firebase reference
   *  (P)   Provider
   *  (C)   Consumer
   *  (R)   Redirect
   *  (M)   Main mechanism of the game
   *  (S)   Sounds
   */

class Game extends Component {

    render() {
        const ID_URL = Number(this.props.match.params.userId)

        return (
            <div className="div-game">
                <GameProvider>
                    
                    <RedirectSystemWrapper match={this.props.match} location={this.props.location} history={this.props.history} ID_URL={ID_URL}/>
                    <GameTimerWrapper />

                    <PlayerSide side={0} ID_URL={ID_URL} />
                    <PlayerSide side={1} ID_URL={ID_URL} />

                </GameProvider>
            </div>
        )
    }
}
export default Game