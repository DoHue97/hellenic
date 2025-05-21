'use strict';
//var update = require('react-addons-update');

export const types = {
    STORE_CONFIG: 'STORE_CONFIG',
    UPDATE_CONFIG: 'UPDATE_CONFIG',
    CLEAR_CONFIG: 'CLEAR_CONFIG',
    CONFIG_MW:'CONFIG_MW',
    APP_CONFIG : 'APP_CONFIG',
    CONFIG_THEME:'CONFIG_THEME',
    STORE_INDUSTRY: 'STORE_INDUSTRY',
    UPDATE_INDUSTRY: 'UPDATE_INDUSTRY',
}

export const actionConfigCreators = {
    add: (item) => {
        return {
            type: types.STORE_CONFIG,
            payload: item
        };
    },
    addIndustry: (item) => {
        return {
            type: types.STORE_INDUSTRY,
            payload: item
        };
    },
    add_app_config: (item) =>{
        return {
            type: types.APP_CONFIG,
            payload: item
        };
    },
    update: (item) => {
        return {
            type: types.UPDATE_CONFIG,
            payload: item
        };
    },
    updateIndustry: (item) => {
        return {
            type: types.UPDATE_INDUSTRY,
            payload: item
        };
    },
    add_config_mw: (item) => {
        return {
            type: types.CONFIG_MW,
            payload: item
        }; 
    },
    update_theme: (item) => {
        return {
            type: types.CONFIG_THEME,
            payload: item
        };
    },
    clear: () => {
        return {
            type: types.CLEAR_CONFIG,
        };
    },
}

const initialState = {
    config: {},
    mwURL : '',
    appConfig:{
        max_addresses : 8,
        max_phones : 8,
        version : undefined,
        labels :{}
    },
    appTheme: {},
    industries: []
};

export default function configuration(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case types.STORE_CONFIG:
            return {
                ...state,
                config: payload,
            }
        case types.STORE_INDUSTRY:
            return {
                ...state,
                industries: payload,
            }
        case types.APP_CONFIG:
            return {
                ...state,
                appConfig: payload,
            }
        case types.CONFIG_MW:
            return {
                ...state,
                mwURL: payload,
            }
        case types.UPDATE_CONFIG:
            return {
                ...state,
                config: payload,
            }
        case types.UPDATE_INDUSTRY:
            return {
                ...state,
                industries: payload,
            }
        case types.CONFIG_THEME:
            return {
                ...state,
                appTheme: payload,
            }
        case types.CLEAR_CONFIG:
            return {
                ...state,
                config: {},
                mwURL:''
            }
        default:
            return state;
    }

};
