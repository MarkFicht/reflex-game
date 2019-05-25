import React, { Component } from 'react'
import * as firebase from 'firebase'

import Timer from './Timer'
import { GameConsumer } from '../../context/GameContext'

import waitingForPlayers from '../../components/other/waitingForPlayers'


/** + component: "Waiting for all players" */
class BtnRdy extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            btnRdy: null,
            who: null,
            howManyOnline: 0,
            arrStatusPlayers: null,
            displayBtns: true
        }
    }

    componentDidMount() {
        this._isMounted = true;
        const [id] = this.props.idPlayer;

        if (this._isMounted) {

            firebase.database().ref('/users').on('value', snap => {
                const val = snap.val();

                let currentOnline = [];

                for (let key in val) {
                    currentOnline.push({
                        readyPlayer: val[key].readyPlayer,
                        who: key
                    })
                }

                this.setState({
                    btnRdy: id < currentOnline.length ? currentOnline[id].readyPlayer : null,
                    who: id < currentOnline.length ? currentOnline[id].who : null,
                    howManyOnline: currentOnline.length,
                    arrStatusPlayers: currentOnline
                })
            })
        }
    }

    componentDidUpdate() {
        const { howManyOnline, displayBtns, arrStatusPlayers } = this.state;

        if (howManyOnline === 2 && displayBtns && this._isMounted) {

            if (arrStatusPlayers[0].readyPlayer && arrStatusPlayers[1].readyPlayer) {
                this.setState({
                    displayBtns: false
                })
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getReadyPlayers = (who, bool, isMounted) => {

        if (!bool || !isMounted) { return null; }

        firebase.database().ref('/users/' + who).update({
            readyPlayer: !this.state.btnRdy
        })

        this.setState({
            btnRdy: !this.state.btnRdy
        })
    }

    render() {
        const [id, bool] = this.props.idPlayer;
        const { who, btnRdy, howManyOnline, displayBtns } = this.state;

        const btnRdyClass = `btn-ready${id + 1}`;
        const btnRdyWithEffect = bool ? `` : ` btn-ready-noEffect`;
        const btnRdySlowHide = displayBtns ? `` : ` btn-ready-opacity`;        // 2nd option for slow hide btns - conditional "id < howManyOnline"
        const btnCaption = btnRdy ? 'OK' : 'Ready?';
        const btnColor = btnRdy ? 'limegreen' : 'tomato';
        const style = {
            color: btnColor,
            borderColor: btnColor
        };

        return (
            <GameConsumer>
                {({ players }) => (
                    <>
                        {/* Waiting for players */}
                        {howManyOnline % 2 === 1 && waitingForPlayers}
                        <div>{ players[0] ? players[0].nick : 'nie ma'}</div>
                        {/* { id < howManyOnline && displayBtns */}
                        {id < howManyOnline
                            ? <button className={btnRdyClass + btnRdyWithEffect + btnRdySlowHide} style={style} onClick={e => this.getReadyPlayers(who, bool, this._isMounted)}>{btnCaption}</button>
                            : null
                        }

                        <Timer howManyOnline={howManyOnline} displayBtns={displayBtns} idPlayer={this.props.idPlayer} />
                    </>
                )}
            </GameConsumer>
        )
    }
}

export default BtnRdy;