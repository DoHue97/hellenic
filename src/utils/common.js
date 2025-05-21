import AsyncStorage from '@react-native-async-storage/async-storage';
import { strings } from '../translations';
import { actionLanguageCreators } from '../reducers/language'
import { commonAction } from '../process/common';
import { fcmUtils } from './fcmdevice'
import { navigateAndReset } from './util'
import AppData from './store'
import { crmConfig } from '../config/crmserver';

import { fetch as fetchSSL } from 'react-native-ssl-pinning';
import { userService } from '../wsinterface/crmapi/user';
import { userAction } from '../process/user';
import { restsv } from '../wsinterface/crmapi/restsv';
import { Platform } from 'react-native';

let fetchFn = fetch;
var jwtDecode = require('jwt-decode');
if (crmConfig.enableSSL) {
    fetchFn = fetchSSL;
}

const USER_TOKEN = 'USER_TOKEN';

export function storeToken(responseData) {
    try {
        if (responseData)
            AsyncStorage.setItem(USER_TOKEN, responseData, (err) => {
                if (err) {
                    console.log("CRITICAL, store token ERROR", err);
                    throw err;
                }
                //console.log("success");
            }).catch((err) => {
                console.log("storeToken error is: " + err);
            });
        else {
            console.log('Response data have issue!!!!!Check code')
        }
    } catch (ex) {
        console.log('It should not happen but happened!!!', ex);
    }
}


export function saveDataIntoAsyncStore(key, data) {
    try {
        if (data)
            AsyncStorage.setItem(key, data, (err) => {
                if (err) {
                    console.log("CRITICAL, saveDataIntoAsyncStore error", err);
                    throw err;
                }
            }).catch((err) => {
                console.log("saveDataIntoAsyncStore error is: " + err);
            });
        else
            console.log('saveDataIntoAsyncStore response data have issue')
    } catch (ex) {
        console.log('saveDataIntoAsyncStore exception: ', ex);
    }
}

export async function getData(key, isString) {
    try {
        return isString ? await AsyncStorage.getItem(key) : JSON.parse(await AsyncStorage.getItem(key));
    } catch (error) {
        console.log('something went wrong', error);
    }
}


export async function getToken() {
    try {
        let accessToken = await AsyncStorage.getItem(USER_TOKEN);
        if (!accessToken) {
            return null;
        } else {
            return accessToken;
        }
    } catch (error) {
        console.log("Something went wrong");
    }
}
export async function removeToken() {
    try {
        let accessToken = await AsyncStorage.getItem(USER_TOKEN);
        await AsyncStorage.removeItem(USER_TOKEN);
        //Actions.login();
    } catch (error) {
        console.log("Something went wrong");
        //Actions.login();
    }
}

var language_id = 'ENG';
export async function initLanguage() {
    // console.log("START Initializing Language.....");
    try {
        let storedLanguage = await AsyncStorage.getItem('language_id');
        if (!storedLanguage) {
            language_id = 'ENG';
            await storeLanguageAsync(language_id, null);
        } else {
            language_id = storedLanguage;
            strings.setLanguage(storedLanguage);
        }
        // console.log("FINISHED Initializing Language, current language is", language_id);
        return language_id;
    } catch (ex) {
        //if exception, do nothing and get current language of strings
        console.log("EXCEPTION getLanguage", ex);
        language_id = 'ENG';
        strings.setLanguage(language_id);
        return language_id;
    }
}

export function getLanguage() {
    return language_id;
}


//use it as single point of change for language. only login page and change language should use it!!!
export function storeLanguage() {
    language = getLanguage();
    AsyncStorage.setItem('language_id', language, (err) => {
        if (err) {
            console.log("an error: ", err);
            throw err;
        }
    }).catch((err) => {
        console.log("error is: " + err);
    });
}
export async function storeLanguageAsync(language) {
    try {
        strings.setLanguage(language);
        let rtn = await AsyncStorage.setItem('language_id', language);
        language_id = language;
        await AppData.getStore().dispatch(actionLanguageCreators.update(language_id));
    }
    catch (err) {
        console.log("EXCEPTION  storeLanguageAsync ", err);
        throw err;
    }
}

export async function clearStore() {
    AsyncStorage.clear();
}

export async function getContactId() {
    try {
        var jwtToken = await getJWTToken();
        if (jwtToken) {
            return jwtToken.ciid;
        }
        return null;
    } catch (error) {
        console.log("getContactID exception: ", error);
        return null;
    }
}

async function getJWTToken() {
    try {
        var user_token = await getData("USER_TOKEN");
        if (user_token) {
            var jwtToken = user_token.token;
            if (jwtToken) {
                return jwtDecode(jwtToken);
            }
        }
        return null;
    } catch (error) {
        console.log("getJWTToken exception: ", error);
        return null;
    }
}

export async function logOut() {
    var navigation = await AppData.getRootNavigation();
    navigateAndReset(navigation, "Login");
    await fcmUtils.clearFCM();
    commonAction.clearData();
}

export async function forceLogOut() {
    var navigation = await AppData.getRootNavigation();
    var crmToken = await getData("USER_TOKEN");
    if (crmToken && crmToken.refreshToken) {
        await fcmUtils.clearFCM();

        commonAction.clearData();
        await restsv.saveToken(crmToken.token, crmToken.refreshToken, crmToken.exp);
        navigateAndReset(navigation, "LoginWithOtp");
    }

}

export async function checkRefreshToken() {
    var crmToken = await getData("USER_TOKEN");
    if (crmToken && crmToken.token && crmToken.refreshToken) {
        await restsv.refreshToken();
    }
}
export async function fetchCommon(url, options) {
    try {
        var response;
        // if(crmConfig.sslCertificates && SSL_PINNING_ENBLED == 1){
        // 	options = {...options, sslPinning: {certs: crmConfig.sslCertificates},timeoutInterval:300000};
        //     console.log('options ssl=== ', options)
        // }
        if (crmConfig.enableSSL && crmConfig.sslPinningOptions) {
            //options = {...options, sslPinning: {certs: crmConfig.sslCertificates},timeoutInterval:300000};
            options = { ...options, ...crmConfig.sslPinningOptions };
            //onsole.log('options ssl=== ', options)
        }
        console.log("AAA fetchCommon: ")
        response = await fetchFn(url, options);
        return response;
    } catch (ex) {
        console.log("AAA fetchCommon ex: ", ex)
        if (ex.status) {
            return ex;
        } else {
            if (Platform.OS === 'ios' && ex === 'cancelled') {
                return { status: 526, code: "CertPathValidatorException", data: ex };
            }
            if (Platform.OS === 'android' && ex.includes('java.security.cert.CertPathValidatorException')) {
                return { status: 526, code: "CertPathValidatorException", data: ex };
            }
        }
        throw ex;
    }
}

export async function getImageURL(url) {
    if (url) {
        var jwtTokenDecode = await getJWTToken();
        if (jwtTokenDecode && jwtTokenDecode.org) {
            url = url + '&orgid=' + jwtTokenDecode.org;
        }
        return url;
    }
    return null;
}

export async function checkEmail(isRemember, isUpdateCatagory) {
    var isEmailValidation = false;
    try {
        var ciid = await getContactId();
        if (ciid) {
            console.log(' checkEmail=====')
            const result = await userService.getContactInfo(ciid);
            // console.log(' checkEmail=====', result)
            if (result.code === "OK") {
                if (result.data.emails.length > 0) {
                    isEmailValidation = true;
                    if (isUpdateCatagory)
                        userAction.updateContactCategory(result.data);
                } else {
                    isEmailValidation = false;
                }
            } else {
                isEmailValidation = "EXCEPTION";
            }
        } else {
            isEmailValidation = "EXCEPTION";
        }
    } catch (error) {
        isEmailValidation = "EXCEPTION";
    }
    saveDataIntoAsyncStore("IS_VERIFY_EMAIL", isEmailValidation.toString());
    if (isRemember != undefined) {
        saveDataIntoAsyncStore("IS_REMEMBER_ME", isRemember.toString());
    }
    return isEmailValidation;
}

export function diffDateInMinute(date1, date2) {
    var firstDate = new Date(date1);
    var comparedDate = new Date(date2);//"2015-12-03T06:52:11.597Z"
    return Math.round((firstDate - comparedDate) / (60 * 1000));
}
