import {restsv} from './restsv';

export const offersService = {
	getOffers,
	getCategories,
	getOfferDetail
}

async function getOffers(param){
	var path = 'reward_offers';
	var page = param.page ? param.page : 1;
	var size = param.size ? param.size : 10;
	path = path + '?page=' + page ;
	path = path + '&size=' + size;
	if(param.industry)
		path = path + '&industry=' + param.industry;
	if(param.town_city)
		path = path + '&town_city=' + param.town_city;
	if(param.category)
		path = path + '&category=' + param.category;
	if(param.owned_by_business_unit){
		path = path + '&owned_by_business_unit=' + param.owned_by_business_unit;
	}
	console.log("offers api request getOffers: ", path);	
	const response = await restsv.get(path,null,'token');
	// console.log("offers api reponse getOffers: ", response);
	return response
}

async function getOfferDetail(offerID){
	var path = 'reward_offers/'+offerID;
	console.log("offers api request getOfferDetail: ", path);	
	const response = await restsv.get(path,null,'token');
	// console.log("offers api reponse getOffers: ", response);
	return response
}

async function getCategories(){
	var path = 'categories?entity=REWARDOFFER';
	const response = await restsv.get(path,null,'token');
	return response
}
