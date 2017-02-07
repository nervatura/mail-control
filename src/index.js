import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import 'css-toggle-switch/dist/toggle-switch.css';
import './config/app.css';

import { store } from './store'
import { initBackground } from './actions/background';
import Options from './components/Options';
import Popup from './components/Popup';

let Ui;
const wintype = window.location.href.split("?")[1]
store.dispatch({ type: "APP_DATA", key: "wintype", data: wintype });
switch (wintype) {
  case "background":
    store.dispatch(initBackground());
    break;
  case "popup":
    Ui = Popup;
    break;
  case "options":
    Ui = Options;
    break;
  default:
    break;}
if (Ui){
  ReactDOM.render(
    <Provider store={store}>
      <Ui />
    </Provider>,
    document.getElementById('root'));}


