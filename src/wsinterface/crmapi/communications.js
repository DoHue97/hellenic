import {restsv} from '../crmapi/restsv';

export const communicationsService = {
    getCommunications,
    getCommunicationDetail,
    markViewedCommunication,
}

async function getCommunications(param){
	var path = "contacts/"+param.ciid+"/communications?type=IN_APP";
	if(param.page)
		path = path + '&page=' + param.page ;
	if(param.viewed!=undefined)
		path = path + '&viewed=' + param.viewed ;
	const response = await restsv.get(path,null,'token');	
	return response
}

async function getCommunicationDetail(communicationID){
	const response = await restsv.get("communications/"+communicationID ,null,'token');	
	return response
}

async function markViewedCommunication(communicationID){
	// console.log('communications markViewedCommunication communicationID: ', communicationID);
	const response = await restsv.put("communications/"+communicationID+"/mark_viewed" ,null,'token');	
	// console.log('communications markViewedCommunication communicationID=' + communicationID + ' : ', response);
	return response
}