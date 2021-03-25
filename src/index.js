import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
//import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

//serviceWorker.unregister();
//serviceWorker.register();
console.log("Trying to register service worker");
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("../serviceWorker.js")
    .then(function(reg) {
      console.log("Registration succeeded", reg);
    })
    .catch(function(error) {
      console.log("Registration failed with ", error);
    });
}