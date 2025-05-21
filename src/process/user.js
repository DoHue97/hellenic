import { actionProfileCreators } from '../reducers/profile';
import { actionAccountCreators } from '../reducers/accounts';
import { actionConfigCreators } from '../reducers/configuration';
import { actionCardCreators } from '../reducers/cards';
import { userService } from "../wsinterface/crmapi/user"
import { getContactId } from "../utils/common"
import { navigateAndReset } from "../utils/util"
import { commonAction } from '../process/common';
import { restsv } from '../wsinterface/crmapi/restsv';
import AppData from '../utils/store'
import { maskPhone, maskEmail } from '../utils/util';
import { crmConfig } from '../config/crmserver';
const errors = require('../utils/errors');
const ErrorCreator = errors.createError();

export const userAction = {
    onLogin,
    //registContactGetOtp,
    getContactInfo,
    getContactId,
    // registNewContact,
    getCards,
    onSignup,
    getAccounts,
    updateAccount,
    getIndustry,
    verifyContactGetOTP,
    verifyOTP,
    verifyCardGetOTP,
    updateContactAllowNotification,
    updateContactEmail,
    addContactEmail,
    addContactDevice,
    deleteContactDevice,
    disableCashback,
    updateContactCategory,
    setAutomaticSpend,
    getOptByToken,
    verifyOTPWithToken,
    updatePreferredLanguage
}

async function onSignup(registerInfo) {
    // console.log("user onSignup: ", registerInfo);
    var addAuthorisationContact = await userService.addAuthorisationContact(registerInfo.email, registerInfo.password);
    // console.log("user onSignup result: ", addAuthorisationContact);
    if (addAuthorisationContact.code == "OK") {
        await restsv.saveToken(addAuthorisationContact.data.access_token, registerInfo.email, registerInfo.password);

        if (await commonAction.checkLogin())
            return ErrorCreator.OK();

        return ErrorCreator.INVALID_LOGIN();
    }
    return ErrorCreator.INVALID_LOGIN();
}

async function getOptByToken() {
    var result = await userService.verifyContactGetOTPWithToken();
    if (result.code === 'TOKEN_EXPIRE')
        return ErrorCreator.CONTACT_VERIFY_CARD_INVALID_404();
    return result;
}


async function verifyContactGetOTP(registerInfo) {
    var verifyContactGetOTP = await userService.verifyContactGetOTP(registerInfo.phone_number,
        registerInfo.card_number,
        getEpochBirthdate(registerInfo.date_of_birth.year, registerInfo.date_of_birth.month, registerInfo.date_of_birth.day).toString());

    if (verifyContactGetOTP.code === 'TOKEN_EXPIRE')
        return ErrorCreator.CONTACT_VERIFY_CARD_INVALID();

    return ErrorCreator.OK();
}

async function verifyCardGetOTP(cardNumber, phoneNumber) {
    var verifyContactGetOTP = await userService.verifyCardGetOTP(cardNumber, phoneNumber);
    // console.log("Process verifyCardGetOTP: ", verifyContactGetOTP);
    if (verifyContactGetOTP.code === 'OK')
        return verifyContactGetOTP;
    else if (verifyContactGetOTP.code === 404)
        return ErrorCreator.CONTACT_VERIFY_CARD_INVALID_404(verifyContactGetOTP.data);
    else if (verifyContactGetOTP.code === 'TOKEN_EXPIRE')
        return ErrorCreator.CONTACT_VERIFY_CARD_INVALID();
    else if (verifyContactGetOTP.code === 'CertPathValidatorException')
        return ErrorCreator.CertPathValidatorException(verifyContactGetOTP.data);
    else
        return ErrorCreator.EXCEPTION();
}

function getEpochBirthdate(year, month, day) {
    var dt = year + "-" + month.toString().padStart(2, "0") + "-" + day.toString().padStart(2, "0");
    return Date.parse(dt) / 1000;
}

async function verifyOTP(registerInfo, auth_otp) {
    // console.log("user verifyOTP: ", registerInfo);
    const verifyOtp = await userService.verifyOTP(registerInfo.verification_code, registerInfo.signup_agree, auth_otp);
    if (verifyOtp.code == "OK") {
        return verifyOtp;
    } else
        return ErrorCreator.CONTACT_VERIFY_OTP_INVALID();
}

async function verifyOTPWithToken(verification_code, auth_otp) {
    const verifyOtp = await userService.verifyOTP(verification_code, true, auth_otp);
    if (verifyOtp.code == "OK") {
        return verifyOtp;
    } else
        return ErrorCreator.CONTACT_VERIFY_OTP_INVALID();
}

async function onLogin(username, password) {
    const result = await userService.getUserToken(username, password);
    // console.log("Process onLogin: ", result);
    if (result.code === 'TOKEN_EXPIRE')
        return ErrorCreator.INVALID_LOGIN();

    return ErrorCreator.OK();
}

// async function registContactGetOtp(registerInfo) {
//     const registContactGetOtp = await userService.registContactGetOtp(registerInfo.phone_number, registerInfo.card_number
//         , registerInfo.date_of_birth.year, registerInfo.date_of_birth.month, registerInfo.date_of_birth.day);
//     console.log("Process registContactGetOtp: ", registContactGetOtp);
//     if (registContactGetOtp != null && registContactGetOtp != "")
//         return "OK";
//     else                                                                             
//         return null;
// }

var isFetchingContactLoaded = false;
async function getContactInfo(isUpdateCategory) {
    var contactID = await getContactId();
    if (contactID) {
        // console.log("loading...contact");
        try {
            if (isFetchingContactLoaded) {
                // console.log("ContactInfo THERE IS ANOTHER FETCHING ALREADY");
                return;
            }
            isFetchingContactLoaded = true;
            await AppData.getStore().dispatch(actionProfileCreators.setRefreshingFlag(true));
            const result = await userService.getContactInfo(contactID);
            if (result.code == 'OK') {
                await AppData.getStore().dispatch(actionProfileCreators.add(createContactData(result.data)));
                //Update category if it's null
                if (isUpdateCategory) {
                    updateContactCategory(result.data);
                }
            } else if (result.code == 'TOKEN_EXPIRE') {
                await commonAction.clearData();
                var navigation = await AppData.getRootNavigation();
                navigateAndReset(navigation, "Login");
            } else {
                // console.log("getContactInfo, load data from reducer")
                await AppData.getStore().dispatch(actionProfileCreators.setRefreshingFlag(false));
            }

            isFetchingContactLoaded = false;
            return result;
        } catch (ex) {
            await AppData.getStore().dispatch(actionProfileCreators.setRefreshingFlag(false));
            console.log("some thing error:", ex);
            isFetchingContactLoaded = false;
            return null;
        }
    } else {
        return null;
    }
}
function createContactData(contact) {
    var data = {
        id: contact.id,
        first_name: contact.first_name,
        last_name: contact.last_name,
        preferred_language_code: contact.preferred_language_code,
        email: "",
        phone_number: "",
        direct_marketing: contact.direct_marketing,
        affiliate_marketing: contact.affiliate_marketing,
        rewards: contact.rewards
    }
    if (contact.emails && contact.emails.length > 0) {
        var email = contact.emails[0].email_address;
        if (email) {
            email = maskEmail(email);
            data.email = email
        }
    }
    if (contact.phones && contact.phones.length > 0) {
        var phone = contact.phones[0].number;
        if (phone) {
            phone = maskPhone(phone);
            data.phone_number = phone;
        }

    }
    return data;
}
var isFetchingCardsLoaded = false;
async function getCards() {
    var contactID = await getContactId();
    if (contactID) {
        try {
            if (isFetchingCardsLoaded) {
                // console.log("getCards in another fetching");
                return;
            }

            isFetchingCardsLoaded = true;
            await AppData.getStore().dispatch(actionCardCreators.setRefreshingFlag(true));
            const result = await userService.getCards(contactID);
            if (result.code == 'OK')

                await AppData.getStore().dispatch(actionCardCreators.add(createCardData(result.data.content)));
            else if (result.code == 'TOKEN_EXPIRE') {
                await commonAction.clearData();
                var navigation = await AppData.getRootNavigation();
                navigateAndReset(navigation, "Login");
            } else
                await AppData.getStore().dispatch(actionCardCreators.setRefreshingFlag(false));

            isFetchingCardsLoaded = false;
            return result;
        } catch (ex) {
            await AppData.getStore().dispatch(actionCardCreators.setRefreshingFlag(false));
            console.log("getCards error:", ex);
            isFetchingCardsLoaded = false;
            return null;
        }
    } else {
        return null;
    }
}
function createCardData(cards) {
    var data = [];
    if (cards && cards.length > 0) {
        for (var i = 0; i < cards.length; i++) {
            var cardInfo = cards[i].card;
            if (cardInfo) {
                var card = {
                    id: cards[i].id,
                    classification_name: cardInfo.classification && cardInfo.classification.name ? cardInfo.classification.name : "",
                    card_number: cardInfo.card_number,
                    brand: cardInfo.brand,
                    first6: cardInfo.first6,
                    last4: cardInfo.last4,
                    funding_type: cardInfo.funding_type
                }
                data.push(card);
            }
        }
    }
    cards.content = data
    return cards;
}
// async function registNewContact(registerInfo) {
//     if (await onLogin(null, null) == "OK") {
//         const registContactGetOtp = await userService.registContactGetOtp(registerInfo.phone_number, registerInfo.card_number
//             , registerInfo.date_of_birth.year, registerInfo.date_of_birth.month, registerInfo.date_of_birth.day);
//         console.log("Process registContactGetOtp: ", registContactGetOtp);
//         if (registContactGetOtp != null && registContactGetOtp != "")
//             return "OK";
//         else
//             return null;
//     }
// }

var isFetchingAccountsLoaded = false;
async function getAccounts() {
    var contactID = await getContactId();
    if (contactID) {
        try {
            if (isFetchingAccountsLoaded) {
                // console.log("get Accounts in another fetching");
                return;
            }
            isFetchingAccountsLoaded = true;
            await AppData.getStore().dispatch(actionAccountCreators.setRefreshingFlag(true));

            const result = await userService.getAccounts(contactID);
            if (result.code == 'OK' && result.data.content[0] && result.data.content[0].id) {
                const accountDetailResult = await userService.getDetailAccount(result.data.content[0].id);
                if (accountDetailResult.code == 'OK') {
                    await AppData.getStore().dispatch(actionAccountCreators.add(createAccountData(accountDetailResult.data)));
                } else {
                    await AppData.getStore().dispatch(actionAccountCreators.setRefreshingFlag(false));
                }
            } else if (result.code == 'TOKEN_EXPIRE') {
                await commonAction.clearData();
                var navigation = await AppData.getRootNavigation();
                navigateAndReset(navigation, "Login");
            } else
                await AppData.getStore().dispatch(actionAccountCreators.setRefreshingFlag(false));
            isFetchingAccountsLoaded = false;
            return result;
        } catch (ex) {
            await AppData.getStore().dispatch(actionAccountCreators.setRefreshingFlag(false));
            console.log("get Accounts error:", ex);
            isFetchingAccountsLoaded = false;
            return null;
        }
    } else {
        return null;
    }
}

function createAccountData(account) {
    var data = {
        id: account.id,
        rewards: {
            enable_automatic_spend: account.rewards.enable_automatic_spend,
            minimum_wallet_balance: account.rewards.minimum_wallet_balance,
            preferred_payment_method_id: account.rewards.preferred_payment_method_id,
        }
    }
    return data;
}

async function updateAccount(accid, account_status, spend_preferences, next_purchase_spend_preference) {
    const updateResult = await userService.updateAccount(accid, account_status, spend_preferences, next_purchase_spend_preference);
    if (updateResult.code == 'OK') {
        const accountDetailResult = await userService.getDetailAccount(updateResult.data.id);
        // console.log('user updateAccout accountDetailResult: ', accountDetailResult);
        if (accountDetailResult.code == 'OK') {
            await AppData.getStore().dispatch(actionAccountCreators.add(accountDetailResult.data));
        } else {
            await AppData.getStore().dispatch(actionAccountCreators.setRefreshingFlag(false));
        }
    }

    return updateResult;
}

async function getIndustry() {
    try {
        const result = await userService.getIndustry();
        if (result.code == 'OK') {
            await AppData.getStore().dispatch(actionConfigCreators.addIndustry(result.data.content));
        } else if (result.code == 'TOKEN_EXPIRE') {
            await commonAction.clearData();
            var navigation = await AppData.getRootNavigation();
            navigateAndReset(navigation, "Login");
        } else
            return result;
    } catch (ex) {
        console.log("get Industry error:", ex);
        return null;
    }
}

async function updateContactAllowNotification(allow) {
    var contactID = await getContactId();
    if (contactID) {
        let reqBody = {};
        reqBody.direct_marketing = allow;
        reqBody.affiliate_marketing = allow;
        // console.log('user process updateContactAllowNotification request: ', reqBody);
        const updateResult = await userService.updateContact(contactID, reqBody);
        // console.log('user process updateContactAllowNotification response: ', updateResult);
        if (updateResult.code == 'OK') {
            getContactInfo();
            return updateResult;
        } else if (updateResult.code == 'TOKEN_EXPIRE') {
            await commonAction.clearData();
            var navigation = await AppData.getRootNavigation();
            navigateAndReset(navigation, "Login");
        } else {
            return null;
        }
    }
}

async function addContactEmail(email) {
    var contactID = await getContactId();
    if (contactID) {
        const result = await userService.addContactEmail(contactID, email);
        if (result.code == 'OK') {
            // getContactInfo();
            return result;
        } else {
            return null;
        }
    }
}

async function updateContactEmail(email, emailId) {
    var contactID = await getContactId();
    if (contactID) {
        const result = await userService.updateContactEmail(contactID, email, emailId);
        if (result.code == 'OK') {
            getContactInfo();
            return result;
        } else if (result.code == 'TOKEN_EXPIRE') {
            await commonAction.clearData();
            var navigation = await AppData.getRootNavigation();
            navigateAndReset(navigation, "Login");
        } else {
            return null;
        }
    }
}

async function addContactDevice(serialNumber, registrationToken, registrationType) {
    var contactID = await getContactId();
    if (contactID) {
        const result = await userService.addContactDevice(contactID, serialNumber, registrationToken, registrationType);
        if (result.code == 'OK') {
            return result;
        } else {
            return result;
        }
    }
}

async function deleteContactDevice(serialNumber) {
    var contactID = await getContactId();
    if (contactID) {
        var listContactDevice = await userService.listContactDevice(contactID);
        if (listContactDevice.code == 'OK') {
            var contactDevice = listContactDevice.data && listContactDevice.data.content.length > 0 ?
                listContactDevice.data.content.filter(ct => (ct.serial_number === serialNumber)) : [];
            if (contactDevice && contactDevice.length > 0) {
                var ctToDelete = contactDevice[0];
                if (ctToDelete) {
                    const result = await userService.deleteContactDevice(contactID, ctToDelete.device_id);
                    if (result.code == 'OK') {
                        return result;
                    } else {
                        return null;
                    }
                }
            }
        }
    }

    return null;
}

async function disableCashback() {
    const account = await this.getAccounts();
    if (account && account.code == 'OK' && account.data && account.data.content.length > 0 && account.data.content[0] && account.data.content[0].id) {
        var spend_preferences = {
            enable_automatic_spend: false
        }

        var result = await userAction.updateAccount(account.data.content[0].id, null, spend_preferences, null, null);
        return result;
    } else
        return null;
}

async function updateContactCategory(contact) {
    try {
        var isCategory = contact.category && contact.category.code === 'RTA';
        var isCustomField = false;
        var custom_fields = contact.custom_fields;
        var categoryField = [];
        if (custom_fields && custom_fields.length > 0) {
            categoryField = custom_fields.find(field => {
                return field.key === 'CATEGORY_UPDATED_ON'
            })
        }
        if (categoryField && categoryField.key === 'CATEGORY_UPDATED_ON') {
            isCustomField = true;
        }
        if (!isCategory || !isCustomField)
            userService.updateContactCategoryRTA(contact.id, isCategory, isCustomField);
    } catch (error) {
        console.log("updateContactCategory exception:", error);
    }
}

async function setAutomaticSpend(cardNumber,accounts,cards){
    try{
        var cardId = findNonBusinessCardID(cardNumber,cards);
        var preferred_payment_method_id = accounts.account && accounts.account.rewards && accounts.account.rewards.preferred_payment_method_id ? accounts.account.rewards.preferred_payment_method_id : null;
        if(cardId && !preferred_payment_method_id){ 
            var spend_preferences = {
                enable_automatic_spend : true,
                minimum_wallet_balance: 5,
                preferred_payment_method_id: cardId       
            }
            return await userAction.updateAccount(accounts.account.id, null, spend_preferences, null, null);
        }
    }catch(error){
        console.log(" setAutomaticSpend exception: ",error);
        return error;
    }
}

function findNonBusinessCardID(cardInputed,cards){
    if(!cardInputed)
        return null;
    var cardFirst6 = cardInputed && cardInputed.length >= 6 ? cardInputed.substr(0, 6) : "";
    var cardLast4 = cardInputed && cardInputed.length >= 4 ? cardInputed.substr(cardInputed.length - 4, cardInputed.length) : "";
    if (cards && cards.length > 0) {
        var cardBusiness = crmConfig.businessCard;
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i].card;
            if (card.first6 && !cardBusiness.includes(card.first6)) {
                if (card.first6 === cardFirst6 && card.last4 === cardLast4) {
                    return cards[i].id
                }
            }
        }          
    }
    return null;
}


async function updatePreferredLanguage(language) {
    try {
        var contactID = await getContactId();
        const result = userService.updatePreferredLanguage(language,contactID);
        return result;
    } catch (error) {
        console.log("updateContactCategory exception:", error);
        return null;
    }
}
