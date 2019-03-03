import React, { Component } from 'react';

class Winner extends Component {
    _isMounted = false;

    state = {
        pending: true
    };

    componentDidMount() {
        this._isMounted = true;

        if ( this._isMounted ) {

        }
    }
    
    componentWillUnmount() {
        this._isMounted = false;
    }

    
    render() {
        if ( this.state.pending ) { return null; };

        /**  */
        return (
            <div className='game-winner'>
                
            </div>
        );
    };
};

export default Winner;