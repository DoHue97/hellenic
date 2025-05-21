import { actionWalletsCreators } from '../reducers/wallets';
import { walletsService } from "../wsinterface/crmapi/wallets";
import { merchantAction } from './merchants';
import { commonAction } from './common';
import { getContactId, getToken } from "../utils/common";
import { actionPurchasesCreators } from '../reducers/transactions';
import { navigateAndReset } from '../utils/util';
import { crmConfig } from '../config/crmserver';

export const walletAction = {
    getWalletInfo,
    getTransactions,
    getWalletAllotment
}

var isFetchingPurchaseLoaded = false;
async function getTransactions(page) {
    var contactID = await getContactId();
    if (contactID) {
        try {
            if (isFetchingPurchaseLoaded) {
                // console.log("wallets getTransactions in another fetching");
                return;
            }

            isFetchingPurchaseLoaded = true;
            await AppData.getStore().dispatch(actionPurchasesCreators.setRefreshingFlag(true));
            const result = await walletsService.getPurchases(contactID, page, 10);
            // console.log("wallets getTransactions result:", result);
            if (result != null) {
                var trans = await createListTransaction(result.data);
                await AppData.getStore().dispatch(actionPurchasesCreators.add(trans));
            } else if (result.code == 'TOKEN_EXPIRE') {
                await commonAction.clearData();
                var navigation = await AppData.getRootNavigation();
                navigateAndReset(navigation, "Login");
            } else
                await AppData.getStore().dispatch(actionPurchasesCreators.setRefreshingFlag(false));

            isFetchingPurchaseLoaded = false;
            return result;
        } catch (ex) {
            await AppData.getStore().dispatch(actionPurchasesCreators.setRefreshingFlag(false));
            console.log("wallets getTransactions error:", ex);
            isFetchingPurchaseLoaded = false;
            return null;
        }
    } else {
        return null;
    }
}

async function createListTransaction(data) {
    var result = [];
    var trans = data.content;
    if (trans && trans.length > 0) {
        for (var i = 0; i < trans.length; i++) {
            var transaction = {
                total_awarded_amount: trans[i].total_awarded_amount,
                total_awarded_alternative_amount: trans[i].total_awarded_alternative_amount,
                total_spend_amount: trans[i].total_spend_amount,
                total_spend_alternative_amount: trans[i].total_spend_alternative_amount,
                total_amount: trans[i].total_amount,
                performed_on_datetime: trans[i].performed_on_datetime,
                performed_on: trans[i].performed_on,
                performed_by_business_unit: trans[i].performed_by_business_unit,
                life_cycle_state: trans[i].life_cycle_state
            }

            result.push(transaction);
        }
    }
    data.content = result;
    return data;
}

/* async function purchasesToTransaction(getContactId){
    var purchases = await getPurchases(getContactId);
    console.log("wallets purchasesToTransaction: ", purchases);
    if(purchases == null || !purchases)
        return null;

    return groupAndSortTran(purchases);
}

async function getPurchases(contactID){
    try {            
        const result =  await walletsService.getPurchases(contactID);
        console.log("wallets getPurchases result from service:", result);
        if (result.code == 'OK') {
            var purchasesOut = [];

            var purchases = result.data.content;
            if(purchases){
                purchases = purchases.sort(function (a, b) {
                    return b.performed_on - a.performed_on;
                })
            }

            purchases.forEach((item) => {
                var addI = {};
                addI.tax_amount = item.tax_amount,
                addI.total_spend_alternative_amount = item.total_spend_alternative_amount,
                addI.performed_by_business_unit = item.performed_by_business_unit,
                addI.requested_spend_alternative_amount = item.requested_spend_alternative_amount,
                addI.life_cycle_state = item.life_cycle_state,
                addI.performed_on = formatDateToDDMMYYYYFrEpoch(item.performed_on),
                addI.performed_on_datetime = formatDateTimeFrEpoch(item.performed_on),
                addI.reference_number = item.reference_number,
                addI.number = item.number,
                addI.requested_spend_amount = item.requested_spend_amount,
                addI.total_awarded_alternative_amount = item.total_awarded_alternative_amount,
                addI.account_id = item.account_id,
                addI.total_amount = item.total_amount,
                addI.id = item.id,
                addI.net_amount = item.net_amount,
                addI.total_awarded_amount = item.total_awarded_amount,
                addI.total_spend_amount = item.total_spend_amount

                purchasesOut.push(addI);
            });
            console.log("wallets getPurchases result:", purchasesOut);
            return purchasesOut;
        }
        
        return null;
    } catch (ex) {
        console.log("wallets getPurchases error:", ex);
        return null;
    }
} */

var isFetchingWalletLoaded = false;
async function getWalletInfo() {
    var contactID = await getContactId();
    if (contactID) {
        try {
            if (isFetchingWalletLoaded) {
                console.log("WalletInfo THERE IS ANOTHER FETCHING ALREADY");
                return;
            }
            isFetchingWalletLoaded = true;
            await AppData.getStore().dispatch(actionWalletsCreators.setRefreshingFlag(true));
            var result = await walletsService.getWalletInfo(contactID);
            if (result.code == 'OK') {
                var content = result.data.content;
                var wallet = content && content.length > 0 ? content[0] : null;
                if (wallet) {
                    var walletData = createWalletData(wallet);
                    const walletDetailRes = await walletsService.getWalletDetail(wallet.id);
                    if (walletDetailRes.code == 'OK') {
                        // console.log("walletDetailRes:", walletDetailRes)
                        if (walletDetailRes.code == 'OK') {
                            var allomentsByMerchant = await groupAllomentByMerchants(walletDetailRes.data);
                            walletData = { ...walletData, ...allomentsByMerchant };
                        }
                        delete walletData.allotments;
                        await AppData.getStore().dispatch(actionWalletsCreators.add_wallet_info(walletData));
                    }
                }
            } else if (result.code == 'TOKEN_EXPIRE') {
                await commonAction.clearData();
                var navigation = await AppData.getRootNavigation();
                navigateAndReset(navigation, "Login");
            }
            else {
                await AppData.getStore().dispatch(actionWalletsCreators.setRefreshingFlag(false));
            }
            isFetchingWalletLoaded = false;
            return result;
        } catch (ex) {
            await AppData.getStore().dispatch(actionWalletsCreators.setRefreshingFlag(false));
            console.log("some thing error:", ex);
            isFetchingWalletLoaded = false;
            return null;
        }
    } else {
        return null;
    }
}
function createWalletData(wallet) {
    var data = {
        id: wallet.id,
        balance: wallet.balance,
        conditional_balance: wallet.conditional_balance,
        unconditional_balance: wallet.unconditional_balance,
        allotments: wallet.allotments
    }
    return data;
}
// async function groupAllomentByMerchants(walletInfo) {
//     walletInfo = createWalletData(walletInfo);
//     var anyStores = null;
//     var allotmentsByMerchant = [];
//     var allotments = walletInfo.allotments;
//     if (allotments && allotments.length > 0) {
//         for (var i = 0; i < allotments.length; i++) {
//             var allotment = allotments[i];
//             if (allotment.business_units && allotment.business_units.length > 0) {
//                 var merchant = allotment.business_units[0];
//                 const merchantDetail = await merchantAction.getMerchantDetail(merchant.id);
//                 if (merchantDetail.code == "OK") {
//                     merchant.description = merchantDetail.data ? merchantDetail.data.description : "";
//                     merchant.merchantImage = merchantDetail.data ? merchantDetail.data.merchantImage : null;

//                 }

//                 if (allotmentsByMerchant.length > 0) {
//                     var existMerchant = allotmentsByMerchant.filter(element => element.merchant.id === merchant.id);
//                     if (existMerchant && existMerchant.length > 0) {
//                         existMerchant = existMerchant[0];
//                         var amount = existMerchant.amount + allotment.amount;
//                         existMerchant.amount = amount;
//                         existMerchant.allotments.push(createAllotmentData(allotment));
//                         existMerchant.allotments.sort(function (a, b) {
//                             return b.amount - a.amount;
//                         });
//                     } else {
//                         var allotmentObject = {
//                             merchant: { ...merchant },
//                             amount: allotment.amount,
//                             allotments: []
//                         }
//                         allotmentObject.allotments.push(createAllotmentData(allotment));
//                         allotmentsByMerchant.push(allotmentObject)
//                     }
//                 } else {
//                     var allotmentObject = {
//                         merchant: { ...merchant },
//                         amount: allotment.amount,
//                         allotments: []
//                     }
//                     allotmentObject.allotments.push(createAllotmentData(allotment));
//                     allotmentsByMerchant.push(allotmentObject)
//                 }
//             } else {
//                 if (!anyStores) {
//                     anyStores = {
//                         amount: allotment.amount
//                     };
//                 } else {
//                     var amount = anyStores.amount + (allotment.amount ? allotment.amount : 0);
//                     anyStores.amount = amount;
//                 }
//                 var arrAllotment = [];
//                 arrAllotment.push(allotment.id);
//                 anyStores.allotmentIDs = arrAllotment;
//             }
//         }
//     }

//     if (allotmentsByMerchant) {
//         allotmentsByMerchant = allotmentsByMerchant.sort(function (a, b) {
//             return b.amount - a.amount;
//         });

//         allotmentsByMerchant = allotmentsByMerchant.filter(al => al.amount > 0);
//     }

//     walletInfo.allotmentsByMerchant = allotmentsByMerchant;
//     walletInfo.anyStores = anyStores;
//     return walletInfo;
// }

async function groupAllomentByMerchants(walletInfo) {
    walletInfo = createWalletData(walletInfo);
    var allotments = walletInfo.allotments;
    let allotmentsByMerchant = getAllotmentMerchantGroup(allotments);
    let allotmentsByMerchantFullInfo = [];
    if (allotmentsByMerchant.length > 0) {
        for (let i = 0; i < allotmentsByMerchant.length; i++) {
            let merchant = allotmentsByMerchant[i];
            let allotments = merchant.allotments.sort(sortByAmount);
            merchant.allotments = allotments;
            const merchantDetail = await merchantAction.getMerchantDetail(merchant.parent_group_id);
            // console.log("merchantDetail:", merchantDetail);
            if (merchantDetail.code == "OK") {
                merchant.description = merchantDetail.data ? merchantDetail.data.description : "";
                merchant.merchantImage = merchantDetail.data ? merchantDetail.data.merchantImage : null;

            }
            allotmentsByMerchantFullInfo.push(merchant);
        }
    }
    allotmentsByMerchantFullInfo= allotmentsByMerchantFullInfo.sort(sortByTotalAmount);
    let allotmentsAnyStore = getAllotmentAnyStore(allotments);
    walletInfo.anyStores = allotmentsAnyStore
    walletInfo.allotmentsByMerchant = allotmentsByMerchantFullInfo;
    // console.log("AAAAAA walletInfo:", walletInfo);
    return walletInfo;
}
function getAllotmentAnyStore(allotments) {
    let total_amount = 0;
    let allotmentIDs = []
    let filterAllotment = allotments.filter(allotment => {
        return !allotment.business_units || allotment.business_units.length == 0
    })
    if (filterAllotment && filterAllotment.length > 0) {
        filterAllotment.forEach(element => {
            total_amount = total_amount + element.amount;
            allotmentIDs.push(element.id)
        });
    }
    return {
        allotments: filterAllotment,
        total_amount: total_amount,
    }
}
function getAllotmentMerchantGroup(allotments) {
    var items = allotments.reduce((acc, curr) => {
        var business_units = curr.business_units ? curr.business_units : [];
        for (let i = 0; i < business_units.length; i++) {
            let unit = business_units[i];
            let parent_group = unit.parent_group;
            let parent = unit.parent;
            let parent_group_code;
            let parent_group_name;
            let parent_group_id;
            let include_parent= false;
            if (parent_group) {
                parent_group_code = parent_group.code;
                parent_group_name = parent_group.name;
                parent_group_id = parent_group.id;
            } else if (parent) {
                parent_group_code = parent.code;
                parent_group_name = parent.name;
                parent_group_id = parent.id;
            } else {
                parent_group_code = unit.code;
                parent_group_name = unit.name;
                parent_group_id = unit.id;
                include_parent = true;
            }
            const itemExists = acc.find(item => parent_group_code == item.parent_group_code);
            if (itemExists) {
                let allotments = [...itemExists.allotments];
                let indexAllotment = null;
                let allotment = allotments.find((a, index) => {
                    if (a.id == curr.id) {
                        indexAllotment = index;
                        return a;
                    }
                });
                if (allotment) {
                    let bussinesses = [...allotment.bussinesses];
                    if (unit.parent || unit.parent_group) {
                        bussinesses.push(unit);
                    }
                    allotment.bussinesses = bussinesses
                    itemExists.allotments[indexAllotment] = allotment;
                } else {
                    let total_amount = itemExists.total_amount + curr.amount;
                    allotment = { ...curr };
                    let bussinesses = []
                    if (unit.parent || unit.parent_group) {
                        bussinesses.push(unit);
                    }
                    allotment.bussinesses = bussinesses;
                    itemExists.total_amount = total_amount;
                    itemExists.allotments.push(allotment);
                }
                if(include_parent){
                    allotment.include_parent = include_parent;
                }
            } else {
                let allotment = {
                    ...curr,
                    bussinesses: [unit]
                }
                if(include_parent){
                    allotment.include_parent = include_parent;
                }
                let obj = {
                    parent_group_code: parent_group_code,
                    parent_group_name: parent_group_name,
                    parent_group_id: parent_group_id,
                    allotments: [allotment],
                    total_amount: curr.amount
                }
                acc.push(obj);
            }
        }
        return acc;
    }, []);
    return items;
}

async function getWalletAllotment(walletID, allotmentID, isAnyMerchant) {
    try {
        await AppData.getStore().dispatch(actionWalletsCreators.setRefreshingFlag(true));
        var result = await walletsService.getWalletAllotment(walletID, allotmentID);
        // console.log("getWalletAllotment result:",result);
        if (result.code == 'OK') {
            var content = {
                isAnyMerchant: isAnyMerchant,
                allotmentID: allotmentID,
                expiration_breakdown: result.data.expiration_breakdown && result.data.expiration_breakdown.length > 0 ? result.data.expiration_breakdown : []
            }
            await AppData.getStore().dispatch(actionWalletsCreators.add_allotment_info(content));

        }
        await AppData.getStore().dispatch(actionWalletsCreators.setRefreshingFlag(false));
        return result;
    } catch (error) {
        await AppData.getStore().dispatch(actionWalletsCreators.setRefreshingFlag(false));
        return error;
    }
}

function sortByAmount(n1, n2) {
    if (n1.amount < n2.amount) {
        return 1;
    } else if (n1.amount > n2.amount) {
        return -1;
    } else {
        return 0;
    }
}

function sortByTotalAmount(n1, n2) {
    if (n1.total_amount < n2.total_amount) {
        return 1;
    } else if (n1.total_amount > n2.total_amount) {
        return -1;
    } else {
        return 0;
    }
}