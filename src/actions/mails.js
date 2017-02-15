import * as languages from '../config/i18n'

const updateIcon = () => {
  return (dispatch, getState) => {
    const { request_sending, appConfig, unreadCount } = getState().app;
    try {
      if (request_sending === true) {
        window.chrome.browserAction.setIcon({path: appConfig.loginImg});
        window.chrome.browserAction.setBadgeBackgroundColor({color:"green"});
        window.chrome.browserAction.setBadgeText({text:"?"});}
      else if (unreadCount.value === null) {
        window.chrome.browserAction.setIcon({path: appConfig.logoutImg});
        window.chrome.browserAction.setBadgeBackgroundColor({color:"black"});
        window.chrome.browserAction.setBadgeText({text:"!"});} 
      else {
        window.chrome.browserAction.setIcon({path: appConfig.loginImg});
        window.chrome.browserAction.setBadgeBackgroundColor({color:[208, 0, 24, 255]});
        window.chrome.browserAction.setBadgeText({text: unreadCount.label });}
    } catch(e) {}
  }
}

const getFieldValue = (xmlText, fldName, startIndex) => {
	let retValue = {};
	let _startIndex = xmlText.indexOf('<' + fldName + '>', startIndex);
	let startIndex_ = xmlText.indexOf('<' + fldName + '/>', startIndex);
	if (_startIndex === -1 && fldName !== "title") {
		retValue.value = "";
		retValue.index = startIndex;
		return retValue;}
	if (startIndex_ === -1 || startIndex_ > _startIndex) {
		if (_startIndex !== -1) {
			retValue.value = xmlText.substring(_startIndex
					+ ('<' + fldName + '>').length, xmlText.indexOf('</'
							+ fldName + '>', _startIndex));
			retValue.index = xmlText.indexOf('</' + fldName + '>', _startIndex)
			+ ('</' + fldName + '>').length;
		} else {
			retValue.value = "";
			retValue.index = -1;}
	} else {
		retValue.value = "";
		retValue.index = startIndex_ + ('<' + fldName + '/>').length;	}
	return retValue;
}

const setMails = (xmlText) => {
  return (dispatch, getState) => {
    const { lang } = getState().app.localStore;
    let fieldValue;
    let mails = [];
    
    fieldValue = getFieldValue(xmlText, "title", 0);
    while (fieldValue.index>-1) {
      let msg = {};
      msg.title = fieldValue.value;
      if (msg.title.indexOf('Gmail -')>-1) {
        fieldValue = getFieldValue(xmlText, "title", fieldValue.index);
        continue;}
      fieldValue = getFieldValue(xmlText, "summary", fieldValue.index);
      msg.summary = fieldValue.value;
      if (msg.title === "") {
        if (msg.summary !== ""){
          msg.title = "<i>"+msg.summary+"</i>";
        } else {
          msg.title = languages[lang].noSubjectText;}}
      let startIndex = xmlText.indexOf('message_id=',fieldValue.index);
      msg.message_id = xmlText.substring(startIndex+11,xmlText.indexOf('&amp;view=conv',startIndex));
      
      fieldValue = getFieldValue(xmlText, "issued", fieldValue.index);
      msg.issued = fieldValue.value.replace("T", " ").substring(0, 16); 
      
      fieldValue = getFieldValue(xmlText, "name", fieldValue.index);
      msg.name = fieldValue.value;
      fieldValue = getFieldValue(xmlText, "email", fieldValue.index);
      msg.email = fieldValue.value;
      mails.push(msg);

      fieldValue = getFieldValue(xmlText, "title", fieldValue.index);
      //fieldValue.index = -1;
    }
    dispatch({ type: "APP_DATA", key: "mails", data: mails });
  }
}

const getFeedUrl = (plabel, mailUrl, instanceId) => {
  if (plabel !== "")
    return mailUrl + "feed/atom/"+plabel+"?zx=" + encodeURIComponent(instanceId );
  else
    return mailUrl + "feed/atom?zx=" + encodeURIComponent(instanceId );
}

const getInboxCount = (onSuccess, onError, url) => {
  const gmailNSResolver = (prefix)=> {
    if(prefix === 'gmail') {
      return 'http://purl.org/atom/ns#';}}
  return (dispatch, getState) => {
    let { appConfig, requestFailureCount } = getState().app;
    const { plabel, instanceId } = getState().app.localStore;
    let xhr = new XMLHttpRequest();
    let abortTimerId = window.setTimeout(
      () => {xhr.abort();}, appConfig.requestTimeout);

    const handleSuccess = (count) => {
      dispatch({ type: "APP_DATA", key: "requestFailureCount", data: 0 });
      window.clearTimeout(abortTimerId);
      if (onSuccess)
        onSuccess(count);}

    let invokedErrorCallback = false;
    const handleError = () => {
      dispatch({ type: "APP_DATA", key: "requestFailureCount", data: ++requestFailureCount });
      window.clearTimeout(abortTimerId);
      if (onError && !invokedErrorCallback)
        onError();
      invokedErrorCallback = true;}

    try {
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4)
          return;
        
        dispatch({ type: "APP_DATA", key: "request_sending", data: false });
        if (xhr.responseXML) {
          let xmlDoc = xhr.responseXML;
          let entryCount = parseInt(xmlDoc.evaluate("/gmail:feed/gmail:entry",
            xmlDoc, gmailNSResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength,10);
          entryCount = isNaN(entryCount) ? 0 : entryCount
          let fullCount = parseInt(xmlDoc.evaluate("/gmail:feed/gmail:fullcount", 
            xmlDoc, gmailNSResolver, XPathResult.ANY_TYPE, null).iterateNext().textContent,10);
          fullCount = isNaN(fullCount) ? 0 : fullCount
          dispatch(setMails(xhr.responseText));
          let result = {value:fullCount, from:"full", label:fullCount.toString()}
          if (fullCount === 0) {
            result = {value:fullCount, from:"full", label:fullCount.toString()}
            if (entryCount >= appConfig.maxLine) {
              result.label = ">"+appConfig.maxLine.toString();}}
          //else {
          //  if (fullCount > appConfig.maxCount) {
          //    result.label = ">"+appConfig.maxCount.toString();}}
          handleSuccess(result);
          return;}

        handleError();};

      xhr.onerror = (error) => {
        handleError();};
      
      xhr.open("GET", getFeedUrl(plabel, appConfig.mailUrl, instanceId), true);
      xhr.send(null);
      dispatch({ type: "APP_DATA", key: "request_sending", data: true });
      dispatch(updateIcon());}
    catch(e) {
      handleError();}
  }
}

export const playSound = (source) => {
  let audioElement = new Audio();
  try {
    audioElement.src = source;
    audioElement.load();
    audioElement.play();
  } catch (e) {}
}

export const showNotifyAlert = () => {
  return (dispatch, getState) => {
    const { appConfig, mails, unreadCount } = getState().app;
    const { lang, lastCheck, notify, sound, sofile } = getState().app.localStore;
    const getNotifyList = () => {
      let retLst = [];
      if (mails.length > 0) {
        let maxlist = mails.length > 2 ? 2 : mails.length;
        for ( let i = 0; i < maxlist; i++) {
          retLst[retLst.length] = {title: mails[i].name, message: ""};
          retLst[retLst.length] = {title: "", message: mails[i].title};}}
      return retLst;}
    
    let opt = {}
    if(mails.length > 0){
      opt = {
        type: "list",
        title: languages[lang].popupText +' '+ languages[lang].unreadText+": "+unreadCount.label,
        message: "",
        iconUrl: window.chrome.runtime.getURL(appConfig.unreadImg),
        items: getNotifyList()};
    }
    else {
      opt = {
        type: "basic",
        title: languages[lang].noUnreadText,
        message: lastCheck,
        iconUrl: window.chrome.runtime.getURL(appConfig.unreadImg),};
    }
    window.chrome.notifications.create(appConfig.nfId, opt, ()=>{return null;});
    
    if (notify !== "-1") {
      setTimeout(function() {
        window.chrome.notifications.clear(appConfig.nfId, ()=>{return null;});
      }, notify);}
    if (sound === "1") {
      playSound("sounds/"+sofile+".ogg");}
  }
}

export const requestTask = (params) => {
  return (dispatch, getState) => {
    const { requestFailureCount, requestTimerId, appConfig } = getState().app;
    const { lang, notify, polling, pinterval, plabel, instanceId } = getState().app.localStore;
    const startRequest = () => {
      dispatch(getInboxCount(
        (result) => {
          const { unreadCount } = getState().app;
          localStorage.lastCheck = languages[lang].lastCheckText 
              +(new Date()).toDateString()+' '+(new Date()).toLocaleTimeString()
          dispatch({ type: "APP_DATA", key: "localStore", data: localStorage });
          dispatch({ type: "APP_DATA", key: "unreadCount", data: result });
          dispatch(updateIcon());
          if (unreadCount.value !== result.value & notify !== "0") {
            if (result.value > unreadCount.value && result.value > 0) {
              dispatch(showNotifyAlert());}}
          dispatch(requestTask({type:"schedule"}));
        },
        () => {
          dispatch({ type: "APP_DATA", key: "unreadCount", 
            data: {value:null, from:"full", label:languages[lang].noCheckText} });
          dispatch(updateIcon());
          if (requestFailureCount<9) {
            dispatch(requestTask({type:"schedule",interval:2000}));} 
          else {
            dispatch(requestTask({type:"schedule"}));}
        },
        getFeedUrl(plabel, appConfig.mailUrl, instanceId)
      ));
    }
    
    if(params.type === "start"){
      startRequest();
    }
    else {
      if (polling === "0") {
        if (requestTimerId != null) {
          window.clearTimeout(requestTimerId);
          dispatch({ type: "APP_DATA", key: "requestTimerId", data: null });
        }
        dispatch(updateIcon());
      } else {
        if (requestTimerId) {
          window.clearTimeout(requestTimerId);
        }
        if (!params.interval) {
          let requestTimerId = window.setTimeout(() => {
            dispatch(requestTask({type:"start"}))}, parseInt(pinterval,10));
          dispatch({ type: "APP_DATA", key: "requestTimerId", data: requestTimerId });
        } else {
          let requestTimerId = window.setTimeout(() => {
            dispatch(requestTask({type:"start"}))}, params.interval);
          dispatch({ type: "APP_DATA", key: "requestTimerId", data: requestTimerId });
        }	
      }
    }

  }
}


