'use strict';
//var update = require('react-addons-update');

export const types = {
    STORE_LANGUAGE: 'STORE_LANGUAGE',
    UPDATE_LANGUAGE: 'UPDATE_LANGUAGE',
    CLEAR_LANGUAGE: 'CLEAR_LANGUAGE',
}

export const actionLanguageCreators = {
    add: (item) => {
        return {
            type: types.STORE_LANGUAGE,
            payload: item
        };
    },
    update: (item) => {
        return {
            type: types.UPDATE_LANGUAGE,
            payload: item
        };
    },
    clear: () => {
        return {
            type: types.CLEAR_LANGUAGE,
        };
    },
}

const initialState = {
    language: [],
};

export default function language(state = initialState, action) {
    const {
        type,
        payload
    } = action;

    switch (type) {
        case types.STORE_LANGUAGE:
            return {
                ...state,
                language: payload,
            }
          case types.UPDATE_LANGUAGE:
            return {
                ...state,
                language: payload,
            }
        case types.CLEAR_LANGUAGE:
            return {
                ...state,
                language: [],
            }
        default:
            return state;
    }

};
