import { actionOffersCreators } from '../reducers/offers';
import { offersService } from "../wsinterface/crmapi/offers"
import { getImageURL } from "../utils/common"
import { crmConfig } from '../config/crmserver';
import { commonAction } from './common'
import { getCategoryByName, navigateAndReset } from '../utils/util'
export const offersAction = {
    getOffers,
    getBasicOffers,
    getCategories
}

var isFetchingOffersLoaded = false;
async function getOffers(param) {
    // console.log("loading...Offers");
    try {
        if (isFetchingOffersLoaded) {
            console.log("Offers THERE IS ANOTHER FETCHING ALREADY");
            return;
        }
        isFetchingOffersLoaded = true;
        await AppData.getStore().dispatch(actionOffersCreators.setRefreshingFlag(true));
        let categories = await AppData.getStore().getState().offers.offer_categories;
        if (categories.length == 0) {
            const resultCategories = await getCategories();
            if (resultCategories && resultCategories.code == 'OK') {
                categories = resultCategories.data.content;
            }
        }
        let category = getCategoryByName(categories, 'Special');
        if (category) {
            param.category = category.id;
        }
        console.log("param:", param);
        const result = await offersService.getOffers(param);
        console.log("loading...Offers result:",result);
        if (result.code == 'OK') {
            var offers = await createListOffers(result.data);
            await AppData.getStore().dispatch(actionOffersCreators.add(offers));
        } else if (result.code == 'TOKEN_EXPIRE') {
            await commonAction.clearData();
            var navigation = await AppData.getRootNavigation();
            navigateAndReset(navigation, "Login");
        }
        else {
            await AppData.getStore().dispatch(actionOffersCreators.setRefreshingFlag(false));
        }
        isFetchingOffersLoaded = false;
        return result;
    } catch (ex) {
        await AppData.getStore().dispatch(actionOffersCreators.setRefreshingFlag(false));
        console.log("some thing error:", ex);
        isFetchingOffersLoaded = false;
        return null;
    }
}

async function createListOffers(data) {
    var offerList = [];
    var offerData = data.content;
    if (offerData.length > 0) {
        for (var i = 0; i < offerData.length; i++) {
            var offer = {
                id: offerData[i].id,
                name: offerData[i].name,
                description: offerData[i].description,
                marketing_information: offerData[i].marketing_information,
                merchantName: offerData[i].owned_by_business_unit && offerData[i].owned_by_business_unit.name ? offerData[i].owned_by_business_unit.name : "",
            }

            if (offer.marketing_information) {
                var creatives = offer.marketing_information.creatives ? offer.marketing_information.creatives : [];
                if (creatives.length > 0) {
                    for (var j = 0; j < creatives.length; j++) {
                        var offerURL = await getImageURL(creatives[j].url ? crmConfig.crmServer + creatives[j].url : "");
                        if (offerURL)
                            offer = { ...offer, offerImage: offerURL }
                    }
                }
            }

            offerList.push(offer);
        }
    }
    data.content = offerList;
    return data;
}

async function getCategories() {
    // console.log("loading...Categories");
    try {
        const result = await offersService.getCategories();
        // console.log("result getCategories:", result);
        if (result.code == 'OK') {
            await AppData.getStore().dispatch(actionOffersCreators.add_categories(result.data.content));
        } else if (result.code == 'TOKEN_EXPIRE') {
            await commonAction.clearData();
            var navigation = await AppData.getRootNavigation();
            navigateAndReset(navigation, "Login");
        }
        return result;
    } catch (ex) {
        console.log("getCategories some thing error:", ex);
        return null;
    }
}


async function getBasicOffers(merchantId) {
    let basicValue = 0;
    try {
        let param = {
            page: 1,
            size: 1000
        };
        let categories = await AppData.getStore().getState().offers.offer_categories;
        category = getCategoryByName(categories, 'Basic');
        if (category) {
            param.category = category.id;
            param.owned_by_business_unit = merchantId;
        }
        console.log("param:", param);
        const result = await offersService.getOffers(param);
        console.log("result getBasicOffers:", result);
        if (result.code == 'OK' && result.data.content && result.data.content.length > 0) {
            let offers = result.data.content;
            for (let i = 0; i < offers.length; i++) {
                let offerDetailResult = await offersService.getOfferDetail(offers[i].id);
                console.log("offerDetailResult result:",offerDetailResult);
                if(offerDetailResult.code == 'OK'){
                    let awardAmount = offerDetailResult.data.award && offerDetailResult.data.award.amount ? offerDetailResult.data.award.amount : 0;
                    basicValue = basicValue + awardAmount;
                }
            }
        }
    } catch (ex) {
        console.log("exception getBasicOffers:", ex);
    }
    return basicValue;
}