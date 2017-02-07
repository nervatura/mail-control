import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as languages from '../config/i18n'
import { goPage } from '../actions/popup';

class PopupLabels extends Component {
  render() {
    const { dispatch } = this.props
    const { lang, online } = this.props.data.app.localStore;
    const labels = JSON.parse(this.props.data.app.localStore.labels)
    const label_color = (online === "1") ? "red" : "blue"
    return (
      <div className="w3-row w3-small w3-padding-0 w3-light-grey" style={{margin:1}}>
        {Object.keys(labels).map(label =>{
          if(label !== "custom") {
            if(labels[label].value === true){
              return(
              <div className="w3-col w3-border" 
                style={{width:"33.3%", padding:2}}>
                <button
                  className={"w3-btn-block w3-left-align simple-btn w3-text-blue-grey w3-light-grey w3-hover-text-"+label_color+" w3-padding-0"} 
                  title={languages[lang].labelOpenTitle+": "+languages[lang][labels[label].title]}
                  onClick={() => { 
                    dispatch(goPage({page:"label", label:label, type:"label", olabel:labels[label].olabel})) }}>
                  <i className={"fa fa-"+labels[label].icon+" fa-1x fa-fw"} aria-hidden="true"></i>
                  {languages[lang][labels[label].title]}
                </button>
              </div>)}}
          else {
            return null;}
        })}
        {labels.custom.map(clabel =>{
          return(
          <div className="w3-col w3-border" 
            style={{width:"50%", padding:2}}>
            <button
              className={"w3-btn-block w3-left-align simple-btn w3-text-blue-grey w3-light-grey w3-hover-text-"+label_color+" w3-padding-0"} 
              title={languages[lang].labelOpenTitle+": "+clabel}
              onClick={() => { 
                dispatch(goPage({page:"label", label:clabel, type:"custom"})) }}>
              <i className="fa fa-tag fa-1x fa-fw" aria-hidden="true"></i>
              {clabel}
            </button>
          </div>)
        })}
      </div>
    )
  }
}

export default connect((state)=>{return {data: state}})(PopupLabels);