import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import * as firebase from 'firebase';


//--- from firebase.google.com - Initialize Firebase
var config = {
    apiKey: "AIzaSyCruoelLHKNisLfqpSXKRBbw3b7aLfoDYQ",
    authDomain: "gra-reflex.firebaseapp.com",
    databaseURL: "https://gra-reflex.firebaseio.com",
    projectId: "gra-reflex",
    storageBucket: "gra-reflex.appspot.com",
    messagingSenderId: "442302034181"
};
firebase.initializeApp(config);

//---
ReactDOM.render(<App />, document.getElementById('root'));

