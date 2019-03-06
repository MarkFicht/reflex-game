import React, { Component } from 'react';
import * as firebase from 'firebase';

class Winner extends Component {
    _isMounted = false;
    _once = true;

    state = {
        pending: true,
        pendingForNewArr: true,
        arrFromFB: [],
        arrWithNewScores: []
    };

    componentDidMount() {
        this._isMounted = true;
        const { simpleValid, winner, isDraw, playersFromGame } = this.props;
        // console.log(simpleValid, winner, isDraw, playersFromGame);

        if ( this._isMounted && (simpleValid === winner.validChars) ) {
            console.log('Wykonuje referencje do fb raz - w wybranym id')

            /**  */
            firebase.database().ref('/game/bestScores').on('value', snap => {

                console.log('polaczono z best scores', snap.val())
                const val = snap.val();

                if ( this._isMounted ) {

                    this.setState({
                        arrFromFB: val,
                        pending: false
                    })
                }
            })
        }
    }

    componentDidUpdate() {

        const { simpleValid, winner } = this.props;     // 'winner' in case draw === still exist!

        if ( simpleValid === winner.validChars ) {

            /**  */
            if ( !this.state.pending && this._isMounted ) {
                this.shouldAddToBestScores(this.state.arrFromFB);
            }

            if ( !this.state.pendingForNewArr && this._isMounted ) {

                return firebase.database().ref('/game').update({
                    bestScores: this.state.arrWithNewScores
                })
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    /**  */
    shouldAddToBestScores = ( val ) => {

        if ( !this._once ) { return null; }

        const { winner, isDraw, playersFromGame } = this.props;
        const { arrWithNewScores } = this.state;

        /** Case 1: Best scores are empty */
        if ( !val ) {

            this.setState({
                arrWithNewScores: [{ name: playersFromGame[0].nickname, score: playersFromGame[0].points }, { name: playersFromGame[1].nickname, score: playersFromGame[1].points }].sort((a, b) => { return b.score - a.score }),
                pendingForNewArr: false
            })
            console.log('Rekordy byly puste, dodanie 2 pierwszych', arrWithNewScores)

        /** Case 2: Free space up to 10 */
        } else if ( val.length < 10 ) {

            this.setState({
                arrWithNewScores: [...val, { name: playersFromGame[0].nickname, score: playersFromGame[0].points }, { name: playersFromGame[1].nickname, score: playersFromGame[1].points }].sort((a, b) => { return b.score - a.score }).slice(0, 10),
                pendingForNewArr: false
            })
            console.log('Zapleninanie rekordow do 10', arrWithNewScores)

        } else {

            console.log('Jest 10 rekordow + Sprawdzam czy jest sens dodawac rekordy', val[val.length - 1].score, winner.points)

            if ( val[val.length - 1].score < winner.points ) {

                /** Case 3: Winner and Looser scores were the best  */
                if ( !isDraw && (val[val.length - 1].score < playersFromGame[0].points) && (val[val.length - 1].score < playersFromGame[1].points) ) {

                    this.setState({
                        arrWithNewScores: [...val, { name: playersFromGame[0].nickname, score: playersFromGame[0].points }, { name: playersFromGame[1].nickname, score: playersFromGame[1].points }].sort((a, b) => { return b.score - a.score }).slice(0, 10),                        
                        pendingForNewArr: false
                    })
                    console.log('Dodano 2: winnera i loosera + posortowano', arrWithNewScores);

                /** Case 4: Winner score was the best */
                } else if ( !isDraw ) {

                    this.setState({
                        arrWithNewScores: [...val, { name: winner.nickname, score: winner.points }].sort((a, b) => { return b.score - a.score }).slice(0, 10),
                        pendingForNewArr: false
                    })
                    console.log('Dodano 1 winnera + posortowano', arrWithNewScores);

                /** Case 5: Was draw, 2 results were the best */
                } else {

                    this.setState({
                        arrWithNewScores: [...val, { name: playersFromGame[0].nickname, score: winner.points }, { name: playersFromGame[1].nickname, score: winner.points }].sort((a, b) => { return b.score - a.score }).slice(0, 10),
                        pendingForNewArr: false
                    })
                    console.log('Dodano 2 przy remisie + posortowano', arrWithNewScores);
                }
            }
        }

        /** Case 6:No changes === this.state.pendingForNewArr: true  */
        this._once = false;
    }

    
    render() {
        if ( this.state.pending || this.props.isDraw ) { return null; };

        /**  */
        return (
            <div className='who-win'>YOU WIN!</div>
        );
    };
};

export default Winner;