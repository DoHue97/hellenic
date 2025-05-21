import { getToken, clearStore, getData,getContactId } from "../utils/common";
import { userAction } from "./user";
import { walletAction } from "./wallets";
import { merchantAction } from "./merchants";
import { offersAction } from "./offers";
import { notificationsAction } from './notifications';
import { userService } from "../wsinterface/crmapi/user";
import { actionAccountCreators } from "../reducers/accounts";
import { actionWalletsCreators } from "../reducers/wallets";
import { actionCardCreators } from "../reducers/cards";
import { actionOffersCreators } from "../reducers/offers";
import { actionMerchantsCreators } from "../reducers/merchants";
import { actionPurchasesCreators } from "../reducers/transactions";
import { actionNotificationCreators } from "../reducers/notifications";

export const commonAction = {
    onLoadData,
    onLoadDataForTab,
    onLoadDataForMyAccount,
    checkLogin,
    clearData,
    clearSession
}
async function checkLogin() {
    var token = await getData("USER_TOKEN");
    console.log("token:",token);
    if (token && token.token) {
        await onLoadData(false,true);
        return true;
    }
    return false;
}
async function clearData() {
    await clearStore();
    await AppData.getStore().dispatch(actionAccountCreators.clear());
    await AppData.getStore().dispatch(actionWalletsCreators.clear());
    await AppData.getStore().dispatch(actionCardCreators.clear());
    await AppData.getStore().dispatch(actionOffersCreators.clear());
    await AppData.getStore().dispatch(actionMerchantsCreators.clear());
    await AppData.getStore().dispatch(actionPurchasesCreators.clear());
    await AppData.getStore().dispatch(actionNotificationCreators.clear());
}

async function onLoadDataForTab(ignoreLoadContact,ignoreLoadAccount) {
    if(!ignoreLoadContact)
        await userAction.getContactInfo();
    // await walletAction.getWalletInfo();
    userAction.getCards();
    userAction.getIndustry();
    merchantAction.getMerchants();
    if(!ignoreLoadAccount)
        userAction.getAccounts();
    merchantAction.getMerchants();
    offersAction.getOffers({});
    notificationsAction.setNotificationBadgeNumber();
}
async function onLoadDataForMyAccount() {
    notificationsAction.getNotifications(1,true);
    walletAction.getTransactions();
}

async function onLoadData(ignoreLoadContact,ignoreWaitGetWallet,isLoadCard) {
    if(!ignoreLoadContact)
        await userAction.getContactInfo(true);
    if(isLoadCard)
        await userAction.getCards();
}

async function clearSession(){
    try{
        var contactID = await getContactId();
        await userService.clearSession(contactID);
    }catch(error){
        console.log("logout clear session:",error);
        return error
    }
}