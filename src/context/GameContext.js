import React, { Component } from 'react'

const GameContext = React.createContext()

export default class GameProvider extends Component {
    state = {
        test: '123'
    }

    render() {
        return (
            <GameContext.Provider value={{
                test: this.state.test
            }}>
                { this.props.children }
            </GameContext.Provider>
        )
    }
}

export const GameConsumer = GameContext.Consumer
