import { requestTask, showNotifyAlert } from './mails'

export const updateStorage = (name, value) => {
  return (dispatch, getState) => {
    const { wintype } = getState().app;
    if(name){
      localStorage[name] = value}
    dispatch({ type: "APP_DATA", key: "localStore", data: localStorage });
    if(wintype !== "background"){
      window.chrome.runtime.sendMessage(
        {action: "loadLocalStore"}, (response) => {});
    }
  }
}

export const editLabel = (name, value) => {
  return (dispatch, getState) => {
    let labels = JSON.parse(getState().app.localStore.labels);
    if(labels[name]){
      labels[name].value = value;}
    else if ((labels.custom.indexOf(name) === -1) && (value === true)) {
      labels.custom.push(name)}
    else if ((labels.custom.indexOf(name) > -1) && (value === false)) {
      labels.custom.splice(labels.custom.indexOf(name),1)}
    dispatch(updateStorage("labels", JSON.stringify(labels)))
    dispatch({ type: "APP_DATA", key: "customLabel", data: "" })
  }
}

export const getAccData = (params) => {
  return (dispatch, getState) => {
    const { appConfig } = getState().app;
    let request = new XMLHttpRequest();
    let abortTimerId = window.setTimeout(() => {
      request.abort(); }, appConfig.requestTimeout);
    
    let url="";
    switch (params.type) {
    case "at":
      url = appConfig.mailUrl + "h/" + Math.ceil(1000000 * Math.random()) + "/?ui=html&zy=c";
      break;
    case "mail":
      url = appConfig.mailUrl+ "h/" + Math.ceil(1000000 * Math.random()) + "/?v=pt&th="+params.mail.message_id;
      break;
    default:
      return;
    }
    
    request.open('GET', url, true);
    request.onreadystatechange = function (aEvt) {
      if (request.readyState === 4) {
        dispatch({ type: "APP_DATA", key: "request_sending", data: false });
        if (request.status === 200){
          window.clearTimeout(abortTimerId);
          switch (params.type) {
          case "at":
            let startIndex = request.responseText.indexOf("at=");
            if (startIndex>-1) {
              dispatch(updateStorage("gmailAt", request.responseText.substring(startIndex+3, 
                request.responseText.indexOf('"', startIndex))));}
            break;
          case "mail":
            let matches = request.responseText.match(/<hr>[\s\S]?<table[^>]*>([\s\S]*?)<\/table>(?=[\s\S]?<\/div>)/gi);
            if (matches != null && matches.length > 0) {
              params.mail.body = matches[matches.length - 1];
              params.mail.body = params.mail.body.replace(/<tr>[\s\S]*?<tr>/, "");
              params.mail.body = params.mail.body.replace(/<td colspan="?2"?>[\s\S]*?<td colspan="?2"?>/, "");
              params.mail.body = params.mail.body.replace(/cellpadding="?12"?/g, "");
              params.mail.body = params.mail.body.replace(/font size="?-1"?/g, 'font');
              params.mail.body = params.mail.body.replace(/<hr>/g, "");
              params.mail.body = params.mail.body.replace(/(href="?)\/mail\//g, "$1" + appConfig.mailUrl);
              params.mail.body = params.mail.body.replace(/(src="?)\/mail\//g, "$1" + appConfig.mailUrl);
              
              params.mail.reply = String.fromCharCode(10)+String.fromCharCode(13)+
                String.fromCharCode(10)+String.fromCharCode(13)+params.mail.issued+
                " <"+params.mail.name+">:"+String.fromCharCode(10)+String.fromCharCode(13)+
                params.mail.summary;
              dispatch({ type: "APP_DATA", key: "mail", data: params.mail });}
            break;
          default:}
        }
        else
          window.clearTimeout(abortTimerId);}};
    request.send(null);
    dispatch({ type: "APP_DATA", key: "request_sending", data: true });
  }
}

export const initBackground = () => {
  return (dispatch, getState) => {

    const { localConfig } = getState().app;
    for (var key in localConfig) {
      if (localConfig.hasOwnProperty(key)) {
        if (!localStorage[key] || localStorage[key] === null) {
          localStorage[key] = localConfig[key];}}}
    dispatch(updateStorage());

    const { polling } = getState().app.localStore;
    if (polling === "1") {
      dispatch(requestTask({type:"start"}));	
    } else {
      dispatch(requestTask({type:"schedule"}));}
    
    dispatch(getAccData({type:"at"}));
    
    const { version } = getState().app;
    if (localStorage.version !== version) {
      dispatch(updateStorage("version", version));
      window.chrome.tabs.create({url: "index.html?options"});}
    
    window.getRequestInfo = ()=>{
      const { mails, unreadCount } = getState().app;
      return {info:unreadCount, mails:mails};}

    window.chrome.runtime.onMessage.addListener(
      (req, sender, sendResponse) => {
        switch (req.action) {
          case "startRequest":
            dispatch(requestTask({type:"start"}));
            break;
          
          case "scheduleRequest":
            dispatch(requestTask({type:"schedule"}));
            break;
          
          case "lastNotifyList":
            dispatch(showNotifyAlert());
            break;

          case "loadLocalStore":
            dispatch({ type: "APP_DATA", key: "localStore", data: localStorage });
            break;

          default:
            break;}});
  }
}

