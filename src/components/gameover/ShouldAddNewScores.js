import React, { Component } from 'react'
import * as firebase from 'firebase'

class ShouldAddNewScores extends Component {
    _isMounted = false
    _once = true

    state = {
        pending: true,
        pendingForNewArr: true,
        arrFromFB: [],
        arrWithNewScores: []
    }

    /** Change 'pending' of FALSE only for one player
     * Get data with best scores 
     * */
    componentDidMount = () => {
        this._isMounted = true
        const { simpleValid, winner } = this.props

        if ( this._isMounted && (simpleValid === winner.validChars) ) {

            firebase.database().ref('/game/bestScores').on('value', snap => {
                const val = snap.val()

                if ( this._isMounted ) {
                    this.setState({ arrFromFB: val, pending: false })
                }
            })
        }
    }

    componentDidUpdate = () => {
        /** 'winner' in CASE draw = still exist! */
        const { simpleValid, winner } = this.props

        if ( simpleValid === winner.validChars && this._isMounted ) {

            if ( !this.state.pending ) { this.shouldAddToBestScores(this.state.arrFromFB) }

            if ( !this.state.pendingForNewArr ) { firebase.database().ref('/game').update({ bestScores: this.state.arrWithNewScores }) }
        }
    }

    componentWillUnmount = () => this._isMounted = false

    /** Change 'pendingForNewArr' of FALSE when add new score/s
     * Mechanism of best scores 
     * */
    shouldAddToBestScores = ( val ) => {
        if ( !this._once ) return null

        const { playersFromGame } = this.props
        const p1 = { name: playersFromGame[0].nick, score: playersFromGame[0].points }
        const p2 = { name: playersFromGame[1].nick, score: playersFromGame[1].points }

        if ( !val ) {
            this.setState({
                arrWithNewScores: [p1, p2].sort((a, b) => { return b.score - a.score }),
                pendingForNewArr: false
            })
            
        } else if ( val.length <= 10 ) {
            this.setState({
                arrWithNewScores: [...val, p1, p2].sort((a, b) => { return b.score - a.score }).slice(0, 10),
                pendingForNewArr: false
            })
        }
        this._once = false
    }
    
    render() {
        if ( this.state.pending || this.props.isDraw ) return null

        return <div className='who-win'>YOU WIN!</div>
    }
}
export default ShouldAddNewScores