import React, { Component } from 'react';
import { connect } from 'react-redux';

import PopupIcon from './PopupIcon';
import PopupNotify from './PopupNotify';

class Popup extends Component {
  render() {
    const { localStore } = this.props.data.app;
    if(localStore.popui === "1"){
      return <PopupIcon />;}
    else {
      return <PopupNotify />;}
  }
}

export default connect((state)=>{return {data: state}})(Popup);
