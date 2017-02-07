import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as languages from '../config/i18n'
import { goPage } from '../actions/popup';

class PopupSearch extends Component {
  render() {
    const { dispatch } = this.props
    const { localStore, filter } = this.props.data.app;
    return (
      <div className="w3-small w3-padding-small w3-light-grey w3-border" style={{margin:1}}>
        <div className="w3-padding-tiny w3-text-blue-grey" >
          <label>{languages[localStore.lang].searchText}</label>
        </div>
        <input autoFocus type="text" value={ filter }
          className="w3-input w3-border w3-round" 
          onChange={(event) => { 
            dispatch({ type: "APP_DATA", key: "filter", data: event.target.value }) }}
          onKeyUp={(event) => {
            if(event.which === 13){ dispatch(goPage({page:"search"})) }}} />
      </div>
    )
  }
}

export default connect((state)=>{return {data: state}})(PopupSearch);