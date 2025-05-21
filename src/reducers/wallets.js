'use strict';
//var update = require('react-addons-update');

export const types = {
    WALLETS_LOADING: 'WALLETS_LOADING',
    WALLET_INFO_ADD: 'WALLET_INFO_ADD',
    WALLET_ADD_ALLOTMENT_DETAIL: 'WALLET_ADD_ALLOTMENT_DETAIL',
    WALLETS_CLEAR: 'WALLETS_CLEAR'
}

export const actionWalletsCreators = {
    setRefreshingFlag: (loading) => {
        return { type: types.WALLETS_LOADING, payload: loading }
    },
    add_wallet_info: (item) => {
        return { type: types.WALLET_INFO_ADD, payload: item };
    },
    add_allotment_info: (item) => {
        return { type: types.WALLET_ADD_ALLOTMENT_DETAIL, payload: item };
    },
    clear: () => {
        return {
            type: types.WALLETS_CLEAR
        };
    },
}

const initialState = {
    isFetching: false,
    didInvalidate: false,
    wallet_info: {},
    allotment_info: [],
    allotment_any_merchant: []
};

export default function walletsReducer(state = initialState, action) {
    const {
        type,
        payload,
        isAnyMerchant
    } = action;

    switch (type) {
        case types.WALLETS_LOADING:
            return {
                ...state,
                isFetching: payload
            }
        case types.WALLET_INFO_ADD:
            return {
                ...state,
                isFetching: false,
                wallet_info: payload,
            }
        case types.WALLET_ADD_ALLOTMENT_DETAIL:
            var allotment_info = payload.isAnyMerchant ? state.allotment_any_merchant : state.allotment_info;
            if (allotment_info.length == 0) {
                allotment_info.push(payload);
            } else {
                var isExist = false;
                allotment_info.forEach(allotment => {
                    if (allotment.allotmentID == payload.allotmentID) {
                        isExist = true;
                        allotment.expiration_breakdown = payload.expiration_breakdown;
                    }
                });
                if(!isExist){
                    allotment_info.push(payload);
                }
            }
            if (payload.isAnyMerchant)
                return {
                    ...state,
                    isFetching: false,
                    allotment_any_merchant: allotment_info,
                }
            else
                return {
                    ...state,
                    isFetching: false,
                    allotment_info: allotment_info,
                }

        case types.WALLETS_CLEAR:
            return { ...initialState }
        default:
            return state;
    }

};
