//this file is used only at App init to set dispatch

var reduxStore = null;
var _store = null;
var root_navigation = null;
var _activeSpend = 0;
var _isInitFCM = null;
var REFRESH_TOKEN_STATUS = null;
var REFRESH_TOKEN_LOG = null;
export default AppData = {
    setAppReduxStore,
    getDispatch,
    getStore,
    createLinkStore,
    setRootNavigation,
    getRootNavigation,
    setActiveSpend,
    getActiveSpend,
    setStatusInitFCM,
    getStatusInitFCM,
    setRefreshTokenStatus,
    getRefreshTokenStatus,
    setRefreshTokenLog,
    getRefreshTokenLog,
}
function createLinkStore(rootstore) {
    _store = rootstore;
}
function setAppReduxStore(store) {
    reduxStore = store;
}

function getDispatch() {
    return reduxStore.dispatch;
}

function getStore() {
    return reduxStore;
}

function setRootNavigation(navigation) {
    root_navigation = navigation;
}
function getRootNavigation() {
    return root_navigation;
}

function setActiveSpend(status) {
    _activeSpend = status;
}
function getActiveSpend() {
    return _activeSpend;
}

function setStatusInitFCM(status) {
    _isInitFCM = status;
}
function getStatusInitFCM() {
    return _isInitFCM;
}

function setRefreshTokenStatus(status) {
    REFRESH_TOKEN_STATUS = status;
}
function getRefreshTokenStatus() {
    return REFRESH_TOKEN_STATUS;
}

function setRefreshTokenLog(log) {
    REFRESH_TOKEN_LOG = log;
}
function getRefreshTokenLog() {
    try {
        if (REFRESH_TOKEN_LOG) {
            return JSON.parse(REFRESH_TOKEN_LOG);
        } else {
            return REFRESH_TOKEN_LOG;
        }
    } catch (ex) {
        return REFRESH_TOKEN_LOG;
    }

}


