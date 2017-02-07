import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as languages from '../config/i18n'
import { goPage } from '../actions/popup';

class PopupIcon extends Component {
  render() {
    const { dispatch } = this.props
    const { lang } = this.props.data.app.localStore;
    return (
      <div className="w3-container w3-padding-0" style={{width:60}}>
        <div className="w3-row">
          <div className="w3-col">
            <button 
              className="w3-btn-block w3-white mail-blue w3-hover-text-blue-grey"
              style={{paddingTop:2, paddingBottom:4, paddingLeft:0, paddingRight:0}} 
              title={languages[lang].offlineTitle}
              onClick={() => { dispatch(goPage({page:'omail'})) }}>
              <i className="fa fa-envelope-o fa-3x fa-fw" aria-hidden="true"></i>
            </button>
          </div>
        </div>
        <div className="w3-row">
          <div className="w3-col" style={{width:"50%"}}>
            <button 
              className="w3-btn-block w3-light-grey mail-blue w3-hover-text-blue-grey" 
              style={{paddingTop:4, paddingBottom:0, paddingLeft:0, paddingRight:0}}
              title={languages[lang].composeOfflineTitle}
              onClick={() => { dispatch(goPage({page:'ocomp'})) }}>
              <i className="fa fa-edit fa-fw" aria-hidden="true"></i>
            </button>
          </div>
          <div className="w3-col" style={{width:"50%"}}>
            <button 
              className="w3-btn-block w3-light-grey mail-red w3-hover-text-blue-grey"
              style={{paddingTop:4, paddingBottom:0, paddingLeft:0, paddingRight:0}} 
              title={languages[lang].composeDesktopTitle}
              onClick={() => { dispatch(goPage({page:'gcomp'})) }}>
              <i className="fa fa-edit fa-fw" aria-hidden="true"></i>
            </button>
          </div>
        </div>
        <div className="w3-row">
          <div className="w3-col" style={{width:"50%"}}>
            <button 
              className="w3-btn-block w3-light-grey w3-text-dark-grey w3-hover-text-blue-grey"
              style={{paddingTop:0, paddingBottom:4, paddingLeft:0, paddingRight:0}} 
              title={languages[lang].lastNotificationTitle}
              onClick={() => { dispatch(goPage({page:'notify'})) }}>
              <i className="fa fa-bell-o fa-fw" aria-hidden="true"></i>
            </button>
          </div>
          <div className="w3-col" style={{width:"50%"}}>
            <button 
              className="w3-btn-block w3-light-grey w3-text-dark-grey w3-hover-text-blue-grey"
              style={{paddingTop:0, paddingBottom:4, paddingLeft:0, paddingRight:0}} 
              title={languages[lang].optionPageTitle}
              onClick={() => { dispatch(goPage({page:'options'})) }}>
              <i className="fa fa-cog fa-fw" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        <div className="w3-row">
          <div className="w3-col" style={{width:"50%"}}>
            <button 
              className="w3-btn-block w3-white mail-red w3-hover-text-blue-grey"
              style={{paddingTop:4, paddingBottom:4, paddingLeft:0, paddingRight:0}} 
              title={languages[lang].desktopTitle}
              onClick={() => { dispatch(goPage({page:'gmail'})) }}>
              <i className="fa fa-envelope-o fa-fw" aria-hidden="true"></i>
            </button>
          </div>
          <div className="w3-col" style={{width:"50%"}}>
            <button 
              className="w3-btn-block w3-white mail-blue w3-hover-text-blue-grey"
              style={{paddingTop:4, paddingBottom:4, paddingLeft:0, paddingRight:0}} 
              title={languages[lang].calendarTitle}
              onClick={() => { dispatch(goPage({page:'calendar'})) }}>
              <i className="fa fa-calendar fa-fw" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default connect((state)=>{return {data: state}})(PopupIcon);