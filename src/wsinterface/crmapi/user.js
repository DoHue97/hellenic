import { restsv, crmConfig } from '../crmapi/restsv';
import { getContactId, getData } from "../../utils/common";

var sha256 = require('js-sha256');

export const userService = {
	getUserToken,
	getContactInfo,
	createAccount,
	updateAccount,
	getAccounts,
	getDetailAccount,
	getCards,
	newContact,
	getListPayment,
	addPaymentMethod,
	updatePaymentMethod,
	removePaymentMethod,
	getIndustry,
	addAuthorisationContact,
	verifyContactGetOTP,
	verifyOTP,
	verifyContactGetOTPWithToken,
	updateContactCategoryRTA,
	verifyCardGetOTP,
	updateContact,
	addContactEmail,
	updateContactEmail,
	addContactDevice,
	deleteContactDevice,
	listContactDevice,
	clearSession,
	updateContactCategory,
	verifiEmail,
	updatePreferredLanguage
}

async function getUserToken(username, password) {
	const result = await restsv.getUserToken({ username, password });

	return result;
}

async function addAuthorisationContact(userName, password) {
	let reqBody = {
		username: userName,
		password: password
	};

	var response = null;
	var contactId = await getContactId();
	if (contactId)
		response = await restsv.post('contacts/' + contactId + '/credentials', reqBody, 'token');

	return response
}

async function verifyCardGetOTP(cardNumber, phoneNumber) {
	// console.log('verifyCardGetOTP: ', (sha256(cardNumber)).toUpperCase());
	let reqBody = {
		send_method: "SMS",
		credentials: [
			{
				name: "CARD",
				value: (sha256(cardNumber)).toUpperCase()
			},
			{
				name: "PHONE",
				value: phoneNumber
			}
		]
	};
	const response = await restsv.postByApikey('contacts/validate', reqBody, true);
	return response
}

async function verifyContactGetOTP(phone, cardNumber, birthDate) {
	let reqBody = {
		send_method: "SMS",
		credentials: [
			{
				name: "CARD",
				value: (sha256(cardNumber)).toUpperCase()
			},
			{
				name: "BIRTHDATE",
				value: birthDate
			},
			{
				name: "PHONE",
				value: phone
			}
		]
	};
	// console.log("verifyContactGetOTP request body: ", reqBody);	
	const response = await restsv.postByApikey('contacts/validate', reqBody);
	// console.log("verifyContactGetOTP: ", response);	
	return response
}

async function verifyContactGetOTPWithToken() {
	var crmToken = await getData("USER_TOKEN");
	let reqBody = {
		send_method: "SMS",
		credentials: [
			{
				name: "REFRESH_TOKEN",
				value: crmToken.refreshToken
			},
		]
	};
	// console.log("verifyContactGetOTP request body: ", reqBody);	
	const response = await restsv.postByApikey('contacts/validate', reqBody);
	// console.log("verifyContactGetOTP: ", response);	
	return response
}

async function verifyOTP(otp, rememberme, auth_otp) {
	// console.log('verifyOTP rememberme: ', rememberme);
	let reqBody = {
		code: otp,
		remember_me: rememberme,
		auth_otp: auth_otp
	};
	// console.log("verifyOTP req: ", reqBody);	
	const response = await restsv.postByApikey('contacts/validate-otp', reqBody);
	// console.log("verifyOTP response: ", response);	
	if (response.code == "OK")
		restsv.saveToken(response.data.access_token, response.data.refresh_token, response.data.exp);

	return response
}

async function newContact(phoneCountryCode, phone, email, password, firstName, lastName) {
	let reqBody = {
		first_name: firstName,
		last_name: lastName,
		email: email,
		password: password,
		phone_country_code: phoneCountryCode,//"CY"
		phone_number: phone,
		service_acceptance: true
	};

	//const response = await restsv.post('contacts/otp', reqBody);	
	const response = await restsv.postByApikey('contacts/register', reqBody);
	// console.log("newContact: ", response);

	return response
}

async function getContactInfo(ciid, token) {
	var path = "contacts/" + ciid;
	path = path + '?include_rewards=OVERALL';
	const response = await restsv.get(path, null, 'token', token);
	// console.log('user api getContactInfo: ', response);
	return response
}

async function updateContactCategoryRTA(ciid, isCategory, isCustomField) {
	var body = {}
	if (!isCategory) {
		body.category = { code: 'RTA' }
	}
	if (!isCustomField) {
		body.custom_fields = [{
			key: "CATEGORY_UPDATED_ON",
			value: Math.floor(new Date().getTime() / 1000.0)
		}]
	}
	const response = await restsv.put('contacts/' + ciid, body, 'token');
	return response;
}

async function getAccounts(ciid) {
	var path = "contacts/" + ciid + "/accounts";
	const response = await restsv.get(path, null, 'token');

	return response
}

async function getDetailAccount(accountID) {
	var path = "accounts/" + accountID;
	const response = await restsv.get(path, null, 'token');
	return response
}

async function getCards(ciid) {
	var path = "contacts/" + ciid + "/payment_methods";
	const response = await restsv.get(path, null, 'token');
	return response
}

async function createAccount(ciid, accName, currencyID, isPrimary) {
	let reqBody = {
		name: accName,
		currency_id: currencyID,
		is_primary: isPrimary
	};

	const response = await restsv.post('contacts/' + ciid + '/accounts', reqBody);
	// console.log("PENDING Create Account: ", response);

	return response
}

async function updateAccount(accid, status, spend_preferences, next_purchase_spend_preference) {
	let reqBody = {};
	if (status) {
		reqBody.status = status;
	}
	if (spend_preferences) {
		reqBody.spend_preferences = spend_preferences;
	}
	if (next_purchase_spend_preference) {
		reqBody.next_purchase_spend_preference = next_purchase_spend_preference;
	}
	// console.log("user api Update Account request: ", reqBody);
	const response = await restsv.put('accounts/' + accid, reqBody, 'token');
	// console.log("user api Update Account: ", response);

	return response
}

async function getListPayment(ciid) {
	var path = "contacts/" + ciid + '/payment_methods';
	const response = await restsv.get(path, null, 'token');
	return response
}

async function addPaymentMethod(ciid, accounts, paymentType, bank_details, card, payment_gateway_token, notes) {
	let reqBody = {
		accounts: accounts,
		payment_method_type: paymentType,
		bank_details: bank_details,
		card: card,
		payment_gateway_token: payment_gateway_token,
		notes: notes
	};

	const response = await restsv.post('contacts/' + ciid + '/payment_methods', reqBody);
	// console.log("Add Payment Method: ", response);

	return response
}

async function updatePaymentMethod(ciid, paymentMethodID, bankDetail, card, payment_gateway_token, notes) {
	let reqBody = {
		bank_details: bankDetail,
		card: card,
		payment_gateway_token: payment_gateway_token,
		notes: notes
	};
	const response = await restsv.put('contacts/' + ciid + '/payment_methods/' + paymentMethodID, reqBody, 'token');
	// console.log("Update Payment Method: ", response);
	return response
}

async function removePaymentMethod(ciid, paymentMethodID) {
	const response = await restsv.deleteData('contacts/' + ciid + '/payment_methods/' + paymentMethodID, null, 'token');
	// console.log("Remove Payment Method: ", response);
	return response
}

async function getIndustry() {
	var path = "industries";
	const response = await restsv.get(path, null, 'token');
	return response
}

async function updateContact(ciid, reqBody) {
	// console.log('user updateContact request ciid=' + ciid + ', reqBody: ', reqBody);
	const response = await restsv.put('contacts/' + ciid, reqBody, 'token');
	// console.log('user updateContact response: ', response);
	return response
}

async function addContactEmail(ciid, email) {
	let reqBody = {
		email_type: "PERSONAL",
		is_primary: true,
		email_address: email,
		email_verification: true
	};
	// console.log('user addContactEmail request: ', reqBody);
	const response = await restsv.post('contacts/' + ciid + '/emails', reqBody, 'token');
	// console.log('user addContactEmail response: ', response);
	return response
}

async function updateContactEmail(ciid, email, emailId) {
	let reqBody = {
		email_type: "PERSONAL",
		is_primary: true,
		email_address: email,
		email_verification: false
	};
	// console.log('user updateContactEmail request: ', reqBody);
	const response = await restsv.put('contacts/' + ciid + '/emails/' + emailId, reqBody, 'token');
	// console.log('user updateContactEmail response: ', response);
	return response
}

async function addContactDevice(ciid, serialNumber, registrationToken, registrationType) {
	let reqBody = {
		serial_number: serialNumber,
		registration_type: registrationType,
		registration_token: registrationToken
	};
	const response = await restsv.post('contacts/' + ciid + '/devices', reqBody, 'token');
	return response
}

async function deleteContactDevice(ciid, serialNumber) {
	const response = await restsv.deleteData('contacts/' + ciid + '/devices/' + serialNumber, null, 'token');
	return response
}

async function listContactDevice(ciid) {
	const response = await restsv.get('contacts/' + ciid + '/devices', null, 'token');
	return response
}

async function clearSession(ciid) {
	const response = await restsv.post('contacts/' + ciid + '/sign_out', {}, 'token');
	return response;
}

async function updateContactCategory(ciid) {
	let body = {
		custom_fields: [{
			key: "CATEGORY_UPDATED_ON",
			value: Math.floor(new Date().getTime() / 1000.0)
		}]
	}

	const response = await restsv.put('contacts/' + ciid, body, 'token');
	// console.log("user updateContactCategoryRTA: ", response);	
	return response;
}

async function verifiEmail(url){
	const response = await restsv.verifyEmail(url);
	// console.log("user updateContactCategoryRTA: ", response);	
	return response;
}

async function updatePreferredLanguage(language,ciid){
	let body = {
		preferred_language_code: language
	}
	const response = await restsv.put('contacts/' + ciid, body, 'token');
	return response;
}