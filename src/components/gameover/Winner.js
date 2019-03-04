import React, { Component } from 'react';
import * as firebase from 'firebase';

class Winner extends Component {
    _isMounted = false;
    _once = true;

    state = {
        pending: true,
        arrFromFB: [],
        arr: []
    };

    componentDidMount() {
        this._isMounted = true;
        const { simpleValid, winner, isDraw, playersFromGame } = this.props;
        const { arr } = this.state;
        console.log(simpleValid, winner, isDraw, playersFromGame, arr);

        if ( this._isMounted && (simpleValid === winner.validChars) ) {
            console.log('Wykonuje referencje do fb raz.')

            /**  */
            firebase.database().ref('/game/bestScores').on('value', snap => {

                console.log('polaczono z best scores', snap.val())
                const val = snap.val();
                // let arr = [];

                if ( this._isMounted ) {
                    this.setState({
                        arrFromFB: val,
                        pending: false
                    })
                }

                
                // if ( !val ) {

                //     this.setState({
                //         arr: [{ name: playersFromGame[0].nickname, score: playersFromGame[0].points }, { name: playersFromGame[1].nickname, score: playersFromGame[1].points }].sort((a, b) => { return b.score - a.score }),
                //         pending: false
                //     })

                //     // arr = [{ name: playersFromGame[0].nickname, score: playersFromGame[0].points }, { name: playersFromGame[1].nickname, score: playersFromGame[1].points }].sort((a, b) => { return b.score - a.score });

                //     console.log('Rekordy byly puste, dodanie 2 pierwszych', arr)

                //     // if ( this._isMounted ) {
                //     //     return firebase.database().ref('/game').update({
                //     //         bestScores: arr
                //     //     })
                //     // }
                    
                // } else if ( val.length < 10 ) {

                //     this.setState({
                //         arr: [ ...val, { name: winner.nickname, score: winner.points } ].sort( (a, b) => { return b.score - a.score } ).slice(0, 10),
                //         pending: false
                //     })

                //     //  arr = [ ...val, { name: winner.nickname, score: winner.points } ].sort( (a, b) => { return b.score - a.score } ).slice(0, 10);

                //     console.log('Zapleninanie rekordow do 10', arr)

                //     // if ( this._isMounted ) {
                //     //     return firebase.database().ref('/game').update({
                //     //         bestScores: arr
                //     //     })
                //     // }

                // } else {
                    
                //     console.log( 'wykonuje elsa, val z 10 rekordami istnial', val[ val.length - 1 ].score, winner.points )
                //     if ( val[ val.length - 1 ].score < winner.points ) {
                //         console.log('Dodaje rekord + tu podejmuje decyzje czy byl 1 winner czy draw');

                //         if ( !isDraw ) {

                //             this.setState({
                //                 arr: [ ...val, { name: winner.nickname, score: winner.points } ].sort( (a, b) => { return b.score - a.score } ).slice(0, 10),
                //                 pending: false
                //             })
                            
                //             // arr = [ ...val, { name: winner.nickname, score: winner.points } ].sort( (a, b) => { return b.score - a.score } ).slice(0, 10);
                //             console.log('Dodano 1 winnera i posortowano', arr);

                //             // if ( this._isMounted ) {
                //             //     return firebase.database().ref('/game').update({
                //             //         bestScores: arr
                //             //     })
                //             // }
                //         } else {

                //             this.setState({
                //                 arr: [ ...val, { name: playersFromGame[0].nickname, score: winner.points }, { name: playersFromGame[1].nickname, score: winner.points } ].sort( (a, b) => { return b.score - a.score } ).slice(0, 10),
                //                 pending: false
                //             })
                //             // arr = [ ...val, { name: playersFromGame[0].nickname, score: winner.points }, { name: playersFromGame[1].nickname, score: winner.points } ].sort( (a, b) => { return b.score - a.score } ).slice(0, 10);
                //             console.log('Dodano 2 i posortowano', arr);

                //             // if ( this._isMounted ) {
                //             //     return firebase.database().ref('/game').update({
                //             //         bestScores: arr
                //             //     })
                //             // }
                //         }
                //     }
                // }

                console.log(arr)

                // if ( this._isMounted ) {
                //     return firebase.database().ref('/game').update({
                //         bestScores: arr
                //     })
                // }
            })

            /**  */
            // if ( this._isMounted ) {
            //     return firebase.database().ref('/game').update({
            //         bestScores: this.state.arr
            //     })
            // }

        }
    }

    componentDidUpdate() {

        /**  */
        if (!this.state.pending) {
            this.shouldAddToBestScores( this.state.arrFromFB );
        }

        if ( this._isMounted ) {
            return firebase.database().ref('/game').update({
                bestScores: this.state.arr
            })
        }
    }

    shouldAddToBestScores = ( val ) => {

        if ( !this._once ) { return null; }

        const { simpleValid, winner, isDraw, playersFromGame } = this.props;
        const { arr } = this.state;

        if (!val) {

            this.setState({
                arr: [{ name: playersFromGame[0].nickname, score: playersFromGame[0].points }, { name: playersFromGame[1].nickname, score: playersFromGame[1].points }].sort((a, b) => { return b.score - a.score }),
                pending: false
            })

            // arr = [{ name: playersFromGame[0].nickname, score: playersFromGame[0].points }, { name: playersFromGame[1].nickname, score: playersFromGame[1].points }].sort((a, b) => { return b.score - a.score });

            console.log('Rekordy byly puste, dodanie 2 pierwszych', arr)

            // if ( this._isMounted ) {
            //     return firebase.database().ref('/game').update({
            //         bestScores: arr
            //     })
            // }

        } else if (val.length < 10) {

            this.setState({
                arr: [...val, { name: winner.nickname, score: winner.points }].sort((a, b) => { return b.score - a.score }).slice(0, 10),
                pending: false
            })

            //  arr = [ ...val, { name: winner.nickname, score: winner.points } ].sort( (a, b) => { return b.score - a.score } ).slice(0, 10);

            console.log('Zapleninanie rekordow do 10', arr)

            // if ( this._isMounted ) {
            //     return firebase.database().ref('/game').update({
            //         bestScores: arr
            //     })
            // }

        } else {

            console.log('wykonuje elsa, val z 10 rekordami istnial', val[val.length - 1].score, winner.points)
            if (val[val.length - 1].score < winner.points) {
                console.log('Dodaje rekord + tu podejmuje decyzje czy byl 1 winner czy draw');

                if (!isDraw) {

                    this.setState({
                        arr: [...val, { name: winner.nickname, score: winner.points }].sort((a, b) => { return b.score - a.score }).slice(0, 10),
                        pending: false
                    })

                    // arr = [ ...val, { name: winner.nickname, score: winner.points } ].sort( (a, b) => { return b.score - a.score } ).slice(0, 10);
                    console.log('Dodano 1 winnera i posortowano', arr);

                    // if ( this._isMounted ) {
                    //     return firebase.database().ref('/game').update({
                    //         bestScores: arr
                    //     })
                    // }
                } else {

                    this.setState({
                        arr: [...val, { name: playersFromGame[0].nickname, score: winner.points }, { name: playersFromGame[1].nickname, score: winner.points }].sort((a, b) => { return b.score - a.score }).slice(0, 10),
                        pending: false
                    })
                    // arr = [ ...val, { name: playersFromGame[0].nickname, score: winner.points }, { name: playersFromGame[1].nickname, score: winner.points } ].sort( (a, b) => { return b.score - a.score } ).slice(0, 10);
                    console.log('Dodano 2 i posortowano', arr);

                    // if ( this._isMounted ) {
                    //     return firebase.database().ref('/game').update({
                    //         bestScores: arr
                    //     })
                    // }
                }
            }
        }

        this._once = false;
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