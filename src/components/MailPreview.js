import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as languages from '../config/i18n'
import { postMail, goPage } from '../actions/popup';

class MailPreview extends Component {
  render() {
    const { dispatch } = this.props
    const { lang } = this.props.data.app.localStore;
    const { mail } = this.props.data.app
    return (
      <div >
        <div className="w3-container w3-padding-8 w3-dark-black w3-text-white">
          <div className="w3-row">
            <div className="w3-col w3-right" style={{width:25}}>
              <span onClick={() => { dispatch({ type: "APP_DATA", key: "mail", data: null }) }} 
                className="w3-hover-text-red w3-right" style={{cursor: 'pointer'}}>
                <i className="fa fa-window-close fa-fw" aria-hidden="true"></i></span>
            </div>
            <div className="w3-rest">
              <i className="fa fa-envelope-open-o fa-fw" aria-hidden="true"></i>&nbsp;
              <a className="w3-hover-text-red w3-small" href="#"
                title={languages[lang].openTitle} 
                onClick={() => { 
                  dispatch(goPage({page:'in_gmail',id:mail.message_id})) }}><b>{mail.title}</b></a>
            </div>
          </div>
        </div>
        <div className="w3-row w3-light-grey w3-border-bottom w3-padding-small">
          <div className="w3-col" style={{width:25}}>
            <button
              className="w3-btn-block simple-btn w3-light-grey w3-hover-text-yellow w3-padding-0" 
              title={languages[lang].starTitle}
              onClick={() => { dispatch(postMail("st",mail.message_id)) }}>
              <i className="fa fa-star fa-1x fa-fw" aria-hidden="true"></i>
            </button>
          </div>
          <div className="w3-col w3-right" style={{width:25}}>
            <button
              className="w3-btn-block simple-btn w3-light-grey w3-hover-text-red w3-padding-0" 
              title={languages[lang].trashTitle}
              onClick={() => { dispatch(postMail("tr",mail.message_id)) }}>
              <i className="fa fa-trash fa-1x fa-fw" aria-hidden="true"></i>
            </button>
          </div>
          <div className="w3-col w3-right" style={{width:25}}>
            <button
              className="w3-btn-block simple-btn w3-light-grey w3-hover-text-red w3-padding-0" 
              title={languages[lang].spamTitle}
              onClick={() => { dispatch(postMail("sp",mail.message_id)) }}>
              <i className="fa fa-warning fa-1x fa-fw" aria-hidden="true"></i>
            </button>
          </div>
          <div className="w3-col w3-right" style={{width:"auto"}}>
            <span>|</span>
          </div>
          <div className="w3-col w3-right" style={{width:25}}>
            <button
              className="w3-btn-block simple-btn w3-light-grey w3-hover-text-red w3-padding-0" 
              title={languages[lang].archTitle}
              onClick={() => { dispatch(postMail("arch",mail.message_id));
                dispatch(postMail("rd",mail.message_id)) }}>
              <i className="fa fa-archive fa-1x fa-fw" aria-hidden="true"></i>
            </button>
          </div>
          <div className="w3-col w3-right" style={{width:25}}>
            <button
              className="w3-btn-block simple-btn w3-light-grey w3-hover-text-red w3-padding-0" 
              title={languages[lang].readTitle}
              onClick={() => { dispatch(postMail("rd",mail.message_id)) }}>
              <i className="fa fa-check-square-o fa-1x fa-fw" aria-hidden="true"></i>
            </button>
          </div>
          <div className="w3-col w3-right" style={{width:"auto"}}>
            <span>|</span>
          </div>
          <div className="w3-col w3-right" style={{width:25}}>
            <button
              className="w3-btn-block simple-btn w3-light-grey w3-hover-text-red w3-padding-0" 
              title={languages[lang].replyTitle}
              onClick={() => { dispatch(goPage({
                page:'reply', email:mail.email, title:mail.title, reply:mail.reply})) }}>
              <i className="fa fa-reply fa-1x fa-fw" aria-hidden="true"></i>
            </button>
          </div>
          <div className="w3-col w3-right" style={{width:25}}>
            <button
              className="w3-btn-block simple-btn w3-light-grey w3-hover-text-red w3-padding-0" 
              title={languages[lang].printTitle}
              onClick={() => { dispatch(goPage({page:'print',id:mail.message_id})) }}>
              <i className="fa fa-print fa-1x fa-fw" aria-hidden="true"></i>
            </button>
          </div>
          <div className="w3-col w3-right" style={{width:"auto"}}>
            <span>|</span>
          </div>
          <div className="w3-col w3-right w3-small w3-padding-tiny" style={{width:"auto"}}>
            <span>{mail.issued}</span>
          </div>
          <div className="w3-rest">
            <label title={mail.email}>{mail.name}</label>
          </div>
        </div>
        <div className="mailPreview" dangerouslySetInnerHTML={{__html: mail.body}} />
      </div>
    )
  }
}

export default connect((state)=>{return {data: state}})(MailPreview);