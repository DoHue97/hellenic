'use strict';

export const types = {
    NOTIFICATIONS_LOADING: 'NOTIFICATIONS_LOADING',
    NOTIFICATIONS_ADD: 'NOTIFICATIONS_ADD',
    NOTIFICATIONS_UPDATE: 'NOTIFICATIONS_UPDATE',
    NOTIFICATIONS_SET_BADGE_NUMBER: 'NOTIFICATIONS_SET_BADGE_NUMBER',
    NOTIFICATIONS_CLEAR: 'NOTIFICATIONS_CLEAR'
}


export const actionNotificationCreators = {
    setRefreshingFlag: (loading) => {
        return { type: types.NOTIFICATIONS_LOADING, payload: loading }
    },
    add: (item) => {
        return { type: types.NOTIFICATIONS_ADD, payload: item };
    },
    update: (item) => {
        return {
            type: types.NOTIFICATIONS_UPDATE,
            payload: item
        };
    },
    setBadgeNumber: (item) => {
        return {
            type: types.NOTIFICATIONS_SET_BADGE_NUMBER,
            payload: item
        };
    },
    clear: () => {
        return {
            type: types.NOTIFICATIONS_CLEAR
        };
    },
}

const initialState = {
    isFetching: false,
    isDeleting: false,
    isLoadingDetail: false,
    didInvalidate: false,
    notifications: [],
    paging: {},
    badgeNumber:0
};

export default function notificationsReducer(state = initialState, action) {
    const {
        type,
        payload
    } = action;

    switch (type) {
        case types.NOTIFICATIONS_LOADING:
            return {
                ...state,
                isFetching: payload
            }
        case types.NOTIFICATIONS_ADD:
            // console.log("payload:",payload);
            var notifications = state.notifications;
            var page = state.paging.page;
            var newNotifications = [];
            if ((page === payload.pages.page && payload.pages.page===1) || notifications.length === 0 || payload.pages.page===1)
                newNotifications = payload.content;
            else if (page === payload.pages.page && payload.pages.page > 1) {
                if (notifications.length == payload.content.length) {
                    newNotifications = notifications.concat(payload.content);
                } else {
                    newNotifications = notifications;
                }
            } else {
                newNotifications = notifications.concat(payload.content);
            }
            return {
                ...state,
                isFetching: false,
                notifications: newNotifications.sort(function (a, b) {
                    return b.created_on - a.created_on;
                }),
                paging: payload.pages
            }
        case types.NOTIFICATIONS_UPDATE:
            // console.log("payload:",payload);
            var notifications = state.notifications;
            var newNotifications = notifications.map(notification => {
                return notification.id === payload.id ? payload : notification
            })
            // console.log("newNotifications:",newNotifications);
            return {
                ...state,
                notifications: newNotifications
            }
        case types.NOTIFICATIONS_SET_BADGE_NUMBER:
            return {
                ...state,
                badgeNumber: payload
            }
        case types.NOTIFICATIONS_CLEAR:
            return {
                ...initialState,
            }
        default:
            return state;
    }

};
