import { restsv } from './restsv';

export const walletsService = {
	getWalletInfo,
	getWalletDetail,
	getWalletTransaction,
	getPaymentMethod,
	getgetWalletTransactionDetail,
	getPurchases,
	getToken,
	getWalletAllotment
}


async function getWalletInfo(ciid) {
	var path = "contacts/" + ciid + "/wallets";
	const response = await restsv.get(path, null, 'token');
	return response;
}
async function getWalletDetail(walletid) {
	var path = "wallets/" + walletid;
	// console.log('wallet api getWalletDetail request: ', path);
	const response = await restsv.get(path, null, 'token');
	// console.log('wallet api getWalletDetail response: ', response);
	return response
}

async function getWalletTransaction(ciid) {
	var path = "contacts/" + ciid + "/wallet_transactions";
	const response = await restsv.get(path, null, 'token');
	return response
}

async function getPaymentMethod(ciid) {
	var path = "contacts/" + ciid + "/payment_methods";
	const response = await restsv.get(path, null, 'token');
	return response
}

async function getgetWalletTransactionDetail(transactionID) {
	var path = "wallet_transactions/" + transactionID;
	const response = await restsv.get(path, null, 'token');
	return response
}

async function getPurchases(ciid, page, size) {
	var path = "contacts/" + ciid + "/purchases";
	path = path + '?sort=CREATED_DATE&order=DESC&page=' + (page ? page : 1);
	if(size)
	{
		path = path + '&size=' + size;
	}
	// console.log('wallet api purchase request: ', path);
	const response = await restsv.get(path, null, 'token');
	return response
}

async function getToken() {
	return await restsv.getToken();
}

async function getWalletAllotment(walletID,allotmentID){
	var path = "wallets/" + walletID + "/allotments/" + allotmentID;
	const response = await restsv.get(path, null, 'token');
	return response;
}

