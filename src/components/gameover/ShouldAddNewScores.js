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

        const { winner, isDraw, playersFromGame } = this.props
        const { arrWithNewScores } = this.state

        /** CASE 1: Best scores are empty */
        if ( !val ) {
            this.setState({
                arrWithNewScores: [{ name: playersFromGame[0].nick, score: playersFromGame[0].points }, { name: playersFromGame[1].nick, score: playersFromGame[1].points }].sort((a, b) => { return b.score - a.score }),
                pendingForNewArr: false
            })
            console.log('Rekordy byly puste, dodanie 2 pierwszych', arrWithNewScores)

        /** CASE 2: Free space up to 10 */
        } else if ( val.length < 10 ) {
            this.setState({
                arrWithNewScores: [...val, { name: playersFromGame[0].nick, score: playersFromGame[0].points }, { name: playersFromGame[1].nick, score: playersFromGame[1].points }].sort((a, b) => { return b.score - a.score }).slice(0, 10),
                pendingForNewArr: false
            })
            console.log('Zapleninanie rekordow do 10', arrWithNewScores)

        } else {

            /** Is 10 best scores */
            if ( val[val.length - 1].score < winner.points ) {

                /** CASE 3: Winner and Looser scores were the best  */
                if ( !isDraw && (val[val.length - 1].score < playersFromGame[0].points) && (val[val.length - 1].score < playersFromGame[1].points) ) {

                    this.setState({
                        arrWithNewScores: [...val, { name: playersFromGame[0].nick, score: playersFromGame[0].points }, { name: playersFromGame[1].nick, score: playersFromGame[1].points }].sort((a, b) => { return b.score - a.score }).slice(0, 10),                        
                        pendingForNewArr: false
                    })
                    console.log('Dodano 2: winnera i loosera + posortowano', arrWithNewScores)

                /** CASE 4: Winner score was the best */
                } else if ( !isDraw ) {

                    this.setState({
                        arrWithNewScores: [...val, { name: winner.nick, score: winner.points }].sort((a, b) => { return b.score - a.score }).slice(0, 10),
                        pendingForNewArr: false
                    })
                    console.log('Dodano 1 winnera + posortowano', arrWithNewScores)

                /** CASE 5: Was draw, 2 results were the best */
                } else {

                    this.setState({
                        arrWithNewScores: [...val, { name: playersFromGame[0].nick, score: winner.points }, { name: playersFromGame[1].nick, score: winner.points }].sort((a, b) => { return b.score - a.score }).slice(0, 10),
                        pendingForNewArr: false
                    })
                    console.log('Dodano 2 przy remisie + posortowano', arrWithNewScores)
                }
            }
        }

        /** CASE 6: No change 'pendingForNewArr' */
        this._once = false
    }
    
    render() {
        if ( this.state.pending || this.props.isDraw ) return null

        return <div className='who-win'>YOU WIN!</div>
    }
}
export default ShouldAddNewScores