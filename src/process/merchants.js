import { actionMerchantsCreators } from '../reducers/merchants';
import { actionAccountCreators } from '../reducers/accounts';
import { merchantsService } from "../wsinterface/crmapi/merchants";
import { userService } from "../wsinterface/crmapi/user";
import { getToken, saveDataIntoAsyncStore, getData, getImageURL } from "../utils/common";
import { crmConfig } from '../config/crmserver';
import { restsv } from '../wsinterface/crmapi/restsv';

export const merchantAction = {
    getMerchants,
    getMerchantDetail,
    addMerchant,
    removeMerchant,
    merchantChildGroupbyTown
}

async function merchantChildGroupbyTown(params) {
    var result = [];
    if (params && params.child_business_units && params.child_business_units.length > 0) {
        for (var i = 0; i < params.child_business_units.length; i++) {
            var child = params.child_business_units[i];
            if (child && child.addresses && child.addresses.length > 0) {
                for (var j = 0; j < child.addresses.length; j++) {
                    var childAddress = child.addresses[j];
                    var exist = result.filter(element => element.town_city === childAddress.town_city);
                    if (exist && exist.length > 0) {
                        var chi = {
                            chi_id: child.id,
                            chi_name: child.name,
                            chi_description: child.description,
                            chi_phones: child.phones,
                            chi_add: (childAddress.address_line_1 ? childAddress.address_line_1 : "") + (childAddress.address_line_2 ? (", " + childAddress.address_line_2) : "")  + (childAddress.postal_code ? (", " + childAddress.postal_code) : "")
                        };

                        exist = exist[0];
                        exist.childs.push(chi);
                    } else {
                        var chi = {
                            chi_id: child.id,
                            chi_name: child.name,
                            chi_description: child.description,
                            chi_phones: child.phones,
                            chi_add: (childAddress.address_line_1 ? childAddress.address_line_1 : "") + (childAddress.address_line_2 ? (", " + childAddress.address_line_2) : "") + (childAddress.postal_code ? (", " + childAddress.postal_code) : "")
                        };
                        var childs = [];
                        childs.push(chi);

                        var resultObj = {
                            town_city: childAddress.town_city,
                            piority: getPiority(childAddress.town_city),
                            childs: childs
                        };
                        result.push(resultObj);
                    }
                }
            }

        }
    }
    var data = result.sort(sortByPiority);
    return data;
}
function getPiority(town_city){
    var piority = 0;
    if(town_city==='Nicosia'){
        piority = 1;
    }else if(town_city==='Limassol'){
        piority = 2;
    }else if(town_city==='Larnaca'){
        piority = 3;
    }else if(town_city==='Paphos'){
        piority = 4;
    }else if(town_city==='Famagusta'){
        piority = 5;
    }
    return piority;
}

function sortByPiority(n1,n2){
    if(n1.piority > n2.piority){
        return 1;
    }else if(n1.piority < n2.piority){
        return -1
    }else
        return 0;
}
var isFetchingMerchantLoaded = false;
async function getMerchants(param) {
    // console.log("loading...Merchants");
    try {
        if (isFetchingMerchantLoaded) {
            // console.log("Merchants THERE IS ANOTHER FETCHING ALREADY");
            return null;
        }
        isFetchingMerchantLoaded = true;
        await AppData.getStore().dispatch(actionMerchantsCreators.setRefreshingFlag(true));
        if (!param)
            param = {}
        if (!param.pagesize)
            param.pagesize = 18;
        var result = await merchantsService.getMerchants(param);
        console.log("Merchants result:",result);
        if (result && result.code == 'OK') {
            var merchantData = await createListMerchants(result.data);
            await AppData.getStore().dispatch(actionMerchantsCreators.add(merchantData));
        } else {
            await AppData.getStore().dispatch(actionMerchantsCreators.setRefreshingFlag(false));
        }
        isFetchingMerchantLoaded = false;
        return result;
    } catch (ex) {
        await AppData.getStore().dispatch(actionMerchantsCreators.setRefreshingFlag(false));
        console.log("some thing error:", ex);
        isFetchingMerchantLoaded = false;
        return null;
    }
}
async function createListMerchants(data) {
    var merchantList = [];
    var merchantData = data.content;
    if (merchantData.length > 0) {
        for (var i = 0; i < merchantData.length; i++) {
            var merchant = {
                id: merchantData[i].id,
                name: merchantData[i].name,
                industry_name: merchantData[i].industry_name,
                industry_sectors: merchantData[i].industry_sectors,
                universal_offer: merchantData[i].universal_offer,
                description: merchantData[i].description
            }
            var creatives = merchantData[i].creatives ? merchantData[i].creatives : [];
            if (creatives.length > 0) {
                for (var j = 0; j < creatives.length; j++) {
                    var merchantURL = await getImageURL(creatives[j].url ? crmConfig.crmServer + creatives[j].url : "");
                    if (merchantURL)
                        merchant = { ...merchant, merchantImage: merchantURL }
                }
            }
            merchantList.push(merchant);
        }
    }
    // merchantList = merchantList.sort(sortByName);
    data.content = merchantList;
    return data;
}

async function getMerchantDetail(merchantId,isIncludeVenues) {
    try {
        const result = await merchantsService.getMerchantDetail(merchantId,isIncludeVenues);
        console.log("getMerchantDetail result:",result);
        if (result.code == 'OK') {
            let merchant = result.data.content;
            let creatives = merchant && merchant.creatives ? merchant.creatives : [];
            let url = creatives.length > 0 ? crmConfig.crmServer + creatives[0].url : null;
            var merchantImage = await getImageURL(url);
            merchant.merchantImage = merchantImage;
            await AppData.getStore().dispatch(actionMerchantsCreators.merchants_detail(result));
            return { code: "OK", data: merchant };
        }
        else {
            return { code: result.code, data: "" };
        }
    } catch (ex) {
        console.log("merchants getMerchantDetail: ", ex);
        return ex;
    }
}

async function removeMerchant(accID, merchantid) {
    try {
        // console.log("merchant removeMerchant start");
        const result = await merchantsService.deleteMerchant(accID, merchantid);
        if (result.code == 'OK') {
            const accountDetailResult = await userService.getDetailAccount(accID);
            if (accountDetailResult.code == 'OK') {
                await AppData.getStore().dispatch(actionAccountCreators.add(accountDetailResult.data));
            } else {
                await AppData.getStore().dispatch(actionAccountCreators.setRefreshingFlag(false));
            }
            return { code: "OK", data: accountDetailResult };
        }
        else {
            return { code: result.code, data: result };
        }
    } catch (ex) {
        console.log("merchant removeMerchant error: ", ex);
        return ex;
    }
}



async function addMerchant(accID, merchantid) {
    try {
        console.log("add Merchant start");
        const result = await merchantsService.addMerchant(accID, merchantid, true);
        if (result.code == 'OK') {
            const accountDetailResult = await userService.getDetailAccount(accID);
            if (accountDetailResult.code == 'OK') {
                await AppData.getStore().dispatch(actionAccountCreators.add(accountDetailResult.data));
            } else {
                await AppData.getStore().dispatch(actionAccountCreators.setRefreshingFlag(false));
            }
            return { code: "OK", data: result };
        }
        else {
            return { code: result.code, data: result };
        }
    } catch (ex) {
        console.log("merchant addMerchant error: ", ex);
        return ex;
    }
}
