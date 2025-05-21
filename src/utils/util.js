//components/util
import React from 'react';
import { Alert } from 'react-native';
import { strings } from '../translations'
import URLSearchParams from 'url-search-params'
import { CommonActions, StackActions } from '@react-navigation/native';
import { config_path } from '../config/config_path';

export var modalObject = {};

var timezone = 0;
var crm_tz = 'Africa/Abidjan';//'Asia/Nicosia';
var moment = require('moment-timezone');
export function diffDateInMinute(date1, date2) {
    var firstDate = new Date(date1);
    var comparedDate = new Date(date2);//"2015-12-03T06:52:11.597Z"
    return Math.round((firstDate - comparedDate) / (60 * 1000));
    // return (firstDate - comparedDate);
}
// export function getKeyAuthorizationBasic({username,password}){
//     var key = btoa(username + ":" + password).toUpperCase();
//     return key
// }

export function validURL(url) {
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if (!regex.test(url)) {
        return false;
    } else {
        return true;
    }
}
export function formatDateToDDMMYYYY(date) {
    var date = new Date(date);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    if (day < 10) day = '0' + day;
    if (month < 10) month = '0' + month;
    var dateFormatted = day + '/' + month + '/' + date.getFullYear();
    return dateFormatted;
}
export function formatDateToMonthName(date) {
    var date = new Date(date);
    var day = date.getDate();
    var month = date.getMonth();
    if (day < 10) day = '0' + day;
    var months = createMonth();
    month = months[month];
    var dateFormatted = day + ' ' + month + ' ' + date.getFullYear();
    return dateFormatted;
}

export function formatDateToShortMonthName(date) {
    var date = new Date(date);
    var day = date.getDate();
    var month = date.getMonth();
    if (day < 10) day = '0' + day;
    var months = createShortMonth();
    month = months[month];
    var dateFormatted = day + ' ' + month + ' ' + date.getFullYear();
    return dateFormatted;
}
export function formatDateTime(dateTime) {
    var date = new Date(dateTime);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var hours = date.getHours()
    var minutes = date.getMinutes();
    var second = date.getSeconds();

    if (day < 10) day = '0' + day;
    if (month < 10) month = '0' + month;
    if (hours < 10) hours = '0' + hours;
    if (minutes < 10) minutes = '0' + minutes;
    if (second < 10) second = '0' + second;
    var time = hours + ":" + minutes + ":" + second;
    var dateFormatted = day + '/' + month + '/' + date.getFullYear() + " " + time;

    return dateFormatted;
}
export function formatDateTimeNoSecond(dateTime) {
    var date = new Date(dateTime);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var hours = date.getHours()
    var minutes = date.getMinutes();
    var second = date.getSeconds();

    if (day < 10) day = '0' + day;
    if (month < 10) month = '0' + month;
    if (hours < 10) hours = '0' + hours;
    if (minutes < 10) minutes = '0' + minutes;
    if (second < 10) second = '0' + second;
    var time = hours + ":" + minutes;
    var dateFormatted = day + '/' + month + '/' + date.getFullYear() + " " + time;

    return dateFormatted;
}
export function getFormattedDate(date_of_birth) {
    var dobDate = (date_of_birth.year && date_of_birth.month && date_of_birth.day)
        ? ((date_of_birth.day < 10)
            ? '0' + date_of_birth.day
            : date_of_birth.day)
        : 'DD';
    var dobMonth = (date_of_birth.year && date_of_birth.month && date_of_birth.day)
        ? ((date_of_birth.month < 10)
            ? '0' + date_of_birth.month
            : date_of_birth.month)
        : 'MM';
    var dobYear = (date_of_birth.year && date_of_birth.month && date_of_birth.day)
        ? date_of_birth.year
        : 'YYYY';

    var dateFormatted = dobDate + '/' + dobMonth + '/' + dobYear;
    return dateFormatted;
}

export function formatDateToDDMMYYYYFrEpoch(epochTime) {
    var d = new Date(epochTime * 1000); // The 0 there is the key, which sets the date to the epoch
    // d = getDateTimeLocalUTC(d);
    return formatDateToDDMMYYYY(d);
    // d = getDateTimeLocalUTC(d);
    // return formatDateToDDMMYYYY(convertUTCToCRMDateString(d));
}

export function formatDateTimeFrEpoch(epochTime) {
    var d = new Date(epochTime * 1000); // The 0 there is the key, which sets the date to the epoch
    // d = getDateTimeLocalUTC(d);
    return formatDateTime(d);
    // d = getDateTimeLocalUTC(d);
    // return formatDateTime(convertCRMDateToTimeUTC(convertUTCToCRMDateString(d)));
}
export function formatDateTimeFrEpochNoSecond(epochTime) {
    var d = new Date(epochTime * 1000); // The 0 there is the key, which sets the date to the epoch
    // d = getDateTimeLocalUTC(d);
    return formatDateTimeNoSecond(d);
    // d = getDateTimeLocalUTC(d);
    // return formatDateTime(convertCRMDateToTimeUTC(convertUTCToCRMDateString(d)));
}
/* export function epochToLocalUTC(epochTime) {
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(epochTime);
    d = getDateTimeLocalUTC(d);
    return d;
} */

export function convertUTCToCRMDateString(date) {
    var crmDate = moment.tz(date.getTime(), crm_tz);
    return crmDate.format('YYYY-MM-DDTHH:mm:ss');
}

export function convertCRMDateToTimeUTC(crmDate) {
    //date utc convert date from crm
    try {
        var utc = moment.tz(crmDate, crm_tz);
        return new Date(utc.format());
    } catch (ex) {
        console.log("convertCRMDateToTimeUTC error:", ex, crmDate);
        return crmDate;
    }
}

export function isValidEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email))
        return true;
    else
        return false;

}

export function showAlertMessage(message) {
    Alert.alert(
        '',
        message,
        [
            { text: strings.OK, onPress: () => console.log("OK") },
        ],
        { cancelable: true }
    )
}
export function createMonth() {
    let months = [
        strings.MONTH.JAN,
        strings.MONTH.FEB,
        strings.MONTH.MAR,
        strings.MONTH.APR,
        strings.MONTH.MAY,
        strings.MONTH.JUN,
        strings.MONTH.JUL,
        strings.MONTH.AUG,
        strings.MONTH.SEP,
        strings.MONTH.OCT,
        strings.MONTH.NOV,
        strings.MONTH.DEC
    ];
    return months;
}

export function createShortMonth() {
    let months = [
        strings.SHORTMONTH.JAN,
        strings.SHORTMONTH.FEB,
        strings.SHORTMONTH.MAR,
        strings.SHORTMONTH.APR,
        strings.SHORTMONTH.MAY,
        strings.SHORTMONTH.JUN,
        strings.SHORTMONTH.JUL,
        strings.SHORTMONTH.AUG,
        strings.SHORTMONTH.SEP,
        strings.SHORTMONTH.OCT,
        strings.SHORTMONTH.NOV,
        strings.SHORTMONTH.DEC
    ];
    return months;
}
export function createYear() {
    let year = [];
    var date = new Date();

    for (var i = 1950; i < date.getFullYear(); i++) {
        year.push(i + '');
    }
    return year;
}

//   export function createMonth(){
//       let month = [];

//         for(var i=1; i < 13;i++){
//             month.push(createMonthObj[i] + '');
//         }
//         return month;
//   }

export function createDay(month, year) {
    month = month + 1;
    let day = [];

    if (month === 2) {
        for (let k = 1; k < 29; k++) {
            day.push(k + '');
        }
        //Leap day for years that are divisible by 4, such as 2000, 2004
        if (year % 4 === 0) {
            day.push(29 + '');
        }
    }
    else if (month in ['1', '3', '5', '7', '8', '10', '12']) {
        for (let k = 1; k < 32; k++) {
            day.push(k + '');
        }
    }
    else {
        for (let k = 1; k < 31; k++) {
            day.push(k + '');
        }
    }

    return day;
}
export function readMWCode(code) {
    switch (code) {
        case 'EXCEPTION':
            return strings.EXCEPTION + '(0)';
        case 'INVALID_LOGIN':
            return strings.INVALID_LOGIN;
        case 'USER_ACCOUNT_NOT_VERIFIED':
            return strings.USER_ACCOUNT_NOT_VERIFIED;
        case 'INVALID_VERIFICATION_CODE':
            return strings.INVALID_VERIFICATION_CODE;
        case 'INVALID_VERFICATION_TOKEN':
            return strings.INVALID_VERFICATION_TOKEN;
        case 'INVALID_TOKEN':
            return strings.INVALID_TOKEN;
        case 'INVALID_INPUT':
            return strings.INVALID_INPUT;
        case 'ACCOUNT_EXISTS_ALREADY':
            return strings.ACCOUNT_EXISTS_ALREADY;
        case 'CRM_GET_TOKEN_FAIL':
            return strings.CRM_GET_TOKEN_FAIL;
        case 'SCHEMA_VALIDATION_FAILED':
            return strings.SCHEMA_VALIDATION_FAILED;
        case 'REFERRING_PARTICIPANT_NOT_FOUND':
            return strings.REFERRING_PARTICIPANT_NOT_FOUND;
        case 'PARTICIPANT_NOT_FOUND':
            return strings.PARTICIPANT_NOT_FOUND;
        case 'INVALID_TRANSFER_CARD_INFO':
            return strings.INVALID_TRANSFER_CARD_INFO
        case 'OBJECT_NOT_FOUND':
            return strings.OBJECT_NOT_FOUND;
        case 'SERVER_UNEXPECTED_ISSUE':
            return strings.EXCEPTION + '(1)';
        case 'NETWORK_ISSUE':
            return strings.NETWORK_ISSUE;
        case 'CLIENT_UNEXPECTED_ISSUE':
            return strings.EXCEPTION + '(2)';
        case 'CARD_BEING_TRANSFERED_NOT_FOUND':
            return strings.CARD_BEING_TRANSFERED_NOT_FOUND;
        case 'CHANGE_PASSWORD_FAILED':
            return strings.CHANGE_PASSWORD_FAILED;
        case 'PHONE_TOKEN_EXISTS_AND_BELONG_TO_ANOTHER':
            return strings.profile_existed_phone;
        case 'CREATE_ACHIEVEMENTS_ERROR':
            return strings.CREATE_ACHIEVEMENTS_ERROR;
        case 'TOKEN_EXPIRED':
            return strings.TOKEN_EXPIRED;
        case 'EMAIL_NOT_FOUND_EXCEPTION':
            return strings.EMAIL_NOT_FOUND_EXCEPTION;
        case 'POSTAL_CODE_DOES_NOT_MATCH':
            return strings.POSTAL_CODE_DOES_NOT_MATCH;
        case 'FAILED_TO_UPDATE_ADDRESS':
            return strings.FAILED_TO_UPDATE_ADDRESS;
        case 'FAILED_TO_REMOVE_ADDRESS':
            return strings.FAILED_TO_REMOVE_ADDRESS;
        case 'MAX_ADDRESSES_REACHED':
            return strings.MAX_ADDRESSES_REACHED;
        case 'FAILED_TO_MODIFY_PHONE':
            return strings.FAILED_TO_MODIFY_PHONE;
        case 'FAILED_TO_UPDATE_TOKEN_PHONE':
            return strings.FAILED_TO_UPDATE_TOKEN_PHONE;
        case 'MAX_PHONES_REACHED':
            return strings.MAX_PHONES_REACHED;
        case 'FAILED_TO_UPDATE_CONSENT':
            return strings.FAILED_TO_UPDATE_CONSENT;
        case 'FAILED_TO_UPDATE_LANGUAGE':
            return strings.FAILED_TO_UPDATE_LANGUAGE;
        case 'FAILED_TO_PURCHASE_VOUCHER':
            return strings.FAILED_TO_PURCHASE_VOUCHER;
        case 'REFERENCE_CODE_UNIQUE':
            return strings.REFERENCE_CODE_UNIQUE;
        case 'REFERENCE_CODE_EMPTY':
            return strings.REFERENCE_CODE_EMPTY;
        case 'REFERENCE_CODE_INVALID':
            return strings.REFERENCE_CODE_INVALID;
        case 'AMOUNT_INVALID':
            return strings.AMOUNT_INVALID;
        case 'CARD_ALREADY_EXIST':
            return strings.CARD_ALREADY_EXIST;
        case 'FAILED_TO_ADD_CARD':
            return strings.FAILED_TO_ADD_CARD;
        case 'INVALID_CURRENT_PASSWORD':
            return strings.INVALID_CURRENT_PASSWORD
        case 'CARD_NUMBER_NOT_FOUND':
            return strings.CARD_NUMBER_NOT_FOUND
        default:
            return strings.EXCEPTION + '(3)';
    }
}

export function toUpperCaseGreek(str) {
    if (str == undefined || str == null)
        return str;
    str = str.toUpperCase();
    str = str.replace(/Ά/g, 'Α');
    str = str.replace(/Έ/g, 'Ε');
    str = str.replace(/Ή/g, 'Η');
    str = str.replace(/Ί/g, 'Ι');
    str = str.replace(/Ό/g, 'Ο');
    str = str.replace(/Ύ/g, 'Υ');
    str = str.replace(/Ώ/g, 'Ω');
    return str;

}
export function toUniCodeGreek(str) {
    if (str == undefined || str == null)
        return str;
    str = str.replace('A', '\u0391');
    str = str.replace('B', '\u0392');
    str = str.replace('Γ', '\u0393');
    str = str.replace('Δ', '\u0394');
    str = str.replace('E', '\u0395');
    str = str.replace('Z', '\u0396');
    str = str.replace('H', '\u0397');
    str = str.replace('Θ', '\u0398');
    str = str.replace('I', '\u0399');
    str = str.replace('K', '\u039a');
    str = str.replace('Λ', '\u039b');
    str = str.replace('M', '\u039c');
    str = str.replace('N', '\u039d');
    str = str.replace('Ξ', '\u039e');
    str = str.replace('Ο', '\u039f');
    str = str.replace('Π', '\u03a0');
    str = str.replace('P', '\u03a1');
    str = str.replace('Σ', '\u03a3');
    str = str.replace('T', '\u03a4');
    str = str.replace('ϒ', '\u03a5');
    str = str.replace('Φ', '\u03a6');
    str = str.replace('X', '\u03a7');
    str = str.replace('Ψ', '\u03a8');
    str = str.replace('Ω', '\u03a9');
    return str;

}
export function toQueryParams(paramName, str) {
    params = new URLSearchParams();
    params.append(paramName, str);
    return params.toString();
}

export function newGUID() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    //return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    //  s4() + '-' + s4() + s4() + s4();
    return s4() + s4() + s4() + s4() +
        s4() + s4() + s4() + s4();
}


export function navigateAndReset(navigation, routename, params) {
    navigation.dispatch(state => {
        console.log("AAAAA state:",state.routes);
        const routes = state.routes.filter(r => r.name !== config_path.landing_page);
        return CommonActions.reset({
          ...state,
          routes,
          index: routes.length - 1,
        });
      });
    navigation.dispatch(
        StackActions.replace(routename, params)
    );
}

export function navigateToProfile(navigation) {
    let routes = [
        { name: config_path.home_drawer_router },
        { name: config_path.profile_router },
    ];
    navigation.dispatch(state => {
        return CommonActions.reset({
          ...state,
          routes,
          index: routes.length - 1,
        });
    });
}

export function createDatePickerData(fullMonth) {
    let current_year = new Date().getFullYear();
    let date = [];
    for (let i = 1910; i < current_year + 1; i++) {
        let month = [];
        for (let j = 1; j < 13; j++) {
            let day = [];
            if (j === 2) {
                for (let k = 1; k < 29; k++) {
                    day.push(k);
                }
                //Leap day for years that are divisible by 4, such as 2000, 2004
                if (i % 4 === 0) {
                    day.push(29);
                }
            } else if (j in { 1: 1, 3: 1, 5: 1, 7: 1, 8: 1, 10: 1, 12: 1 }) {
                for (let k = 1; k < 32; k++) {
                    day.push(k);
                }
            } else {
                for (let k = 1; k < 31; k++) {
                    day.push(k);
                }
            }
            let _month = {};
            _month[fullMonth[j - 1]] = day;
            month.push(_month);
        }
        let _date = {};
        _date[i] = month;
        date.push(_date);
    }
    //console.log('Date structure', date);
    return date;
}



export function checkValidDateOfBirth(date_of_birth) {
    const { day, month, year } = date_of_birth;
    if (!day || !month || !year) return true;
    var intDay = Number.parseInt(day);
    var intMonth = Number.parseInt(month);
    var intYear = Number.parseInt(year);
    if (intMonth === 2) {
        if (intYear % 4 === 0) {
            if (intDay < 30) return true;
            else return false;
        } else {
            if (intDay < 29) return true;
            else return false;
        }
    }
    if ([1, 3, 5, 7, 8, 10, 12].includes(intMonth)) {
        if (intDay < 32) return true;
        else return false;
    } else {
        if (intDay < 31) return true;
        else return false;
    }
}

export function checkValidNameDay(name_day) {
    const { day, month } = name_day;
    if (!day || !month) return true;
    var intDay = Number.parseInt(day);
    var intMonth = Number.parseInt(month);
    //check valid t2
    if (intMonth === 2) {
        if (intDay < 30) return true;
        else return false;
    }
    //check valid 4,6,9,11
    if ([1, 3, 5, 7, 8, 10, 12].includes(intMonth)) {
        if (intDay < 32) return true;
        else return false;
    }
    else {
        if (intDay < 31) return true;
        else return false;
    }
}

export function checkEnoughAge(profile) {
    const { date_of_birth } = profile;
    var birthday = new Date(date_of_birth.year, date_of_birth.month, date_of_birth.day);
    var current = Date.now();
    var yearOldMili = current - birthday;
    var yearOld = yearOldMili / (1000 * 3600 * 24 * 365);

    return (yearOld < 18)
        ? false
        : true;
}

export function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

export function groupAndSortTran(data) {
    var list = [];
    var transactions = customGroupBy(data);
    transactions.sort(function (a, b) {
        return b[0] - a[0];
    });
    transactions.forEach(function (element, i) {
        element[0] = formatDateToMonthNameAndDayOfWeek(element[0]);
        list.push(
            element
        );
    });
    return transactions;
}
export function customGroupBy(data) {
    const res = data.reduce((acc, curr) => {
        if (!acc[curr.performed_on]) acc[curr.performed_on] = []; //If this type wasn't previously stored
        acc[curr.performed_on].push(curr);
        return acc;
    }, {});
    var result = Object.keys(res).map(function (key) {
        var year = key.substring(key.length - 4, key.length);
        var month = key.substring(key.length - 7, key.length - 5) - 1
        var day = key.substring(0, key.length - 8);
        var d = new Date(year, month, day);
        return [d, res[key]];
    });
    return result;
}

export function getDateTimeLocalUTC(date) {
    try {
        var timeZoneOffset = new Date().getTimezoneOffset();
        if (date) {
            var dateUTC = new Date(date).getTime() + timeZoneOffset * 60 * 1000;
            return new Date(dateUTC);
        } else {
            return date;
        }
    } catch (ex) {
        console.log("getDateTimeLocalUTC error:", ex, date);
        return date;
    }
}

export function calculateDistanceTimeFrEpoch(epochTime) {
    // var createdDate = new Date(0);
    // createdDate.setUTCSeconds(epochTime);
    // createdDate = getDateTimeLocalUTC(createdDate);
    var createdDate = new Date(epochTime * 1000)
    // createdDate = convertUTCToCRMDateString(createdDate);

    var delta = Math.abs(Date.now() - createdDate) / 1000;

    var week = Math.floor(delta / (86400 * 7));

    var days = Math.floor(delta / 86400);

    var hours = Math.floor(delta / 3600) % 24;

    var minutes = Math.floor(delta / 60) % 60;
    if (week > 1) {
        return formatDateToMonthName(createdDate);
    } else if (week == 1) {
        return '1 week ago';
    } else if (days > 0) {
        if (days == 1)
            return '1 day ago';
        return days + ' days ago';
    } else if (hours > 0) {
        if (hours == 1)
            return '1 hour ago';
        return hours + ' hours ago ';
    } else {
        if (minutes == 1)
            return '1 minute ago'
        return minutes + ' minutes ago';
    }
}


export function formatNumToMMss(totalSec) {
    let min = Math.floor(totalSec / 60) + '';
    let sec = totalSec % 60 + '';
    return (pad(min, 2, '0') + ':' + pad(sec, 2, '0'));
}

//select timer from timersSet
export function startCountDown(timer, callbackFn, oldTimer) {
    stopCountDown(timer);
    if (oldTimer)
        stopCountDown(oldTimer);
    timer.countDown = timer.fromVal;
    timer.timerInstance = setInterval(() => {
        if (timer.countDown <= 0) {
            stopCountDown(timer);
            if (oldTimer)
                stopCountDown(oldTimer);
        }
        else {
            timer.countDown = timer.countDown - timer.decreaseVal;
            if (timer.countDown < 0)
                timer.countDown = 0;
            callbackFn(timer.countDown);
        }
        //console.log(timer.name + ':' + timer.countDown)
    }, timer.interval);
}

export function stopCountDown(timer) {
    if (timer) {
        clearInterval(timer.timerInstance);
        timer.timerInstance = undefined;
        timer.countDown = 0;
    }
}

export const timersSet = {
    otp_card_registration: {
        name: 'OTP_CARD_REGISTRATION',
        interval: 1000, //in millisecond - 1 second 
        fromVal: 40, // in seconds 
        decreaseVal: 1,
        intervalInstance: undefined
    },
}

function pad(val, len, char, padLeft = true) {
    if (!val)
        return val;
    if (val.length >= len)
        return val;
    let str = val;
    for (let i = 0; i < len - val.length; i++) {
        if (padLeft)
            str = char + str;
        else
            str = str + char;
    }
    return str;
}

export function getFormattedDateFullMonth(date_of_birth) {
    if (date_of_birth && date_of_birth.day && date_of_birth.month && date_of_birth.year) {
        var months = createMonth();
        var month = months[date_of_birth.month - 1];
        return date_of_birth.day + ' ' + month + ' ' + date_of_birth.year;
    }

    return "";
}

export function formatDateToMonthNameAndDayOfWeek(value) {
    var date = new Date(value);
    var dayOfWeeks = createDayOfWeek();
    var day = date.getDay() - 1;
    if(day < 0)
        day = dayOfWeeks.length - 1;
    var dayOfWeek = dayOfWeeks[day];
    return dayOfWeek + '. ' + formatDateToShortMonthName(date);
}

export function createDayOfWeek() {
    let days = [
        'Mon'
        , 'Tue'
        , 'Wed'
        , 'Thu'
        , 'Fri'
        , 'Sat'
        , 'Sun'
    ];
    return days;
}
export function padForTime(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

export function maskEmail(email) {
    if(email){
        var index = email.lastIndexOf("@");
        var prefix = email.substring(0, index);
        var postfix = email.substring(index);
    
        var mask = prefix.split('').map(function (o, i) {
            if (i == 0 || i == (index - 1)) {
                return o;
            } else {
                return '*';
            }
        }).join('');
    
        email = mask + postfix;
    }

    return email;
}

export function maskPhone(phone){
    if (phone){
        let strToReplace = phone.substr(2, phone.length).length - 2;
        if(strToReplace){
            phone = phone.substr(0,2) + "*".repeat(strToReplace) + phone.substr(phone.length - 2,phone.length);
        }
    }

    return phone;
}

export function sortByName(n1, n2) {
    if (n1.name > n2.name)
        return 1;
    if (n1.name < n2.name)
        return -1;
    if (n1.name == n2.name)
        return 0;
}

export function getDay(key){
    var days = strings.DAYS;
    return days[key];
}


export function getCategoryByName(categories,targetName){
    let filterCategory = categories.filter(c => {
        return c.name == targetName;
    })
    if(filterCategory && filterCategory.length > 0){
        return filterCategory[0];
    }
    return null;
}