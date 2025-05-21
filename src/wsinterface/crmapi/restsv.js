import { getData, saveDataIntoAsyncStore, logOut, fetchCommon, forceLogOut,diffDateInMinute } from '../../utils/common'
import { crmConfig } from '../../config/crmserver';
import { Platform } from 'react-native';
import { datadog } from './datadog';

var jwtDecode = require('jwt-decode');

const JWT_TOKEN_OBJ = 'JWT_TOKEN_OBJ';
const USER_TOKEN = 'USER_TOKEN';
const PROFILE = 'PROFILE';
var REFRESH_TOKEN_STATUS = null;
var _token_refreshed_at;
export const restsv = {
	post,
	verifyEmail,
	put,
	get,
	deleteData,
	fetchHandler,
	getUserToken,
	saveToken,
	getToken,
	getImage,
	refreshToken,
	postByApikey
}

async function getUserToken(params) {
	const response = await post('contacts/authenticate', params);
	if (response.code === "OK") {
		var token = response.data.access_token;
		if (token) {
			await saveToken(token, params.username, params.password);
		}
	}
	return response
}

async function saveToken(jwtToken, jwtRefreshToken, tokenExpirationDate) {
	//version1: jwtRefreshToken=username, tokenExpirationDate=password
	var tokenData = {
		token: jwtToken,
		lastUsedDateTime: new Date(),
		refreshToken: jwtRefreshToken,
		tokenExpirationDate: tokenExpirationDate
	}
	// console.log("restsv saveToken tokenData: ", tokenData);
	await saveDataIntoAsyncStore(USER_TOKEN, JSON.stringify(tokenData));
	// var jwtTkdecoded = jwtDecode(jwtToken);
	// // console.log("restsv saveToken jwtTkdecoded: ", jwtTkdecoded);
	// if (jwtTkdecoded) {
	// 	await saveDataIntoAsyncStore(JWT_TOKEN_OBJ, JSON.stringify(jwtTkdecoded));
	// 	var ciid = jwtTkdecoded.ciid;
	// 	var path = "contacts/" + ciid;
	// 	const response = await get(path, null, 'token');
	// 	if (response && response.code === 'OK') {
	// 		var profileName = {
	// 			first_name: response.data.first_name,
	// 			last_name: response.data.last_name,
	// 		}
	// 		await saveDataIntoAsyncStore(PROFILE, JSON.stringify(profileName));
	// 	}
	// 	return true;
	// }
	return true;
}

async function getToken() {
	var crmToken = await getData("USER_TOKEN");
	// console.log('restsv getToken: ', crmToken);
	if (crmToken && crmToken.token)
		return crmToken.token;

	return { code: 'TOKEN_EXPIRE' };
}

function initGetOptions(token) {
	var request = {};
	request.headers = {
		'User-Agent': 'request',
		'Content-Type': 'application/json; charset=utf-8',
		'Cache-Control': 'no-cache, no-store, must-revalidate',
		'Pragma': 'no-cache',
		'Expires': Platform.OS == 'android' ? "0" : 0
	};
	request.method = "GET";
	return request;
}

async function get(path, params, type, token) {
	// console.log('GET start: ', params);
	var options = await initGetOptions();
	// console.log("get options:", options);
	if (type === 'token') {
		if (!token) {
			token = await getToken();
		}
		options.headers['Authorization'] = 'Bearer ' + token;
	} else
		options.headers['api_key'] = crmConfig.crmApiKey;
	var response = await fetchHandler(crmConfig.crmUrlApi + path, options);
	return response;
}

async function initPost(body) {
	var request = {};
	request.headers = {
		Accept: 'application/json',
		'User-Agent': 'request',
		'Content-Type': 'application/json; charset=utf-8',
		'Cache-Control': 'no-cache, no-store, must-revalidate',
		'Pragma': 'no-cache',
		'Expires': Platform.OS == 'android' ? "0" : 0
	};

	request.body = JSON.stringify(body);
	request.method = "POST";
	// console.log("initPost: ", request);
	return request;
}

async function post(path, payload, type) {
	// console.log('POST start: ');
	var options = await initPost(payload);
	if (type === 'token') {
		var token = await getToken();

		options.headers['Authorization'] = 'Bearer ' + token;
	} else
		options.headers['api_key'] = crmConfig.crmApiKey;

	// console.log("restsv post: ", crmConfig.crmUrlApi + path);
	// console.log("options:",options);
	var response = await fetchHandler(crmConfig.crmUrlApi + path, options);
	// console.log("restsv post - Response: ", response);
	return response;
}


async function verifyEmail(verifyUrl) {
	let response;
	try {
		var options = initGetOptions();
		response = await fetchCommon(verifyUrl, options);
		if (response.status == '200') {
			return { code: "OK", data: await response.text() };
		} else
			return { code: response.status, data: {} };
	} catch (ex) {
		return { code: "CLIENT_UNEXPECTED_ISSUE", data: ex };
	}
}

function initPut(reqBody) {
	var options = {};
	options.headers = {
		'User-Agent': 'request',
		'Content-Type': 'application/json; charset=utf-8',
		'Cache-Control': 'no-cache, no-store, must-revalidate',
		'Pragma': 'no-cache',
		'Expires': Platform.OS == 'android' ? "0" : 0
	};

	options.body = JSON.stringify(reqBody);
	options.method = "PUT";
	// console.log("initPut: ", options);
	return options;
}

export async function put(path, payload, type) {
	// console.log('PUT start: ');
	var options = initPut(payload);
	if (type === 'token') {
		var token = await getToken();
		options.headers['Authorization'] = 'Bearer ' + token;
	} else
		options.headers['api_key'] = crmConfig.crmApiKey;
	var response = await fetchHandler(crmConfig.crmUrlApi + path, options);
	return response;
}

async function fetchHandler(url, options) {
	var response = {};
	try {
		console.log("REQUEST :", url, "- options:", options);
		response = await fetchCommon(url, options);
        datadog.sendLogs('info', 'Initiate API Call', {req: {requestURL: url}});
		// console.log("RESPONSE url:", url, '- Result', response);
		// if (url.startsWith('https://pr6.crm.com/self-service/v1/reward_offers')) {
		// 	response.status = 401;
		// }
		// response.status = 401;
		if (response.status == '200') {
			var body = await response.json();
			datadog.sendLogs('info', 'Successful API Call', {req: {requestURL: url}});
			return { code: "OK", data: body };

		} else if (response.status == '401') {
			let now = new Date();
			console.log(now + 'FetchHandler token expired. REFRESH_TOKEN_STATUS = ' + REFRESH_TOKEN_STATUS + ' Last refreshed at: ' + _token_refreshed_at)
			datadog.sendLogs('info', 'FetchHandler token expired', {info: {refresh_token_status: REFRESH_TOKEN_STATUS,last_refresed_at: _token_refreshed_at}});
			let minutesAgo = 0;
			if (_token_refreshed_at)
			{
				minutesAgo = diffDateInMinute(now,_token_refreshed_at); 
				console.log('FetchHandler token expired. REFRESH_TOKEN_STATUS = ' + REFRESH_TOKEN_STATUS + ' minuteAgo ' + minutesAgo)
				datadog.sendLogs('info', 'FetchHandler token expired', {info: {refresh_token_status: REFRESH_TOKEN_STATUS,minute_ago: minutesAgo}});
			}
			//refresh token
			if (!REFRESH_TOKEN_STATUS || REFRESH_TOKEN_STATUS=='FAILED_UNKNOW' || (REFRESH_TOKEN_STATUS == 'COMPLETED' && minutesAgo > 10) ) {
				var result = await refreshToken(url);
				if (result && result.code == 'OK') {
					options.headers = { ...options.headers, Authorization: "Bearer " + result.data.token };
					options = { ...options, headers: options.headers };
					response = await fetch(url, options);
					if (response.status == '200') {
						var body = await response.json();
						return { code: "OK", data: body };
					}
					return { code: response.status, data: await response.text() };
				}
			} else {
				var token = null;
				for (var i = 0; i < 5; i++) {
					if (REFRESH_TOKEN_STATUS == 'COMPLETED') {
						token = await getToken();
						break;
					}else if(REFRESH_TOKEN_STATUS == 'UNAUTHORIZED' || REFRESH_TOKEN_STATUS == 'FAILED'){
						break;
					}
					await wait(1000);
				}
				if (token && REFRESH_TOKEN_STATUS == 'COMPLETED') {
					options.headers = { ...options.headers, Authorization: "Bearer " + token };
					options = { ...options, headers: options.headers };
					response = await fetch(url, options);
					if (response.status == '200') {
						var body = await response.json();
						return { code: "OK", data: body };
					}
					return { code: response.status, data: await response.text() };
				}else if(REFRESH_TOKEN_STATUS == 'FAILED'){
					datadog.sendLogs('info', 'FetchHandler token expired',{result: {status:REFRESH_TOKEN_STATUS,desc:"Logout"}});
					logOut();
				}else if(REFRESH_TOKEN_STATUS == 'UNAUTHORIZED'){
					datadog.sendLogs('info', 'FetchHandler token expired',{result: {status:REFRESH_TOKEN_STATUS,desc:"Force logout"}});
					forceLogOut();
				}
			}
		} else if (response.status == '526') {
			datadog.sendLogs('info', 'FetchHandler token expired',{result: {status:response.status,code: await response.text(),desc:"logout"}});
			logOut();
		}
		else
			return { code: response.status, data: await response.text() };

	} catch (ex) {
		console.log("fetchHandler ex:", ex);
		if ((ex.message && ex.message.includes('The certificate for this server is invalid')) || ex.includes('javax.net.ssl.SSLHandshakeException')){ 
			datadog.sendLogs('info', 'The certificate for this server is invalid',{result: {status:ex,desc:"logout"}});
			logOut();
		}
		return { code: "CLIENT_UNEXPECTED_ISSUE", data: ex };
	}
}
async function wait(ms) {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}
async function refreshToken(url) {
	var crmToken = await getData("USER_TOKEN");
	if (crmToken && crmToken.refreshToken) {
		REFRESH_TOKEN_STATUS = "INPROGRESS"
		datadog.sendLogs('info', 'START Refresh Token');
		console.log("AAAAAAAAAAAAAAAAAAAAAA START refreshToken:");
		// crmToken.refreshToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsbmciOiJFTkciLCJvcmciOiJjcm0iLCJncm91cGlkIjoiMSIsIm91biI6IjdFOThCRURFNUVCNDQ1ODZCNkI0RkM5MUZGOTVFNTY4Iiwib3RwIjp0cnVlLCJ1c2Vycm9sZSI6IkNPTlNVTUVSIiwidHlwZSI6IkNPTlNVTUVSIiwiY2lpZCI6IkpSMTIzNDU2NyIsInVwcCI6IkVGMUE4NkZERTM0RDRGMkFCOEY2RUI3QUY2MkQwMUVEIiwidGltZXoiOiJFdXJvcGUvQXRoZW5zIiwiZXhwIjoxNjIyNjE5Nzg3MDAwLCJhcHBsaWNhdGlvbklkIjoiQjNGNEVDRURCNkM0NDBFNkFDMkUwOEI5NEUwMENDMTEifQ.ucmAPazwEJbh5gcWyatdDjXrxUiTe3CUK-6BhCGFeV4';
		let response = await postRefreshToken(crmToken.refreshToken);
		// response.code = '401'
		if (response.code === "OK") {
			REFRESH_TOKEN_STATUS = "COMPLETED"
			_token_refreshed_at = new Date();
			AppData.setRefreshTokenStatus(REFRESH_TOKEN_STATUS);
			datadog.sendLogs('info', 'END Refresh Token',{result: {status:REFRESH_TOKEN_STATUS}});
			if (response.data && response.data.access_token) {
				await saveToken(response.data.access_token, response.data.refresh_token, response.data.exp);
				return { code: 'OK', data: await getData("USER_TOKEN") };
			}
		}
		else if (response.code == '401' || response.code == '404') {
			REFRESH_TOKEN_STATUS = "UNAUTHORIZED"
			AppData.setRefreshTokenStatus(REFRESH_TOKEN_STATUS);
			datadog.sendLogs('info', 'END Refresh Token',{result: {status:REFRESH_TOKEN_STATUS,code:response.code,desc:"force logout"}});
			forceLogOut();
		} else {
			REFRESH_TOKEN_STATUS = "FAILED_UNKNOW"
			datadog.sendLogs('info', 'END Refresh Token',{result: {status:REFRESH_TOKEN_STATUS,code:response.code}});
			AppData.setRefreshTokenStatus(REFRESH_TOKEN_STATUS);
			// logOut();
		}
	} else {
		REFRESH_TOKEN_STATUS = "FAILED"
		AppData.setRefreshTokenStatus(REFRESH_TOKEN_STATUS);
		datadog.sendLogs('info', 'END Refresh Token',{result: {status:REFRESH_TOKEN_STATUS,code:response.code,desc:"refresh token null - logout"}});
		logOut();
	}
}

async function triggerChange() {
	await refreshToken();
	await clearTimeout();
}

async function postRefreshToken(refreshToken) {
	var request = {};
	request.headers = {
		Accept: 'application/json',
		'User-Agent': 'request',
		'Content-Type': 'application/json; charset=utf-8',
		'Cache-Control': 'no-cache, no-store, must-revalidate',
		'Pragma': 'no-cache',
		'Expires': Platform.OS == 'android' ? "0" : 0,
		'refresh_token': refreshToken,
		'api_key': crmConfig.crmApiKey
	};
	request.method = "POST";
	request.body = JSON.stringify({});
	let r = Math.random().toString(36).substring(7);
	let refreshTokenLog= {
		url: crmConfig.crmUrlApi + 'contacts/refresh',
		request: request
	}
	var response = await fetchHandlerByApikey(crmConfig.crmUrlApi + 'contacts/refresh', request);
	refreshTokenLog.response = response;
	AppData.setRefreshTokenLog(JSON.stringify(refreshTokenLog));
	if (response)
		return response;
	return { code: 'TOKEN_EXPIRE', data: response };
}

//Only use for call api by api_key
async function postByApikey(path, payload, isLogin) {
	// console.log('POST start: ');
	var options = await initPost(payload);
	options.headers['api_key'] = crmConfig.crmApiKey;
	console.log("restsv options: ", options);
	console.log("restsv post: ", crmConfig.crmUrlApi + path);
	var response = await fetchHandlerByApikey(crmConfig.crmUrlApi + path, options, isLogin);
	console.log("restsv post - Response: ", response);
	return response;
}

async function fetchHandlerByApikey(url, options, isLogin) {
	var response = {};
	try {
		response = await fetchCommon(url, options)
		if (response.status == 200) {
			try {
				var body = await response.json();
				return { code: "OK", data: body };
			} catch (error) {
				if (isLogin) {
					datadog.sendLogs('error', 'login fail',{data: await response.text()});
					return { code: 404, data: "contactnotfound" };
				}
				return { code: "CLIENT_UNEXPECTED_ISSUE", data: error };
			}
		} else if (response.status == 526){ 
			return { code: "CertPathValidatorException", data: response.data };
		}else{
			datadog.sendLogs('error', 'login fail',{data: await response.text()});
			return { code: response.status, data: await response.text() };
		}
		
	} catch (ex) {
		return { code: "CLIENT_UNEXPECTED_ISSUE", data: ex };
	}
}

function createDeleteOption(payload) {
	var options = {};
	options.headers = {
		'User-Agent': 'request',
		'Content-Type': 'application/json; charset=utf-8',
		'Cache-Control': 'no-cache, no-store, must-revalidate',
		'Pragma': 'no-cache',
		'Expires': Platform.OS == 'android' ? "0" : 0
	};
	if (payload != null && payload != "") {
		options.body = JSON.stringify(payload);
	}
	options.method = "DELETE";
	return options;
}

async function deleteData(path, payload, type) {
	// console.log('DELETE start: ');
	var options = await createDeleteOption(payload);
	if (type === 'token') {
		var token = await getToken();
		options.headers['Authorization'] = 'Bearer ' + token;
	} else
		options.headers['api_key'] = crmConfig.crmApiKey;
	// console.log("DELETE path:  crmConfig.crmUrlApi + path:",crmConfig.crmUrlApi + path);
	// console.log("DELETE path:  crmConfig.crmUrlApi + options:", options);
	var response = await fetchHandler(crmConfig.crmUrlApi + path, options);
	return response;
}


async function getImage(url) {
	var request = {};
	request.headers = {
		'Content-Type': 'application/json',
	};
	request.method = "GET";
	// console.log("getImage url:",url);
	var response = await fetchHandler(url, request);
	return response;
}