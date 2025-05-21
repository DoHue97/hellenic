'use strict';
//var update = require('react-addons-update');

export const types = {
    OFFERS_LOADING: 'OFFERS_LOADING',
    OFFERS_ADD: 'OFFERS_ADD',
    OFFERS_ADD_CATEGORIES: 'OFFERS_ADD_CATEGORIES',
    OFFERS_CLEAR: 'OFFERS_CLEAR'
}

export const actionOffersCreators = {
    setRefreshingFlag: (loading) => {
        return {type:   types.OFFERS_LOADING, payload: loading}
    },
    add: (item) => {
        return { type: types.OFFERS_ADD, payload: item};
    },
    add_categories: (item) => {
        return { type: types.OFFERS_ADD_CATEGORIES, payload: item};
    },
    clear: () => {
        return {
            type: types.OFFERS_CLEAR
        };
    },
}

const initialState = {
    isFetching: false,
    didInvalidate: false,
    offers: [],
    offer_categories: [],
    paging:{}
};

export default function offersReducer(state = initialState, action) {
    const {
        type,
        payload
    } = action;

    switch (type) {
        case types.OFFERS_LOADING:
            return {
                ...state,
                isFetching: payload
            }
        case types.OFFERS_ADD:
            var offers = state.offers;
            var page = state.paging.page;
            var newOffers = [];
            if(page===payload.paging.page || payload.paging.page===1 || offers.length ===0)
                newOffers = payload.content;
            else
                newOffers = offers.concat(payload.content);
            return {
                ...state,
                isFetching: false,
                offers: newOffers,
                paging: payload.paging
            }
        case types.OFFERS_ADD_CATEGORIES:
            return {
                ...state,
                offer_categories: payload
            }
        case types.OFFERS_CLEAR:
            return {
                ...initialState,
            }
        default:
            return state;
    }

};
