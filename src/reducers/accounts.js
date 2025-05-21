'use strict';
export const types = {
    ACCOUNT_LOADING: 'ACCOUNT_LOADING',
    ACCOUNT_ADD: 'ACCOUNT_ADD',
    ACCOUNT_UPDATE: 'ACCOUNT_UPDATE',
    CLEAR_ACCOUNT: 'CLEAR_ACCOUNT',
}


export const actionAccountCreators = {
    setRefreshingFlag: (loading) => {
        return { type: types.ACCOUNT_LOADING, payload: loading }
    },
    add: (item) => {
        return { type: types.ACCOUNT_ADD, payload: item};
    },
    update: (item) => {
        return {
            type: types.ACCOUNT_UPDATE,
            payload: item
        };
    },
    clear: () => {
        return {
            type: types.CLEAR_ACCOUNT
        };
    }
}

const initialState = {
    isFetching: false,
    didInvalidate: false,
    account: {},
};

export default function accountReducer(state = initialState, action) {
    const { account } = state;
    const {
        type,
        payload
    } = action;

    switch (type) {
        case types.ACCOUNT_LOADING:
            return {
                ...state,
                isFetching: payload
            }
        case types.ACCOUNT_ADD:
            return {
                ...state,
                isFetching: false,
                account: payload,
            }
        case types.ACCOUNT_UPDATE:
            return {
                ...state,
                ACCOUNT: Object.assign({}, account, payload),
            }
        case types.CLEAR_ACCOUNT:
            return {
                ...state,
                isFetching: false,
                didInvalidate: false,
                account: {},
            }
        default:
            return state;
    }

};



