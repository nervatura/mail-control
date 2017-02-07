import React, { Component } from 'react';
import { connect } from 'react-redux';
import marked from 'marked';

import { updateStorage, editLabel } from '../actions/background';
import { playSound } from '../actions/mails';

import * as languages from '../config/i18n'
import _license from '../../LICENSE.md'

class Options extends Component {
  render() {
    const { dispatch } = this.props
    const { lang, polling, plabel, pinterval, notify, sound, sofile, popui } = this.props.data.app.localStore;
    const { appConfig, version, optionPage, customLabel } = this.props.data.app;
    const labels = JSON.parse(this.props.data.app.localStore.labels)
    const license = atob(_license.split(",")[1])
    const setPolling = (checked) => {
      if(checked){
        dispatch(updateStorage("polling", "1"));
        window.chrome.runtime.sendMessage({action: "startRequest"});}
      else {
        dispatch(updateStorage("polling", "0"));
        window.chrome.runtime.sendMessage({action: "scheduleRequest"});}
    }
    const setPage = (pageName) => {
      dispatch({ type: "APP_DATA", key: "optionPage", data: pageName });
    }
    return (
      <div className="w3-modal w3-show">
        <div className="w3-modal-content w3-round" style={{maxWidth: 600}}>          
          <div className="w3-card-2 w3-round w3-white w3-text-dark-grey">
            <div className="w3-container w3-light-grey w3-padding-medium w3-round w3-center">
              <img className="w3-padding-0 w3-margin-0" src="img/micon_128.png"
                role="presentation" style={{verticalAlign: "middle", height:48}} />
              <label className="w3-xxlarge w3-text-blue-grey" 
                style={{verticalAlign: "middle", paddingLeft:10}}>Mail Control</label>
            </div>
            <div className="w3-content">
              <div className="w3-row w3-padding-medium">
                <div className="w3-col" style={{width:60}}>
                  <img src="img/16543932857_dc378dc9ba.png" role="presentation"
                    style={{height:100}} />
                </div>
                <div 
                  className="w3-rest w3-padding-medium w3-border w3-leftbar w3-round">
                  <span>{languages["en"].ninaHi}</span><br />
                  <span>{languages["en"].ninaCheck}</span>&nbsp;
                  <a className="w3-btn simple-btn w3-white w3-text-blue-grey w3-hover-text-red w3-padding-0" 
                    href={appConfig.video.url} target="_blank">
                    <i className="fa fa-youtube-play w3-text-red" aria-hidden="true"></i>
                    &nbsp;<b>{languages["en"].ninaMyVideo}</b></a>&nbsp;
                  <span>{languages["en"].ninaCheers}</span>
                </div>
              </div>

               <ul className="w3-navbar w3-light-grey w3-border">
                <li><a className={(optionPage === 'settings') ? 'w3-dark-grey' : ''}
                  href="#" onClick={(event) => { setPage("settings") }}>
                  <b>{languages[lang].settingsText}</b></a></li>
                <li><a className={(optionPage === 'info') ? 'w3-dark-grey' : ''}
                  href="#" onClick={(event) => { setPage("info") }}>
                  <b>{languages[lang].einfoText}</b></a></li>
                <li><a className={(optionPage === 'license') ? 'w3-dark-grey' : ''}
                  href="#" onClick={(event) => { setPage("license") }}>
                  <b>{languages[lang].licensesText}</b></a></li>
              </ul>

              <div className={(optionPage === 'settings') ? 'w3-show' : 'w3-hide'}>
                <div className="w3-row-padding w3-padding-small">
                  <div className="w3-col" style={{width:"auto", paddingTop:6}}>
                    <label>{languages[lang].localeText}:</label>
                  </div>
                  <div className="w3-col" style={{width:"auto"}}>
                    <select 
                      className="w3-select w3-border w3-round" value={lang}
                      onChange={(event) => {
                        dispatch(updateStorage("lang", event.target.value))}} >
                      {appConfig.languages.map((_lang, index) =>
                        <option key={index} value={_lang.value} >{_lang.name}</option>)}
                      </select>
                  </div>
                  <div className="w3-rest" style={{paddingTop:2}}>
                    <span><i>{languages[lang].localeInfo}</i></span>
                  </div>  
                </div>

                <div className="w3-row-padding w3-padding-small w3-border">
                  <div className="w3-half" style={{paddingTop:6}}>
                    <label className="switch-light switch-ios" 
                      style={{cursor: 'pointer'}}>
                      <input 
                        type="checkbox"
                        checked={polling===1 || polling==="1"}
                        onChange={(event) => {
                          setPolling(event.target.checked);}} /> 
                      <strong></strong>
                      <span>
                        <span>{languages[lang].pollingText}</span>
                        <span>{languages[lang].pollingText}</span>
                        <a></a>
                      </span>
                    </label>
                  </div>
                  <div className="w3-half" style={{paddingTop:2}}>
                    <span><i>{languages[lang].pollingInfo}</i></span>
                  </div>  
                </div>

                <div className="w3-row-padding w3-padding-small w3-border">
                  <div className="w3-col" style={{width:"auto", paddingTop:6}}>
                    <label>{languages[lang].plabelText}:</label>
                  </div>
                  <div className="w3-col" style={{width:"auto"}}>
                    <input type="text" value={plabel}
                      className="w3-input w3-border w3-round" 
                      onChange={(event) => 
                        dispatch(updateStorage("plabel", event.target.value))} />
                  </div>
                  <div className="w3-rest" style={{paddingTop:2}}>
                    <span><i>{languages[lang].plabelInfo}</i></span>
                  </div>  
                </div>

                <div className="w3-row-padding w3-padding-small w3-border">
                  <div className="w3-col" style={{width:"auto", paddingTop:6}}>
                    <label>{languages[lang].pintervalText}:</label>
                  </div>
                  <div className="w3-col" style={{width:"auto"}}>
                    <select 
                      className="w3-select w3-border w3-round" value={pinterval}
                      onChange={(event) => {
                        dispatch(updateStorage("pinterval", event.target.value))}} >
                        {appConfig.intervalList.map((_ival, index) =>
                          <option key={index} 
                            value={_ival.value} >{_ival.time+" "+languages[lang][_ival.label]}</option>)}
                      </select>
                  </div>
                  <div className="w3-rest" style={{paddingTop:2}}>
                    <span><i>{languages[lang].pintervalInfo}</i></span>
                  </div>  
                </div>

                <div className="w3-row-padding w3-padding-small w3-border">
                  <div className="w3-col" style={{width:"auto", paddingTop:6}}>
                    <label>{languages[lang].notifyText}:</label>
                  </div>
                  <div className="w3-col" style={{width:"auto"}}>
                    <select 
                      className="w3-select w3-border w3-round" value={notify}
                      onChange={(event) => {
                        dispatch(updateStorage("notify", event.target.value))}} >
                        {appConfig.notifyList.map((_notify, index) =>
                          <option key={index} 
                            value={_notify.value} >{_notify.time+" "+languages[lang][_notify.label]}</option>)}
                      </select>
                  </div>
                  <div className="w3-rest" style={{paddingTop:2}}>
                    <span><i>{languages[lang].notifyInfo}</i></span>
                  </div>  
                </div>

                <div className="w3-row-padding w3-padding-small w3-border">
                  <div className="w3-half" style={{paddingTop:6}}>
                    <label className="switch-light switch-ios" 
                      style={{cursor: 'pointer'}}>
                      <input 
                        type="checkbox"
                        checked={sound===1 || sound==="1"}
                        onChange={(event) => {
                          if(event.target.checked){
                            dispatch(updateStorage("sound", "1"))}
                          else {
                            dispatch(updateStorage("sound", "0"))}}} /> 
                      <strong></strong>
                      <span>
                        <span>{languages[lang].soundText}</span>
                        <span>{languages[lang].soundText}</span>
                        <a></a>
                      </span>
                    </label>
                  </div>
                  <div className="w3-col" style={{width:"auto", paddingTop:6}}>
                    <label>{languages[lang].sofileText}:</label>
                  </div>
                  <div className="w3-col" style={{width:"auto"}}>
                    <select style={{width:"auto"}}
                      className="w3-select w3-border w3-round" value={sofile}
                      onChange={(event) => {
                        dispatch(updateStorage("sofile", event.target.value))}} >
                      {appConfig.sofileList.map((_sofile, index) =>
                        <option key={index} value={_sofile.value} >{_sofile.name}</option>)}
                      </select>
                  </div>
                  <div className="w3-rest">
                    <button className="w3-border w3-light-grey w3-hover-text-green w3-round" 
                      style={{height:37, cursor: 'pointer' }}
                      onClick={() => { playSound("sounds/"+sofile+".ogg"); }}>
                      <i className={"fa fa-play fa-fw"} aria-hidden="true"></i><br/>
                    </button> 
                  </div>
                </div>

                <div className="w3-row-padding w3-padding-small w3-border">
                  <div className="w3-col" style={{width:"auto", paddingTop:6}}>
                    <label>{languages[lang].popUiText}:</label>
                  </div>
                  <div className="w3-col" style={{width:"auto"}}>
                    <select 
                      className="w3-select w3-border w3-round" value={popui}
                      onChange={(event) => {
                        dispatch(updateStorage("popui", event.target.value))}} >
                      {appConfig.uiList.map((_ui, index) =>
                        <option key={index} value={_ui.value} >{languages[lang][_ui.name]}</option>)}
                      </select>
                  </div>
                  <div className="w3-rest" style={{paddingTop:2}}>
                    <span><i>{languages[lang].popInfo}</i></span>
                  </div>  
                </div>

                <div className="w3-row-padding w3-padding-small">
                  <div className="w3-col w3-light-grey" 
                    style={{width:"auto", paddingTop:6, paddingBottom:6, marginTop:4}}>
                    <label>{languages[lang].gmailLabelsTitle}</label>
                  </div>
                  <div className="w3-col" style={{width:"auto"}}>
                    <input type="text" value={customLabel}
                      className="w3-input w3-border w3-round" 
                      onChange={(event) => 
                        dispatch({ type: "APP_DATA", key: "customLabel", data: event.target.value })} />
                  </div>
                  <div className="w3-rest" style={{paddingTop:2}}>
                    <button className="w3-border w3-light-grey w3-hover-text-green w3-round" 
                      style={{height:37, cursor: 'pointer' }}
                      onClick={() => { if(customLabel !== "") 
                        {dispatch(editLabel(customLabel, true))} }}>
                      <i className={"fa fa-plus fa-fw"} aria-hidden="true"></i><br/>
                    </button>
                  </div>  
                </div>
                <div className="w3-row" 
                  style={{fontSize: 11, paddingLeft:8, paddingRight:8, paddingBottom:8}} >
                  <div className="w3-col">
                    {Object.keys(labels).map(label =>{
                      if(label !== "custom") {
                        return (
                        <label key={label} 
                          className="switch-light switch-ios w3-left w3-padding-tiny" 
                          style={{minWidth:60, cursor: 'pointer'}}>
                          <input
                            type="checkbox"
                            checked={(labels[label].value===true)}
                            onChange={(event) => {
                              dispatch(editLabel(label, event.target.checked)) }} /> 
                          <strong>
                            {languages[lang][labels[label].title]}
                          </strong>
                          <span>
                            <span></span>
                            <span><i className={"fa fa-check fa-fw"} aria-hidden="true"></i></span>
                            <a></a>
                          </span>
                        </label>)}
                      else{
                        return null;}
                    })}
                    {labels.custom.map(clabel =>{
                      return (
                      <label key={clabel} 
                        className="switch-light switch-ios w3-left w3-padding-tiny" 
                        style={{minWidth:60, cursor: 'pointer'}}>
                        <input
                          type="checkbox"
                          checked={true}
                          onChange={(event) => {
                            dispatch(editLabel(clabel, false)) }} /> 
                        <strong>
                          {clabel}
                        </strong>
                        <span>
                          <span></span>
                          <span><i className={"fa fa-check fa-fw"} aria-hidden="true"></i></span>
                          <a></a>
                        </span>
                      </label>);
                    })}
                  </div>
                </div>
              </div>
              
              <div className={(optionPage === 'info') ? 'w3-show' : 'w3-hide'}>
                <div className="w3-row w3-padding-medium">
                  <div className="w3-col">
                    <span>{languages[lang].developerDesc}</span>
                  </div>
                </div>
                <div className="w3-row w3-padding-medium">
                  <div className="w3-col">
                    <label>{languages[lang].translations}</label>
                    <ul className="w3-margin-0" style={{paddingLeft:20}} >
                    {appConfig.languages.map((_lang, index) =>
                      <li key={index}>
                        <label>{appConfig.languages[index].name}:</label>
                        <span style={{paddingLeft:5}}>{appConfig.languages[index].note}</span>
                      </li>)}
                    </ul>
                  </div>
                </div>

                <div className="w3-row w3-padding-8 w3-light-grey">
                  <div className="w3-col w3-right" 
                    style={{width:'auto', paddingRight:16, paddingTop:8}}>
                    <div><label>{languages[lang].donateText}</label></div>
                    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                      <input type="hidden" name="cmd" value="_s-xclick" />
                      <input type="hidden" name="hosted_button_id" value="79GUS8N3AC9T8" />
                      <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" 
                        name="submit" alt="PayPal - The safer, easier way to pay online!" />
                      <img alt="" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" 
                        width="1" height="1" />
                    </form>
                  </div>
                  <div className="w3-rest">
                    <div className="w3-col" 
                      style={{width:'auto', paddingLeft:8, paddingRight:8}}>
                      <a href={appConfig.developer.url} title={appConfig.developer.name} 
                        style={{cursor: 'pointer'}}>
                        <img className="w3-padding-0 w3-margin-0" src="img/ntura_white.png"
                          alt={appConfig.developer.url}
                          style={{verticalAlign: "middle", height:96}} /></a>
                    </div>
                    <div className="w3-col" style={{width:'auto'}}>
                      <div>
                        <label>{languages[lang].vernumberText}:</label>
                        <span style={{paddingLeft:5}}>{version}</span>
                      </div>
                      <div>
                        <label>{languages[lang].moreinfoText}:</label>
                        <br />
                        <i className="fa fa-chrome" aria-hidden="true"></i>&nbsp;
                        <a href={appConfig.webstore.url} 
                          style={{cursor: 'pointer'}}>{appConfig.webstore.name}</a>
                        <br />
                        <i className="fa fa-github" aria-hidden="true"></i>&nbsp;
                        <a href={appConfig.github.url} style={{cursor: 'pointer'}}>
                            {appConfig.github.name}</a>
                        <br />
                        <i className="fa fa-envelope" aria-hidden="true"></i>&nbsp;
                        <a href={'mailto:'+appConfig.developer.email} 
                          title={appConfig.developer.email} 
                          style={{cursor: 'pointer'}}>{appConfig.developer.email}</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={(optionPage === 'license') ? 'w3-show' : 'w3-hide'}>
                <div className="markdown" 
                  dangerouslySetInnerHTML={{__html: marked(license)}} />
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect((state)=>{return {data: state}})(Options);