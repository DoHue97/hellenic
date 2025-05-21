'use strict';
//var update = require('react-addons-update');

export const types = {
    PURCHASES_LOADING: 'PURCHASES_LOADING',
    PURCHASE_INFO_ADD: 'PURCHASE_INFO_ADD',
    PURCHASES_CLEAR: 'PURCHASES_CLEAR',
    PURCHASES_UPDATE: 'CARD_UPDATE'
}

export const actionPurchasesCreators = {
    setRefreshingFlag: (loading) => {
        return { type: types.PURCHASES_LOADING, payload: loading }
    },
    add: (item) => {
        return { type: types.PURCHASE_INFO_ADD, payload: item };
    },
    update: (item) => {
        return {
            type: types.PURCHASES_UPDATE,
            payload: item
        };
    },
    clear: () => {
        return {
            type: types.PURCHASES_CLEAR
        };
    }
}

const initialState = {
    isFetching: false,
    didInvalidate: false,
    purchase_info: [],
    paging: {}
};

export default function purchasesReducer(state = initialState, action) {
    const {
        type,
        payload
    } = action;

    switch (type) {
        case types.PURCHASES_LOADING:
            return {
                ...state,
                isFetching: payload
            }
        case types.PURCHASE_INFO_ADD:
            var purchase_info = state.purchase_info;
            var page = state.paging.page;
            var newPurchases = [];
            if ((page && page === payload.paging.page) || payload.paging.page===1 || purchase_info.length === 0)
                newPurchases = payload.content;
            else{
                newPurchases = purchase_info.concat(payload.content);
            }
            return {
                ...state,
                isFetching: false,
                purchase_info: newPurchases,
                paging: payload.paging
            }
        case types.PURCHASES_CLEAR:
            return { ...initialState }
        default:
            return state;
    }

};
