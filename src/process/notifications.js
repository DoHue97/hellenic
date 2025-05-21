import { actionNotificationCreators } from '../reducers/notifications';
import { communicationsService } from "../wsinterface/crmapi/communications"
import { getContactId } from "../utils/common"
import { navigateAndReset } from "../utils/util"
import { commonAction } from './common';
import firebase from 'react-native-firebase';
export const notificationsAction = {
    getNotifications,
    setNotificationBadgeNumber,
    markViewedCommunication
}

var isFetchingNotificationsLoaded = false;
async function getNotifications(page,isGetBadgeNumber) {
    var ciid = await getContactId();
    var params = {
        ciid: ciid,
        page: page ? page : 1
    }
    try {
        // if (isFetchingNotificationsLoaded) {
        //     console.log("Notifications THERE IS ANOTHER FETCHING ALREADY");
        //     return;
        // }
        isFetchingNotificationsLoaded = true;
        await AppData.getStore().dispatch(actionNotificationCreators.setRefreshingFlag(true));
        const result = await communicationsService.getCommunications(params);
        // console.log("notifications getNotifications: ", result);
        if (result.data.content) {
            result.data.content = result.data.content.sort(function (a, b) {
                return b.created_on - a.created_on;
            })
        }
        if (result.code == 'OK') {
            await AppData.getStore().dispatch(actionNotificationCreators.add(result.data));
        } else if (result.code == 'TOKEN_EXPIRE') {
            await commonAction.clearData();
            var navigation = await AppData.getRootNavigation();
            navigateAndReset(navigation, "Login");
        }
        else {
            await AppData.getStore().dispatch(actionNotificationCreators.setRefreshingFlag(false));
        }
        if(isGetBadgeNumber)
            setNotificationBadgeNumber();
        isFetchingNotificationsLoaded = false;
        return result;
    } catch (ex) {
        await AppData.getStore().dispatch(actionNotificationCreators.setRefreshingFlag(false));
        console.log("some thing error:", ex);
        isFetchingNotificationsLoaded = false;
        return null;
    }
}

async function markViewedCommunication(id) {
    try {
        const result = await communicationsService.markViewedCommunication(id);
        if (result.code == 'OK')
            getNotifications();
        else if (result.code == 'TOKEN_EXPIRE') {
            await commonAction.clearData();
            var navigation = await AppData.getRootNavigation();
            navigateAndReset(navigation, "Login");
        }
        setNotificationBadgeNumber()
        return result;
    } catch (ex) {
        console.log("notification markViewedCommunication error: ", ex);
    }
}

async function setNotificationBadgeNumber() {
    var ciid = await getContactId();
    var badgeNumber = 0;
    try {
        var params = {
            ciid: ciid,
            viewed: false
        }
        const result = await communicationsService.getCommunications(params);
        if (result.code == 'OK' && result.data && result.data.pages && result.data.pages.total) {
            badgeNumber = result.data.pages.total;
        }
    } catch (ex) {
        console.log("some thing error getNotificationBadgeNumber:", ex);
    }
    firebase.notifications().setBadge(badgeNumber);
}