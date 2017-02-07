import { version } from '../../public/manifest.json';
import * as languages from './i18n'

const appIni = {
  app_name: "Nervatura Mail Control",
  developer: {
    name:"Nervatura", 
    url:"http://www.nervatura.com", 
    email:"info@nervatura.com"},
  webstore: {
    name: "Chrome Web Store",
    url: "https://chrome.google.com/webstore/detail/ejlhiijedldjjdmjgfiainenegbkokhn"},
  github: {
    name: "GitHub",
    url: "https://github.com/nervatura/mail-control"},
  video: {
    name: "YouTube",
    url: "https://www.youtube.com/watch?v=-z37tGzE9FE"
  },
  mailUrl: "https://mail.google.com/mail/",
  calendarUrl: "https://www.google.com/calendar/",
  nfId: "mcnf0",
  logoSize: 19,
  loginImg: "img/micon_19_login.png",
  logoutImg: "img/micon_19_logout.png",
  unreadImg: "img/micon_72.png",
  maxLine: 20,
  maxCount: 99,
  requestTimeout: 1000 * 2,  // 2 seconds
  labels: ["all","inbox"],
  languages: [
    {value:"en", name:"English", note:"Default"},
    {value:"it", name:"Italiano", 
      note:"Thanks to Maura Santini - Grazie a Maura Santini"},
    {value:"hu", name:"Magyar", 
      note:"Thanks to UZZO - Köszönet érte UZZOnak"}
  ],
  intervalList: [
    {value:"15000", time:"15", label:"secondsLabel"},
    {value:"30000", time:"30", label:"secondsLabel"},
    {value:"60000", time:"1", label:"minuteLabel"},
    {value:"900000", time:"15", label:"minutesLabel"},
    {value:"1800000", time:"30", label:"minutesLabel"},
    {value:"3600000", time:"1", label:"hourLabel"},
    {value:"7200000", time:"2", label:"hoursLabel"},
    {value:"18000000", time:"5", label:"hoursLabel"}
  ],
  notifyList: [
    {value:"-1", time:"", label:"not_disappear"},
    {value:"0", time:"0", label:"secondsLabel"},
    {value:"1000", time:"1", label:"secondsLabel"},
    {value:"2000", time:"2", label:"secondsLabel"},
    {value:"3000", time:"3", label:"secondsLabel"},
    {value:"4000", time:"4", label:"secondsLabel"},
    {value:"5000", time:"5", label:"secondsLabel"},
    {value:"6000", time:"6", label:"secondsLabel"},
    {value:"7000", time:"7", label:"secondsLabel"},
    {value:"8000", time:"8", label:"secondsLabel"},
    {value:"9000", time:"9", label:"secondsLabel"}
  ],
  sofileList:[
    {value:"ding", name:"Ding"},
    {value:"chime", name:"Chime"}
  ],
  uiList:[
    {value:"1", name:"minpopText"},
    {value:"2", name:"maxpopText"}
  ]
}

const localIni = {
  lang: "en",
  instanceId: 'gmc' + parseInt(Date.now() * Math.random(), 10),
  lastCheck: languages["en"].noCheckText,
  polling: 1,
  pinterval: 1000 * 60,
  sofile: "ding",
  plabel: "",
  domain: "",
  notify: 5000,
  sound: 1,
  popui: 2,
  online: 1,
  restyle: 1,
  ads: 0,
  labels: JSON.stringify({
    inbox: {
      olabel: "^i", title: "inboxLabel", icon:"inbox", value: true},
    imp: {
      olabel: "priority/^io_im", title: "priorityLabel", icon:"exclamation-circle", value: true}, 
    starred: {
      olabel: "^t", title: "starredLabel", icon:"star", value: true},
    sent: {
      olabel: "^f", title: "sentLabel", icon:"share-square-o", value: true},
    drafts: {
      olabel: "^r", title: "draftsLabel", icon:"pencil-square", value: true},
    all: {
      olabel: "^all", title: "allLabel", icon:"archive", value: true},
    spam: {
      olabel: "^s", title: "spamLabel", icon:"warning", value: true},
    trash: {
      olabel: "^k", title: "trashLabel", icon:"trash", value: true}, 
    chats: {
      olabel: "^b", title: "chatsLabel", icon:"comment-o", value: true},
    custom: []   
  })
}

export const loadDefault = () => {
  let defconf = {
    version: version,
    appConfig: appIni,
    localConfig: localIni,
    localStore: localStorage,
    optionPage: "settings",
    infoPage: "mlist",
    filter: "",
    customLabel: "",

    unreadCount: {value:null, from:"full", label:""},
    requestFailureCount: 0,
    requestTimerId: null,
    request_sending: false,
    mails:[],
    mail: null
  }
  return defconf;
}