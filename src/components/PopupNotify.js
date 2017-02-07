import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getRequestInfo } from '../actions/popup';

import MailPreview from './MailPreview';
import PopupHeader from './PopupHeader';
import PopupList from './PopupList';
import PopupSearch from './PopupSearch';
import PopupLabels from './PopupLabels';
import SpinnerBox from './SpinnerBox';

class PopupNotify extends Component {
  render() {
    const { infoPage, request_sending, mail } = this.props.data.app;
    if(mail){
      return <MailPreview />;
    }
    else {
      const rqInfo = getRequestInfo();
      return (
        <div>
        <PopupHeader info={rqInfo.info} />
        {(() => {
          switch (infoPage) {
            case "labels":     
              return <PopupLabels />;
            case "search":     
              return <PopupSearch />;
            default:
              return <PopupList mails={rqInfo.mails} />;}
        })()}
        {(() => {
          if(request_sending){
            return <SpinnerBox />;}
        })()}
        </div>
      )
    }
  }
}

export default connect((state)=>{return {data: state}})(PopupNotify);