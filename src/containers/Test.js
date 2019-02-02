import React, { Component } from 'react';


class Test extends Component {


    render() {
        return (
            <div className="div-game">
                <BtnRdy />
                <BtnRdy />
            </div>
        )
    }
}

class BtnRdy extends Component {


    render() {
        return (
            // <button className={Number(this.props.match.params.userId) === this.props.nrPlayer ? 'btn-ready' : 'btn-ready btn-ready-noEffect'}
            //     style={{ color: userIsPresent.readyPlayer ? 'green' : 'tomato', borderColor: userIsPresent.readyPlayer ? 'green' : 'tomato' }}
            //     onClick={e => this.getReadyPlayers(userIsPresent.id, Number(this.props.match.params.userId) === this.props.nrPlayer)} >
            //     {userIsPresent.readyPlayer ? 'Ready!' : 'Get Ready?'}
            // </button>
            <>
                <button className="btn-ready"></button>

                <Timer />
            </>
        )
    }
}

class Timer extends Component {

    render() {
        return (
            <>
                <div className="timer">
                    TIME: <span> 30 </span>
                </div>

                <MechanismOfGame />
            </>
        )
    }

}

class MechanismOfGame extends Component {

    render() {
        return (
            <>
                <Player />
            </>
        )
    }
}

class Player extends Component {

    render() {
        return (
            <div className="half-field">
                <h3> - </h3>

                <div className="scores">
                    <p>SCORE: 0</p>
                </div>

                <div className="random-char"> ? </div>

                <div className="btns">
                    <button className='btn-game'> x </button>
                    <button className='btn-game'> x </button>
                    <button className='btn-game'> x </button>
                </div>

                <div className='player'>
                    <div className={`player-img1`}>  </div>
                </div>
            </div>
        )
    }

}


//---  *** REACT MAIN COMPONENT ***  ---//
// class Game1 extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             users: [],
//             pending: true,
//             game: false,
//             gameTime: 30,
//             disconnect: null,
//         };
//         this.endTime = null;
//         this.countdown = new Audio(countdown);
//         this.countdown.volume = .3;
//         this.closeBrowser = (ev) =>
//         {
//             window.removeEventListener('beforeunload', this.closeBrowser);
//             this.dropDataBase();
//         }
//     }

//     componentDidMount() {
//         induceTimerOnce = true;
//         showHideReadyBtns = true;

//         window.addEventListener('beforeunload', this.closeBrowser);

//         /**
//          * Add players to state from Firebase
//          * Redirect if database is empty */
//         firebase.database().ref('users').on('value', snap => {
//             const val = snap.val(); // console.log(val);
//             const usersTable = [];

//             if (!val) {
//                 this.props.history.push('/gamedisconnect');
//             }

//             for (var key in val) {
//                 usersTable.push({
//                     nickname: val[key].nickname,
//                     id: key,
//                     points: val[key].points,
//                     imgPlayer: val[key].imgPlayer,
//                     readyPlayer: val[key].readyPlayer,
//                     disconnectPlayer: val[key].disconnectPlayer,
//                     char: val[key].char,
//                 })
//             }
//             this.setState({
//                 users: usersTable,
//                 pending: false,
//             })

//         }, error => { console.log('Error in users: ' + error.code); })

//         /** Bool for checking connected 2 players */
//         firebase.database().ref('game').on('value', snap => {
//             const val = snap.val();

//             this.setState({
//                 disconnect: val.disconnect
//             })

//         }, error => { console.log('Error in game: ' + error.code); })
//     }

//     componentDidUpdate() {
//         if (this.state.disconnect) {
//             this.props.history.push('/gamedisconnect')
//         }
//     }

//     componentWillUnmount() {
//         clearInterval(this.endTime);
//         this.countdown.pause();
//         window.removeEventListener('beforeunload', this.closeBrowser);

//         // Don't delete online players on EndGame
//         if (this.state.gameTime !== 0) { this.dropDataBase() }
//     }

//     /** GAME START */
//     gameStart = (paramFromTimer) => {
//         this.setState({
//             game: paramFromTimer
//         })
//     }

//     /**
//      * Counter of game
//      * Redirection to GameOver */
//     gameTimer = () => {
//         this.endTime = setInterval( () => {

//             this.setState( (prevState) => {
//                 return { gameTime: prevState.gameTime - 1 }
//             })

//             if (this.state.gameTime === 4) {
//                 this.countdown.play();
//             }

//             if (this.state.gameTime === 0) {
//                 clearInterval(this.endTime);
//                 this.props.history.push('/gameover')
//             }
//         }, 1000 )
//     }


//     /** Delete all players and change bool in Firebase, after disconnect one */
//     dropDataBase = () => {
//         firebase.database().ref('game/').update({ disconnect: true })
//         firebase.database().ref('/users').remove();
//     }

//     //--- RENDER ---//
//     render() {
//         if (this.state.pending) {
//             return null;
//         }
//         let sendStyle = { color: '#548687' }

//         return (
//             <div>
//                 <div className="div-game">

//                     {/* PREPARE GAME & TIME & REDIRECTION */}
//                     <Timer { ...this.props } users={this.state.users} gameTime={this.state.gameTime} sendMethod={this.gameStart} sendMethodTimer={this.gameTimer} />

//                     {/* Waiting for players */}
//                     { this.state.users.length % 2 === 1 && waitingForPlayers }

//                     {/* ----------------------------------**PLAYER 1**---------------------------------- */}
//                     <div className="half-field">

//                         {/* Get ready */}
//                         { showHideReadyBtns && <GetReady users={this.state.users} { ...this.props } nrPlayer={0} /> }

//                         {/* Nick */}
//                         <Nick sendStyle={ Number(this.props.match.params.userId) === 0 ? sendStyle : null } users={this.state.users} nrPlayer={0} />

//                         {/* Score */}
//                         <Score sendStyle={ Number(this.props.match.params.userId) === 0 ? sendStyle : null } users={this.state.users} nrPlayer={0} />

//                         {/* Display random char */}
//                         <DisplayRandomChar game={this.state.game} nrPlayer={0} users={this.state.users} />

//                         {/* Game buttons - MECHANISM HERE */}
//                         { Number(this.props.match.params.userId) === 0
//                             ? <GameButtons game={this.state.game} { ...this.props } nrPlayer={0} users={this.state.users} />
//                             : gameButtonsDummy }

//                         {/* Avatar */}
//                         <DisplayAvatar users={this.state.users} nrPlayer={0} />

//                     </div>

//                     {/* ----------------------------------**PLAYER 2**---------------------------------- */}
//                     <div className="half-field">

//                         {/* Get ready */}
//                         { showHideReadyBtns && <GetReady users={this.state.users} { ...this.props } nrPlayer={1} /> }

//                         {/* Nick */}
//                         <Nick sendStyle={ Number(this.props.match.params.userId) === 1 ? sendStyle : null } users={this.state.users} nrPlayer={1}/>

//                         {/* Score */}
//                         <Score sendStyle={ Number(this.props.match.params.userId) === 1 ? sendStyle : null } users={this.state.users} nrPlayer={1} />

//                         {/* Display random char */}
//                         <DisplayRandomChar game={this.state.game} nrPlayer={1} users={this.state.users} />

//                         {/* Game buttons - MECHANISM HERE */}
//                         { Number(this.props.match.params.userId) === 1
//                             ? <GameButtons game={this.state.game} nrPlayer={1} users={this.state.users} />
//                             : gameButtonsDummy }

//                         {/* Avatar */}
//                         <DisplayAvatar users={this.state.users} nrPlayer={1} />

//                     </div>

//                 </div>
//             </div>
//         )
//     }
// }
export default Test;