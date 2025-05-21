'use strict';
//var update = require('react-addons-update');

export const types = {
    PROFILE_LOADING: 'PROFILE_LOADING',
    PROFILE_ADD: 'PROFILE_ADD',
    PROFILE_UPDATE: 'PROFILE_UPDATE',
    PROFILE_UPDATE_ADDRESSES: 'PROFILE_UPDATE_ADDRESSES',
    PROFILE_REMOVE_ADDRESSES: 'PROFILE_REMOVE_ADDRESSES',
    PROFILE_UPDATE_PHONES: 'PROFILE_UPDATE_PHONES',
    PROFILE_REMOVE_PHONES: 'PROFILE_REMOVE_PHONES',
    PROFILE_REMOVE: 'PROFILE_REMOVE',
    CLEAR_PROFILE: 'CLEAR_PROFILE',
    PROFILE_PHOTO_UPDATE: 'PROFILE_PHOTO_UPDATE'
    
}

export const actionProfileCreators = {
    setRefreshingFlag: (loading) => {
        return { type: types.PROFILE_LOADING, payload: loading }
    },
    add: (item) => {
        return {
            type: types.PROFILE_ADD,
            payload: item
        };
    },

    update_addresses: (item) => {
        return {
            type: types.PROFILE_UPDATE_ADDRESSES,
            payload: item
        };
    },

    update_phones: (item) => {
        return {
            type: types.PROFILE_UPDATE_PHONES,
            payload: item
        };
    },

    update: (item) => {
        return {
            type: types.PROFILE_UPDATE,
            payload: item
        };
    },
    remove: (index) => {
        return {
            type: types.PROFILE_REMOVE,
            payload: index
        };
    },
    remove_address: (item) => {
        return {
            type: types.PROFILE_REMOVE_ADDRESSES,
            payload: item
        };
    },
    remove_phone: (item) => {
        return {
            type: types.PROFILE_REMOVE_PHONES,
            payload: item
        };
    },
    clear: () => {
        return {
            type: types.CLEAR_PROFILE
        };
    },
    profilePhotoUpdate: (url) => {
        return {
            type: types.PROFILE_PHOTO_UPDATE,
            payload: url
        };
    }
}

const initialState = {
    isFetching: false,
    didInvalidate: false,
    profile: {},
    localProfilePhoto: { url: null, uri: null }
};

export default function profileReducer(state = initialState, action) {
    const { profile } = state;
    const {
        type,
        payload
    } = action;

    switch (type) {
        case types.PROFILE_LOADING:
            //console.log("RELOADING STORE: ", payload);
            return {
                ...state,
                isFetching: payload
            }
        case types.PROFILE_ADD:
            // const newAttr = update(profile, {$push: payload});
            return {
                ...state,
                isFetching: false,
                profile: payload,
            }
        case types.PROFILE_UPDATE:
            return {
                ...state,
                profile: Object.assign({}, profile, payload),
            }
        case types.PROFILE_UPDATE_ADDRESSES:
            return {
                ...state,
                profile : {...state.profile,addresses_set : payload}
            }
        case types.PROFILE_UPDATE_PHONES:
            return {
                ...state,
                profile : {...state.profile,phones_set : payload}
            }
        case types.PROFILE_REMOVE_ADDRESSES:
            var addresses = state.profile.addresses_set.filter((p, i) => p.type !== payload.type);
            return {
                ...state,
                profile: {...state.profile,addresses_set: addresses},
            }
        case types.PROFILE_REMOVE_PHONES:
            var phones = state.profile.phones_set.filter((p, i) => p.type !== payload.type);
            return {
                ...state,
                profile: {...state.profile,phones_set: phones},
            }
        case types.PROFILE_REMOVE:
            return {
                ...state,
                profile: profile.filter((p, i) => i !== payload),
            }
        case types.CLEAR_PROFILE:
            return {
                ...state,
                isFetching: false,
                didInvalidate: false,
                profile: [],
            }
        case types.PROFILE_PHOTO_UPDATE:
            {
                var newState = {
                    ...state
                }
                newState.profile.profile_photo_url = payload.url;
                newState.localProfilePhoto = { url: payload.url, uri: payload.uri }
                return newState;
            }
        default:
            return state;
    }

};

function updateObjectInArray(array, action) {
    return array.map((item, index) => {
        if (index !== action.index) {
            return item;
        }

        return {
            ...item,
            ...action.item
        }
    });
}