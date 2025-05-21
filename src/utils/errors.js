import { strings } from '../translations'

module.exports = {
  createError: createError
}

function createError() {
  return ErrorCreator;
}
const ErrorCreator = {
  EXCEPTION: (data = '') => {
    return { httpCode: 500, code: 'EXCEPTION', title: strings.ERROR, desc: 'System got an issue while processing your request', data: data };
  },
  CertPathValidatorException: (verify_token) => {
    return {httpCode: 404, code: 'CertPathValidatorException',title: strings.ERROR, desc: 'The certificate for this server is invalid ', data: verify_token}
  },
  USER_ACCOUNT_NOT_VERIFIED: (verify_token) => {
    return { httpCode: 412, code: 'USER_ACCOUNT_NOT_VERIFIED', title: strings.ERROR, desc: 'User account is not verified. Use your provided verfication code to continue', data: verify_token }
  },
  INVALID_VERIFICATION_CODE: (data = '') => {
    return { httpCode: 412, code: 'INVALID_VERIFICATION_CODE', title: strings.ERROR, desc: 'Verification code is not valid', data: data }
  },
  INVALID_VERFICATION_TOKEN: (data = '') => {
    return { httpCode: 401, code: 'INVALID_VERFICATION_TOKEN', title: strings.ERROR, desc: 'Verfication token is not valid', data: data }
  },
  INVALID_TOKEN: (data = '') => {
    return { httpCode: 401, code: 'INVALID_TOKEN', title: strings.ERROR, desc: 'Token is invalid', data: data }
  },
  TOKEN_EXPIRED: (data = '') => {
    return { httpCode: 401, code: 'TOKEN_EXPIRED', title: strings.ERROR, desc: 'Token expired', data: data }
  },

  OK: (returnData = '') => {
    return { httpCode: 200, code: 'OK', desc: 'OK', data: returnData };
  },
  INVALID_INPUT: (data = '') => {
    return { httpCode: 400, code: 'INVALID_INPUT', title: strings.ERROR, desc: 'Required input should not be empty', data: data }
  },
  CRM_GET_TOKEN_FAIL: (data = '') => {
    return { httpCode: 400, code: 'CRM_GET_TOKEN_FAIL', title: strings.ERROR, desc: 'Required input should not be empty', data: data }
  },
  ACCOUNT_EXISTS_ALREADY: (data = '') => {
    return { httpCode: 409, code: 'ACCOUNT_EXISTS_ALREADY', title: strings.ERROR, desc: 'Account with the same email is already registered', data: data }
  },
  SCHEMA_VALIDATION_FAILED: (data = '') => {
    return { httpCode: 400, code: 'SCHEMA_VALIDATION_FAILED', title: strings.ERROR, desc: '', paramName: '', data: data }
  },
  REFERRING_PARTICIPANT_NOT_FOUND: (data = '') => {
    return { httpCode: 410, code: 'REFERRING_PARTICIPANT_NOT_FOUND', title: strings.ERROR, desc: 'Referring participant not found', data: data }
  },
  PARTICIPANT_NOT_FOUND: (data = '') => {
    return { httpCode: 404, code: 'PARTICIPANT_NOT_FOUND', title: strings.ERROR, desc: 'Participant not found', data: data }
  },
  OBJECT_NOT_FOUND: (object_name, data = '') => {
    return { httpCode: 404, code: 'OBJECT_NOT_FOUND', title: strings.ERROR, desc: object_name + ' not found', data: data }
  },
  CHANGE_PASSWORD_FAILED: (data = '') => {
    return { httpCode: 400, code: 'CHANGE_PASSWORD_FAILED', title: strings.ERROR, desc: 'Either current password is invalid or new password is too short. New password should be at least 6 characters', data: data }
  },
  INVALID_TRANSFER_CARD_INFO: (data = '') => {
    return { httpCode: 400, code: 'INVALID_TRANSFER_CARD_INFO', title: strings.ERROR, desc: 'Please make sure that birthdate and phone is correct', data: data }
  },
  INVALID_ADDRESS: (data = '') => {
    return { httpCode: 400, code: 'INVALID_ADDRESS', title: strings.ERROR, desc: 'Street name should not be empty while there is at least one of remaining fields is not.', data: data }
  },
  UPLOAD_PROFILE_PHOTO_FAILED: (data = '') => {
    return { httpCode: 412, code: 'UPLOAD_PROFILE_PHOTO_FAILED', title: strings.ERROR, desc: 'Profile photo update fail', data: data }
  },
  REMOVE_PROFILE_PHOTO_FAILED: (data = '') => {
    return { httpCode: 412, code: 'REMOVE_PROFILE_PHOTO_FAILED', title: strings.ERROR, desc: 'Failed to remove profile photo', data: data }
  },
  CARD_BEING_TRANSFERED_NOT_FOUND: (data = '') => {
    return { httpCode: 410, code: 'CARD_BEING_TRANSFERED_NOT_FOUND', title: strings.ERROR, desc: 'The card being transfered not found', data: data }
  },
  CARD_NUMBER_LENGTH_INVALID: (data = '') => {
    return { httpCode: 410, code: 'CARD_NUMBER_LENGTH_INVALID', title: strings.ERROR, desc: 'The card number length should be at least 9 characters', data: data }
  },
  HOME_BANNER_RESOURCES_NOT_FOUND: (data = '') => {
    return { httpCode: 404, code: 'HOME_BANNER_RESOURCES_NOT_FOUND', title: strings.ERROR, desc: 'HOME_BANNER_RESOURCES_NOT_FOUND', data: data }
  },
  LOGO_RESOURCES_NOT_FOUND: (data = '') => {
    return { httpCode: 404, code: 'LOGO_RESOURCES_NOT_FOUND', title: strings.ERROR, desc: 'LOGO_RESOURCES_NOT_FOUND', data: data }
  },
  CUSTOM_LINKS_NOT_FOUND: (data = '') => {
    return { httpCode: 404, code: 'CUSTOM_LINKS_NOT_FOUND', title: strings.ERROR, desc: 'CUSTOM_LINKS_NOT_FOUND', data: data }
  },
  PHONE_TOKEN_EXISTS_AND_BELONG_TO_ANOTHER: (data = '') => {
    return { httpCode: 409, code: 'PHONE_TOKEN_EXISTS_AND_BELONG_TO_ANOTHER', title: strings.ERROR, desc: 'Phone belongs to another participant', data: data }
  },
  CREATE_ACHIEVEMENTS_ERROR: (data = '') => {
    return { httpCode: 409, code: 'CREATE_ACHIEVEMENTS_ERROR', title: strings.ERROR, desc: 'CREATE_ACHIEVEMENTS_ERROR', data: data }
  },
  FAILED_TO_TRANSFER_PROFILE_FROM_CARD: (data = '') => {
    return { httpCode: 409, code: 'FAILED_TO_TRANSFER_PROFILE_FROM_CARD', title: strings.ERROR, desc: 'Failed to transfer profile from the terminated card', data: data }
  },
  EMAIL_NOT_FOUND_EXCEPTION: (data = '') => {
    return { httpCode: 400, code: 'EMAIL_NOT_FOUND_EXCEPTION', title: strings.ERROR, desc: 'The specified value was not found.', data: data }
  },
  PHONE_NOT_FOUND_EXCEPTION: (data = '') => {
    return { httpCode: 400, code: 'PHONE_NOT_FOUND_EXCEPTION', title: strings.ERROR, desc: 'The specified value was not found.', data: data }
  },
  REFERENCE_CODE_UNIQUE: (data = '') => {
    return { httpCode: 400, code: 'REFERENCE_CODE_UNIQUE', title: strings.ERROR, desc: 'The reference code must be unique per scheme across all participating schemes. Please specify a unique reference code for participating scheme.', data: data }
  },
  REFERENCE_CODE_INVALID: (data = '') => {
    return { httpCode: 400, code: 'REFERENCE_CODE_INVALID', title: strings.ERROR, desc: 'The Card is Invalid. You Are Not Allowed to Register to the Specific Scheme.', data: data }
  },
  FAILED_TO_CREATE_ORDER: (data = '') => {
    return { httpCode: 409, code: 'FAILED_TO_CREATE_ORDER', title: strings.ERROR, desc: 'Failed to create order', data: data }
  },
  MAX_ADDRESSES_REACHED: (data = '') => {
    return { httpCode: 400, code: 'MAX_ADDRESSES_REACHED', title: strings.ERROR, desc: 'Max addresses reached', data: data }
  },
  MAX_PHONES_REACHED: (data = '') => {
    return { httpCode: 400, code: 'MAX_PHONES_REACHED', title: strings.ERROR, desc: 'Max phones reached', data: data }
  },
  FAILED_TO_ADD_ADDRESS: (data = '') => {
    return { httpCode: 400, code: 'FAILED_TO_ADD_ADDRESS', title: strings.ERROR, desc: 'Failed to add address', data: data }
  },
  FAILED_TO_REMOVE_ADDRESS: (data = '') => {
    return { httpCode: 400, code: 'FAILED_TO_REMOVE_ADDRESS', title: strings.ERROR, desc: 'Failed to remove address', data: data }
  },
  FAILED_TO_UPDATE_ADDRESS: (data = '') => {
    return { httpCode: 400, code: 'FAILED_TO_UPDATE_ADDRESS', title: strings.ERROR, desc: 'Failed to remove address', data: data }
  },
  FAILED_TO_ADD_PHONE: (data = '') => {
    return { httpCode: 400, code: 'FAILED_TO_ADD_PHONE', title: strings.ERROR, desc: 'Failed to add phone', data: data }
  },
  FAILED_TO_REMOVE_PHONE: (data = '') => {
    return { httpCode: 400, code: 'FAILED_TO_REMOVE_PHONE', title: strings.ERROR, desc: 'Failed to remove phone', data: data }
  },
  FAILED_TO_UPDATE_PHONE: (data = '') => {
    return { httpCode: 400, code: 'FAILED_TO_UPDATE_PHONE', title: strings.ERROR, desc: 'Failed to remove phone', data: data }
  },
  FAILED_TO_MODIFY_PHONE: (data = '') => {
    return { httpCode: 400, code: 'FAILED_TO_MODIFY_PHONE', title: strings.ERROR, desc: 'Failed to modify phone', data: data }
  },
  FAILED_TO_UPDATE_TOKEN_PHONE: (data = '') => {
    return { httpCode: 400, code: 'FAILED_TO_UPDATE_TOKEN_PHONE', title: strings.ERROR, desc: 'Failed to update phone based token', data: data }
  },
  POSTAL_CODE_DOES_NOT_MATCH: (data = '') => {
    return { httpCode: 400, code: 'POSTAL_CODE_DOES_NOT_MATCH', title: strings.ERROR, desc: 'Postal Code 00084 Does Not Match to the Country Postal Code Pattern.', data: data }
  },
  FAILED_TO_UPDATE_CONSENT: (data = '') => {
    return { httpCode: 400, code: 'FAILED_TO_UPDATE_CONSENT', title: strings.ERROR, desc: 'Failed to update consent', data: data }
  },
  FAILED_TO_UPDATE_LANGUAGE: (data = '') => {
    return { httpCode: 400, code: 'FAILED_TO_UPDATE_LANGUAGE', title: strings.ERROR, desc: 'Failed to update language', data: data }
  },
  FAILED_TO_ADD_FAVOURITE: (data = '') => {
    return { httpCode: 400, code: 'FAILED_TO_ADD_FAVOURITE', title: strings.ERROR, desc: 'Failed to add favourite', data: data }
  },
  FAILED_TO_REMOVE_FAVOURITE: (data = '') => {
    return { httpCode: 400, code: 'FAILED_TO_REMOVE_FAVOURITE', title: strings.ERROR, desc: 'Failed to remove favourite', data: data }
  },
  FAILED_TO_PURCHASE_VOUCHER: (data = '') => {
    return { httpCode: 400, code: 'FAILED_TO_PURCHASE_VOUCHER', title: strings.ERROR, desc: 'Failed to purchase voucher', data: data }
  },
  FAILED_TO_DEBIT_WALLET_FOR_GIFT_EVOUCHER_PURCHASE: (data = '') => {
    return { httpCode: 400, code: 'FAILED_TO_DEBIT_WALLET_FOR_GIFT_EVOUCHER_PURCHASE', desc: 'Failed to debit wallet for evoucher', data: data }
  },
  FAILED_TO_DEBIT_WALLET_FOR_GIFT_EVOUCHER_PURCHASE_BALANCE_NOT_ENOUGH: (data = '') => {
    return { httpCode: 400, code: 'FAILED_TO_DEBIT_WALLET_FOR_GIFT_EVOUCHER_PURCHASE_BALANCE_NOT_ENOUGH', title: strings.ERROR, desc: 'Wallet Balance is Not Enough to purchase evoucher', data: data }
  },
  AMOUNT_INVALID: (data = '') => {
    return { httpCode: 400, code: 'AMOUNT_INVALID', title: strings.ERROR, desc: '', data: data }
  },
  FAILED_TO_CHECK_ADDRESS: (data = '') => {
    return { httpCode: 400, code: 'FAILED_TO_CHECK_ADDRESS', title: strings.ERROR, desc: '', data: data }
  },
  CANNOT_FIND_FB_PROFILE: (data = '') => {
    return { httpCode: 400, code: 'CANNOT_FIND_FB_PROFILE', title: strings.ERROR, desc: 'Cannot find Facebook profile', data: data }
  },
  FB_USER_NOT_REGISTERED: (data = '') => {
    return { httpCode: 401, code: 'FB_USER_NOT_REGISTERED', title: strings.ERROR, desc: 'Facebook User is not registered yet', data: data };
  },
  FAILED_TO_CHECK_TME: (data = '') => {
    return { httpCode: 400, code: 'FAILED_TO_CHECK_TME', title: strings.ERROR, desc: '', data: data }
  },
  NOT_ALLOWED: (data = '') => {
    return { httpCode: 401, code: 'NOT_ALLOWED', title: strings.ERROR, desc: 'User not allowed to perform this action', data: data }
  },
  FAILED_TO_CANCEL_GIFT_VOUCHER: (data = '') => {
    return { httpCode: 400, code: 'FAILED_TO_CANCEL_GIFT_VOUCHER', title: strings.ERROR, desc: 'Failed to cancel voucher', data: data }
  },
  FAILED_TO_VOID_GIFT_VOUCHER_WALLET_TRANSACTION: (data = '') => {
    return { httpCode: 400, code: 'FAILED_TO_VOID_GIFT_VOUCHER_WALLET_TRANSACTION', title: strings.ERROR, desc: 'Failed to void wallet transaction', data: data }
  },
  INVALID_LOGIN: (data = '') => {
    return { httpCode: 401, code: 'INVALID_LOGIN', title: strings.LOGIN_FAIL_TITLE, desc: strings.LOGIN_FAIL_DES, data: data };
  },
  CONTACT_VERIFY_CARD_INVALID: (data = '') => {
    return { httpCode: 401, code: 'CARD_INVALID', title: strings.ERROR, desc: strings.CONTACT_VERIFY_CARD_INVALID, data: data }
  },
  CONTACT_VERIFY_OTP_INVALID: (data = '') => {
    return { httpCode: 401, code: 'OTP_INVALID', title: strings.ERROR, desc: strings.CONTACT_VERIFY_OTP_INVALID, data: data }
  },
  CONTACT_VERIFY_CARD_INVALID_404: (data = '') => {
    return { httpCode: 404, code: 'CARD_INVALID', title: strings.ERROR, desc: strings.CONTACT_VERIFY_CARD_INVALID_INFO, data: data }
  },
}