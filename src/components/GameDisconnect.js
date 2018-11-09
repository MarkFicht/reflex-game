import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import logo from './static/logo';

//---  *** REACT MAIN COMPONENT ***  ---//
class GameDisconnect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectTime: 3,
        }
        this.redirectInterval = null;
    };

    componentDidMount() {
        this.redirectInterval = setInterval( () => {
            this.setState({
                redirectTime: this.state.redirectTime - 1
            })
        }, 1000 )
    }

    componentWillUnmount() {
        clearTimeout(this.redirectInterval);
    }

    //--- RENDER ---//
    render() {
        return (
            <div className='disconnected'>
                { logo }
                <p> Jeden z graczy wyszedl lub zostal rozlaczony. </p>
                <p> Gra zostala przerwana. </p>
                <h3>{ `Przekierowanie za: ${this.state.redirectTime}` }</h3>
                { this.state.redirectTime < 0 && <Redirect to='/' />}
            </div>
        );
    }
}
export default GameDisconnect;