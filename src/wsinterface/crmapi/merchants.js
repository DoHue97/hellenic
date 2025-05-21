import {restsv} from '../crmapi/restsv';

export const merchantsService = {
	getMerchants,
	addMerchant,
	getMerchantDetail,
	deleteMerchant
}

async function getMerchants(param){
	var path = 'merchants';
	var page = (param && param.page) ? param.page : 1;
	path = path + '?page=' + page ;
	if(param && param.pagesize)
		path = path + '&size=' + param.pagesize;
	
	if(param.industry)
		path = path + '&industry=' + param.industry;
	if(param.town_city)
		path = path + '&town_city=' + param.town_city;
	if(param.name)
		path = path + '&name=' + encodeURIComponent(param.name);
	path = path + '&group_by_parent=true'
	console.log('merchant api request: ', path);
	const response = await restsv.get(path,null,'token');	
	// console.log('merchant api request '+ path +', response: ', response);
	return response
}


async function addMerchant(accountID, businessUnitID, isNextVisit ){
	let reqBody = {
        merchants: [{
			business_unit_id: businessUnitID,
			is_next_visit: isNextVisit
		}]
	};
	
	const response = await restsv.post('accounts/'+accountID+'/merchants', reqBody, 'token');	
	// console.log("Add Merchants: ", response);
	
	return response
}

async function getMerchantDetail(merchant_id,isIncludeVenues){
	var path = 'merchants/' + merchant_id;
	if(isIncludeVenues){
		path = path + '?include_venues=true';
	}else{
		path = path + '?include_venues=false';
	}
	// console.log("AAAAAAAAAAA getMerchantDetail path:",path);
	const response = await restsv.get(path,null,'token');	
	return response
}

async function deleteMerchant(accountID, merchant_id){
	const response = await restsv.deleteData('accounts/'+accountID+'/merchants/'+merchant_id+'/remove', null, "token");	
	
	return response
}
