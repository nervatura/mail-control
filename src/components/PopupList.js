import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as languages from '../config/i18n'
import { postMail, goPage } from '../actions/popup';
import { getAccData } from '../actions/background';

class PopupList extends Component {
  render() {
    const { dispatch, mails } = this.props
    const { lang, lastCheck } = this.props.data.app.localStore;
    if (mails.length > 0) {
      return (
        <div className="popupList" style={{maxHeight:220, padding:2}}>
          <ul className="w3-ul w3-hoverable" >
            {mails.map((msg, index) =>
              <li key={index} className="w3-padding-0" >
                <div className="w3-row w3-light-grey">
                  <div className="w3-col w3-right" style={{width:28}}>
                    <button
                      className="w3-btn-block simple-btn w3-light-grey w3-hover-text-red w3-padding-0" 
                      title={languages[lang].trashTitle}
                      onClick={() => { dispatch(postMail("tr",msg.message_id)) }}>
                      <i className="fa fa-trash fa-1x fa-fw" aria-hidden="true"></i>
                    </button>
                  </div>
                  <div className="w3-col w3-right" style={{width:28}}>
                    <button
                      className="w3-btn-block simple-btn w3-light-grey w3-hover-text-red w3-padding-0" 
                      title={languages[lang].spamTitle}
                      onClick={() => { dispatch(postMail("sp",msg.message_id)) }}>
                      <i className="fa fa-warning fa-1x fa-fw" aria-hidden="true"></i>
                    </button>
                  </div>
                  <div className="w3-col w3-right" style={{width:28}}>
                    <button
                      className="w3-btn-block simple-btn w3-light-grey w3-hover-text-red w3-padding-0" 
                      title={languages[lang].readTitle}
                      onClick={() => { dispatch(postMail("rd",msg.message_id)) }}>
                      <i className="fa fa-check-square-o fa-1x fa-fw" aria-hidden="true"></i>
                    </button>
                  </div>
                  <div className="w3-rest">
                    <button
                      className="w3-btn-block simple-btn w3-left-align w3-light-grey w3-hover-text-red w3-padding-0" 
                      title={languages[lang].openTitle}
                      onClick={() => { dispatch(goPage({page:'in_gmail',id:msg.message_id})) }}>
                      <i className="fa fa-envelope-open-o fa-1x fa-fw" aria-hidden="true"></i>
                      &nbsp;<b>{msg.name}</b>
                    </button>
                  </div>
                </div>
                <div className="w3-row">
                  <div className="w3-col w3-padding-small">
                    <a className="w3-hover-text-blue" href="#"
                      title={languages[lang].viewTitle+":"+String.fromCharCode(13)+String.fromCharCode(10)+msg.summary+" (...)"} 
                      onClick={() => { dispatch(getAccData({type:'mail',mail:msg})) }}>{msg.title}</a>
                  </div>  
                </div>
              </li>)}
          </ul>
        </div>
      )
    }
    else {
      return(
        <div className="w3-small w3-padding-small w3-light-grey w3-border" 
          style={{marginTop:1, marginLeft:1, marginRight:1, marginBottom:2}}>
          <div className="w3-padding-tiny w3-text-blue-grey" >
            <label>{languages[lang].noUnreadText}</label><br />
            <span>{lastCheck}</span>
          </div>
        </div>
      )
    }
  }
}

export default connect((state)=>{return {data: state}})(PopupList);