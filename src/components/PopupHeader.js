import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as languages from '../config/i18n'
import { goPage, startRequest, sendPage } from '../actions/popup';
import { updateStorage } from '../actions/background';

class PopupHeader extends Component {
  render() {
    const { dispatch, info } = this.props
    const { lang, online } = this.props.data.app.localStore;

    const start_color = (online === "1") ? "mail-red" : "mail-blue"
    const back_color = (online === "0") ? "mail-red" : "mail-blue"
    return (
      <div className="w3-container w3-padding-0" style={{width:360}}>
        <table width="100%" cellSpacing="0">
          <tbody>
            <tr>
              <td style={{width:48}} rowSpan="2">
                <button style={{height:"100%"}}
                  className={"w3-btn-block simple-btn w3-light-grey w3-border "+start_color+" w3-hover-text-blue-grey w3-padding-0"} 
                  title={languages[lang][(online === "1") ? "desktopTitle" : "offlineTitle"]}
                  onClick={() => { 
                    if(online === "1"){
                      dispatch(goPage({page:"gmail"}))}
                    else{
                      dispatch(goPage({page:"omail"}))} }}>
                  <i className="fa fa-envelope-o fa-2x fa-fw" aria-hidden="true"></i>
                </button>
              </td>
              <td style={{width:28}}>
                <button
                className={"w3-btn-block simple-btn w3-light-grey w3-border "+start_color+" w3-hover-text-blue-grey w3-padding-0"} 
                title={languages[lang][(online === "1") ? "composeDesktopTitle" : "composeOfflineTitle"]}
                onClick={() => { 
                    if(online === "1"){
                      dispatch(goPage({page:"gcomp"}))}
                    else{
                      dispatch(goPage({page:"ocomp"}))} }}>
                <i className="fa fa-edit fa-1x fa-fw" aria-hidden="true"></i>
              </button>
              </td>
              <td colSpan="2">
                <button
                className={"w3-btn-block simple-btn w3-border w3-dark-grey w3-hover-text-blue-grey w3-hover-light-grey w3-padding-0"} 
                title={languages[lang].optionsTitle}
                onClick={() => { dispatch(goPage({page:"options"})) }}>
                <b>{languages[lang].title}</b>
              </button>
              </td>
              <td style={{width:28}}>
                <button
                className={"w3-btn-block simple-btn w3-light-grey w3-border "+back_color+" w3-hover-text-blue-grey w3-padding-0"} 
                title={languages[lang].changeStateTitle}
                onClick={() => { 
                  dispatch(updateStorage("online", (online === "1") ? "0" : "1"));}}>
                <i className="fa fa-envelope-o fa-1x fa-fw" aria-hidden="true"></i>
              </button>
              </td>
              <td style={{width:28}}>
                <button
                className={"w3-btn-block simple-btn w3-light-grey w3-border mail-blue w3-hover-text-blue-grey w3-padding-0"} 
                title={languages[lang].calendarTitle}
                onClick={() => { dispatch(goPage({page:'calendar'})) }}>
                <i className="fa fa-calendar fa-1x fa-fw" aria-hidden="true"></i>
              </button>
              </td>
            </tr>
            <tr>
              <td>
              <button
                className={"w3-btn-block simple-btn w3-light-grey w3-border mail-red w3-hover-text-blue-grey w3-padding-0"} 
                title={languages[lang].sendPageTitle}
                onClick={() => { dispatch(sendPage()); }}>
                <i className="fa fa-share-square fa-1x fa-fw" aria-hidden="true"></i>
              </button>
              </td>
              {(() => {
                if (info.value > 0) {
                  return ([
                  <td>
                    <button
                      className={"w3-btn-block simple-btn w3-border w3-white w3-text-blue-grey w3-hover-text-dark-grey w3-hover-light-grey w3-left-align w3-small w3-padding-tiny"} 
                      title={languages[lang].showUnreadMsgTitle}
                      onClick={() => { dispatch(goPage({page:"unread_all"})) }}>
                      {languages[lang].unreadText+": "+info.label}
                    </button>
                  </td>,
                  <td style={{width:28}}>
                    <button
                      className={"w3-btn-block simple-btn w3-light-grey w3-border w3-hover-text-blue-grey w3-padding-0"} 
                      title={languages[lang].refreshTitle}
                      onClick={() => { dispatch(startRequest()); }}>
                      <i className="fa fa-refresh fa-1x fa-fw" aria-hidden="true"></i>
                    </button>
                  </td>])
                }
                else {
                  return (
                    <td colSpan="2">
                      <button
                        className={"w3-btn-block simple-btn w3-border w3-white w3-text-blue-grey w3-hover-text-dark-grey w3-hover-light-grey w3-left-align w3-small w3-padding-tiny"} 
                        title={languages[lang].refreshTitle}
                        onClick={() => { dispatch(startRequest()); }}>
                        {languages[lang].refreshTitle}
                      </button>
                    </td>)
                }
              })()}
              <td>
              <button
                className={"w3-btn-block simple-btn w3-light-grey w3-border "+start_color+" w3-hover-text-blue-grey w3-padding-0"} 
                title={languages[lang].labelsTitle}
                onClick={() => { dispatch({ type: "APP_DATA", key: "infoPage", data: "labels" }) }}>
                <i className="fa fa-tags fa-1x fa-fw" aria-hidden="true"></i>
              </button>
              </td>
              <td>
              <button
                className={"w3-btn-block simple-btn w3-light-grey w3-border "+start_color+" w3-hover-text-blue-grey w3-padding-0"} 
                title={languages[lang].searchTitle}
                onClick={() => { dispatch({ type: "APP_DATA", key: "infoPage", data: "search" }) }}>
                <i className="fa fa-search fa-1x fa-fw" aria-hidden="true"></i>
              </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default connect((state)=>{return {data: state}})(PopupHeader);