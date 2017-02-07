
export const goPage = (params) => {
  return (dispatch, getState) => {
    const { appConfig, filter } = getState().app;
    const { online } = getState().app.localStore;
    const isGmailUrl = (url) => {
      return url.indexOf(appConfig.mailUrl) > -1;}
    
    switch (params.page) {
      case "gmail":
        window.chrome.tabs.getAllInWindow(undefined, function(tabs) {
          for (let index = 0; index < tabs.length; index++) {
            let tab = tabs[index];
            if (tab.url && isGmailUrl(tab.url)) {
              window.chrome.tabs.update(tab.id, {selected: true});
              return;}}
          window.chrome.tabs.create({url: appConfig.mailUrl});});
        break;
      
      case "omail":
        window.chrome.tabs.create({url: appConfig.mailUrl+"mu/?mui=ca"});
        break;
      
      case "ocomp":
        window.chrome.tabs.create({url: appConfig.mailUrl+"mu/?mui=ca#co"});
        break;
      
      case "gcomp":
        window.chrome.tabs.create({url: appConfig.mailUrl+"?view=cm&fs=1&tf=1"});
        break;
      
      case "notify":
        window.chrome.runtime.sendMessage({action: "lastNotifyList"});
        break;

      case "options":
        window.chrome.tabs.create({url: "index.html?options"});
        break;
      
      case "calendar":
        window.chrome.tabs.create({url: appConfig.calendarUrl});
        break;

      case "unread_all":
        if (online === "0") {
          window.chrome.tabs.create({url: appConfig.mailUrl+"mu/?mui=ca#tl/search/is%3Aunread"});} 
        else {
          window.chrome.tabs.create({url: appConfig.mailUrl+"#search/is%3Aunread"});}
        break;

      case "in_gmail":
        window.chrome.tabs.create({url: appConfig.mailUrl+"?shva=1#all/"+encodeURI(params.id)});
        break;
      
      case "print":
        window.chrome.tabs.create({url: appConfig.mailUrl+"h/" + 
          Math.ceil(1000000 * Math.random()) + "/?v=pt&th="+encodeURI(params.id)});
        break;
        
      case "reply":
        var subject = (params.title.search(/^Re: /i) > -1) ? params.title : "Re: " + params.title;
        window.chrome.tabs.create({url: appConfig.mailUrl+"?view=cm&tf=1&to=" + 
          encodeURIComponent(params.email) + "&su=" + encodeURIComponent(subject) + 
          "&body="+ encodeURIComponent(params.reply)});
        break;
      
      case "search":
        if (filter !== ""){
          if (online === "0") {
            window.chrome.tabs.create({url: appConfig.mailUrl+
              "mu/?mui=ca#tl/search/"+encodeURI(filter)});} 
          else {
            window.chrome.tabs.create({url: appConfig.mailUrl+
              "#search/"+encodeURI(filter)});}}
        break;
      
      case "label":
        if (online === "0") {
          if (params.type === "custom"){
            window.chrome.tabs.create({url: appConfig.mailUrl+
            "mu/?mui=ca#tl/"+encodeURI(params.label).replace(/\//g,"-")});}
          else{
            window.chrome.tabs.create({url: appConfig.mailUrl+
            "mu/?mui=ca#tl/"+params.olabel});}} 
        else {
          let ltype = (params.type === "custom") ? "label/" : ""
          window.chrome.tabs.create({url: appConfig.mailUrl+
            "#"+ltype+encodeURIComponent(params.label)});}
        break;

      default:
        break;
    }
  }

}

export const startRequest=() => {
  return (dispatch, getState) => {
    window.chrome.runtime.sendMessage({action: "startRequest"});
    window.close();
  }
}

export const getRequestInfo=() => {
  if(window.chrome.extension){
    return window.chrome.extension.getBackgroundPage().getRequestInfo();}
  else {
    return {info:{}, mails:[]};}
}

export const sendPage=() => {
  return (dispatch, getState) => {
    const { appConfig } = getState().app;
    window.chrome.tabs.getSelected(null, function(tab) {
      let mUrl = appConfig.mailUrl+'?ui=1&view=cm&fs=1&tf=1&su=@su_txt&body=@body_txt';
      if (tab.title.length > 0)
        mUrl = mUrl.replace("@su_txt", encodeURIComponent(tab.title));
      else
        mUrl = mUrl.replace("@su_txt", "");
      if (tab.url.length > 0)
        mUrl = mUrl.replace("@body_txt", encodeURIComponent(tab.url));
      else
        mUrl = mUrl.replace("@body_txt", "");
      window.chrome.tabs.create({ url: mUrl });
	});
  }
}

export const postMail = (act, mailId) => {
  return (dispatch, getState) => {
    const { appConfig } = getState().app;
    const { gmailAt } = getState().app.localStore;
    
    let postURL = appConfig.mailUrl + "u/0/h/" + Math.ceil(1000000 * Math.random()) + "/";
    let postParams = "t=" + mailId + "&at=" + gmailAt + "&act=" + act;
    let postXHR = new XMLHttpRequest();
    postXHR.onreadystatechange = function () {
       if (this.readyState === 4 && this.status === 200) {
         dispatch(startRequest());}};

    postXHR.open("POST", postURL, true);
    postXHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    postXHR.send(postParams);
  }
}