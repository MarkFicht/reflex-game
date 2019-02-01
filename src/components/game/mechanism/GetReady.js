import React, { Component } from 'react';
import * as firebase from 'firebase';

/** Need {...this.props} from parent for active suitable btn */

class GetReady extends Component {

    /** GET READY */
    getReadyPlayers = (who, bool) => {
        if (bool) {
            firebase.database().ref('/users/' + who).update({
                readyPlayer: bool
            })
        }
    }

    render() {
        const nr = this.props.nrPlayer;
        let userIsPresent = this.props.users[nr];

        return (userIsPresent
            ? <button className={Number(this.props.match.params.userId) === this.props.nrPlayer ? 'btn-ready' : 'btn-ready btn-ready-noEffect'}
                style={{ color: userIsPresent.readyPlayer ? 'green' : 'tomato', borderColor: userIsPresent.readyPlayer ? 'green' : 'tomato' }}
                onClick={e => this.getReadyPlayers(userIsPresent.id, Number(this.props.match.params.userId) === this.props.nrPlayer)} >
                {userIsPresent.readyPlayer ? 'Ready!' : 'Get Ready?'}
            </button>
            : null
        );
    }
}

export default GetReady;