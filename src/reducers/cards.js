'use strict';

export const types = {
    CARD_LOADING: 'CARD_LOADING',
    CARD_ADD: 'CARD_ADD',
    CARD_UPDATE: 'CARD_UPDATE',
    CARD_CLEAR: 'CARD_CLEAR'
}


export const actionCardCreators = {
    setRefreshingFlag: (loading) => {
        return {type:   types.CARD_LOADING, payload: loading}
    },
    add: (item) => {
        return { type: types.CARD_ADD, payload: item};
    },
    update: (item) => {
        return { 
            type: types.CARD_UPDATE, 
            payload: item
        };
    },
    clear: () => {
        return {
            type: types.CARD_CLEAR
        };
    },
}

const initialState = {
    isFetching: false,
    isDeleting: false,
    isLoadingDetail: false,
    didInvalidate: false,
    cards: [],
};

export default function cardsReducer(state = initialState, action) {
    const { cards } = state;
    const {
        type,
        payload
    } = action;

    switch (type) {
        case types.CARD_LOADING:
            return {
                ...state,
                isFetching: payload
            }
        case types.CARD_ADD:
            return {
                ...state,
                isFetching: false,
                cards: payload,
            }
        case types.CARD_CLEAR:
                return {
                    ...initialState
                }
        default:
            return state;
    }

};
