'use strict';
//var update = require('react-addons-update');

export const types = {
    MERCHANTS_LOADING: 'MERCHANTS_LOADING',
    MERCHANTS_ADD: 'MERCHANTS_ADD',
    MERCHANTS_UPDATE: 'MERCHANTS_UPDATE',
    MERCHANTS_DETAIL: 'MERCHANTS_DETAIL',
    MERCHANTS_CLEAR: 'MERCHANTS_CLEAR'
}

export const actionMerchantsCreators = {
    setRefreshingFlag: (loading) => {
        return { type: types.MERCHANTS_LOADING, payload: loading }
    },
    add: (item) => {
        return { type: types.MERCHANTS_ADD, payload: item };
    },
    update: (item) => {
        return { type: types.MERCHANTS_UPDATE, payload: item };
    },
    merchants_detail: (item) => {
        return { type: types.MERCHANTS_DETAIL, payload: item };
    },
    clear: () => {
        return {
            type: types.MERCHANTS_CLEAR
        };
    },
}

const initialState = {
    isFetching: false,
    didInvalidate: false,
    merchants: [],
    paging:{},
    merchant_detail: {}
};

export default function merchantsReducer(state = initialState, action) {
    const {
        type,
        payload
    } = action;

    switch (type) {
        case types.MERCHANTS_LOADING:
            return {
                ...state,
                isFetching: payload
            }
        case types.MERCHANTS_ADD:
            var merchants = state.merchants;
            var page = state.paging.page;
            var newMerchants = [];
            if (page === payload.paging.page || payload.paging.page===1 || merchants.length === 0)
                newMerchants = payload.content;
            else
                newMerchants = merchants.concat(payload.content);
            // console.log("newMerchants:",newMerchants);
            return {
                ...state,
                isFetching: false,
                merchants: newMerchants,
                paging: payload.paging
            }
        case types.MERCHANTS_UPDATE:
            return {
                ...state,
                isFetching: false,
                mechants: state.merchants.map((mechant, index) => {
                    if (mechant.id == payload.id) {
                        return {
                            ...mechant,
                            detail: payload.detail
                        }
                    }
                    return mechant;
                })
            }
        case types.MERCHANTS_CLEAR:
            return {
                ...state,
                isFetching: false,
                didInvalidate: false,
                merchants: []
            }
        case types.MERCHANTS_DETAIL:
            return {
                ...state,
                merchant_detail: payload
            }
        default:
            return state;
    }

};
