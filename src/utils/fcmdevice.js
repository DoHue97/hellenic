import { userAction } from "../process/user";
import { RESULTS, requestNotifications, checkNotifications, NotificationOption, openSettings } from 'react-native-permissions';
import { Alert, Platform } from 'react-native';
import DeviceInfo, { getSystemVersion } from 'react-native-device-info';
import AppData from '../utils/store'
import { notificationsAction } from '../process/notifications';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
var BadgeAndroid = require('react-native-android-badge');
import firebase, { Notification, NotificationOpen, HmsPushInstanceId, HmsPushMessaging, HmsPushEvent, RNRemoteMessage, HmsLocalNotification } from 'alias_firebase_kit';

import { appConfig } from "../../appconfig";
import { getData, storeMappingMessage } from "./common";
import { strings } from "../translations";

export const fcmUtils = {
    initFCM,
    clearFCM,
}
console.log('HmsPushEvent:', HmsPushEvent)
if (appConfig.is_huawei) {
    HmsPushMessaging.setBackgroundMessageHandler((dataMessage) => {
        var messageData = processDataNotificationHuawei(dataMessage);
        HmsLocalNotification.localNotification({
            [HmsLocalNotification.Attr.title]: messageData.title,
            [HmsLocalNotification.Attr.message]: messageData.notification_id,
            [HmsLocalNotification.Attr.bigText]: messageData.sub_title,
            [HmsLocalNotification.Attr.largeIcon]: "ic_launcher",
            [HmsLocalNotification.Attr.smallIcon]: "ic_launcher",
        })
            .then((result) => {

            })
            .catch((err) => {
                console.log(
                    "[LocalNotification Default] Error/Exception: ", JSON.stringify(err)
                );
            });

        return Promise.resolve();
    });
}
async function initFCMHuawei() {
    HmsPushInstanceId.getToken("")
        .then((result) => {
            fcmDevices(result.result);
            console.log("getToken", result.result);
        })
        .catch((err) => {
            console.log("[getToken] Error/Exception: ", JSON.stringify(err));
        });
    HmsPushMessaging.getInitialNotification()
        .then((result) => {
            console.log("getInitialNotification", result);
            const notification = result.result.extras && result.result.extras.notification ? result.result.extras.notification : null;
            console.log("notification:", notification);
            if (notification) {
                redirectToNotificationDetail(notification.message);
            }
        })
        .catch((err) => {
            console.log(
                "[getInitialNotification] Error/Exception: ", JSON.stringify(err)
            );
        });
    HmsPushEvent.onRemoteMessageReceived(event => {
        console.log('event:', event);
        var messageData = processDataNotificationHuawei(event.msg);
        console.log("messageData:", messageData);
        HmsLocalNotification.localNotification({
            [HmsLocalNotification.Attr.title]: messageData.title,
            [HmsLocalNotification.Attr.message]: messageData.notification_id,
            [HmsLocalNotification.Attr.bigText]: messageData.sub_title,
            [HmsLocalNotification.Attr.largeIcon]: "ic_launcher",
            [HmsLocalNotification.Attr.smallIcon]: "ic_launcher",
        })
            .then((result) => {

            })
            .catch((err) => {
                console.log(
                    "[LocalNotification Default] Error/Exception: ", JSON.stringify(err)
                );
            });
        return Promise.resolve();

    });
    HmsPushEvent.onNotificationOpenedApp((result) => {
        console.log("onNotificationOpenedApp", result);
        const notification = result.extras && result.extras.notification ? result.extras.notification : null;
        if (notification) {
            redirectToNotificationDetail(notification.message);
        }
    });
}

async function initFCM(dispatch) {
    if (appConfig.is_huawei) {
        initFCMHuawei();
        return null;
    }
    else {
        const authStatus = await requestNotificationsPermission(true);
        console.log("authStatus:", authStatus);
        const enabled = authStatus.status == RESULTS.GRANTED;
        if (enabled) {
            AppData.setStatusInitFCM(true);
            if (Platform.OS === 'ios') {
                return await initFCMIOS(dispatch);
            } else if (Platform.OS === 'android') {
                createNotificationChannel();
                return await initFCMAndroid(dispatch);
            }
        }

    }
}

export async function requestNotificationsPermission() {
    const options: NotificationOption[] = ['alert', 'badge', 'sound'];
    const androidVersion = await getSystemVersion();
    const isAndroid13Plus = androidVersion < 13 ? false : true;
    console.log("isAndroid13Plus:", isAndroid13Plus);
    const checkPermissionResult = await checkNotifications();
    console.log("checkPermissionResult:", checkPermissionResult);
    if (checkPermissionResult.status == RESULTS.DENIED) {
        return await requestNotifications(options);
    } else if (checkPermissionResult.status == RESULTS.GRANTED) {
        return checkPermissionResult;
    } else if (checkPermissionResult.status == RESULTS.BLOCKED) {
        if (!isAndroid13Plus || Platform.OS == 'ios') {
            alertForNotificationPermission();
            return checkPermissionResult;
        } else {
            console.log("requestNotifications:", await requestNotifications(options));
            return await requestNotifications(options);
        }
    } else {
        return await requestNotifications(options);
    }
}

export function alertForNotificationPermission() {
    var message = strings.access_notification_denied;
    Alert.alert(
        null,
        message,
        [
            { text: strings.btn_cancel_settings, onPress: () => { return true } },
            { text: strings.open_settings, onPress: openSettings.bind(this) }
        ]
    )
}



function createLocalPushNotification(title, body, data) {
    //console.log('data:', data);
    const notification = new firebase.notifications.Notification()
        .setNotificationId("1") // Any random ID
        .setTitle(title) // Title of the notification
        .setBody(body) // body of notification
        .setData(data)
        .android.setPriority(firebase.notifications.Android.Priority.High) // set priority in Android
        .android.setChannelId("hellenicLocalPush") // should be the same when creating channel for Android
        .android.setAutoCancel(true); // To remove notification when tapped on it
    return notification;
}

function createNotificationChannel() {
    // Build a android notification channel
    const channel = new firebase.notifications.Android.Channel(
        "hellenicLocalPush", // channelId
        "Hellenic Local Push Notification", // channel name
        firebase.notifications.Android.Importance.High // channel importance
    ).setDescription("Used for hellenic local push notification"); // channel description
    firebase.notifications().android.createChannel(channel);
};

async function initFCMAndroid(dispatch) {
    AppData.setStatusInitFCM(false);
    let count = 0;
    let fcmToken = await firebase.messaging().getToken();
    fcmDevices(fcmToken);

    firebase.notifications().getInitialNotification().then(notification => {
        if (notification) {
            var data: Notification = notification.notification;
            if (data) {
                var notification_id = data.data ? data.data.notification_id : null;
                if (notification_id) {
                    redirectToNotificationDetail(notification_id);
                }

            }
        }
        //TODO: call function to load notification and open NOTIFICAITON PAGE
    }
    );
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened(async (notification) => {
        var data: NotificationOpen = notification.notification;
        if (data) {
            var notification_id = data.data ? data.data.notification_id : null;
            if (notification_id) {
                redirectToNotificationDetail(notification_id);
            }

        }
    });


    firebase.notifications().onNotification(async (notification) => {
        if (notification) {
            var title = notification._title;
            var body = notification._body;
            if (title && body) {
                var localNotification = createLocalPushNotification(title, body, notification.data);
                firebase.notifications().displayNotification(localNotification);
            }
        }

    })

    //register for token change and update CRM
    firebase.messaging().onTokenRefresh(token => {
        fcmDevices(token);
    });

    return count;
}



async function initFCMIOS(dispatch) {
    console.log("AAAAAAAAAA initFCMIOS")
    console.log("AAAAAAAAAA initFCMIOS")
    console.log("AAAAAAAAAA initFCMIOS")
    console.log("AAAAAAAAAA initFCMIOS")
    console.log("AAAAAAAAAA initFCMIOS")
    AppData.setStatusInitFCM(false);
    let count = 0;
    //console.log('XXXXXXXXXXXXXXXXXX: initFCMIOS');
    firebase.notifications().onNotification(async (notification) => {
        if (notification) {
            var title = notification._title;
            var body = notification._body;
            if (title && body) {
                var localNotification = createLocalPushNotification(title, body, notification.data);
                firebase.notifications().displayNotification(localNotification);
            }
        }
    })

    this.notificationOpenedListener = firebase.notifications().onNotificationOpened(async (notification) => {
        var data: NotificationOpen = notification.notification;
        if (data) {
            var notification_id = data.data ? data.data.notification_id : null;
            if (notification_id) {
                redirectToNotificationDetail(notification_id);
            }

        }
    });
    firebase.messaging().onTokenRefresh(token => {
        console.log("onTokenRefresh onTokenRefresh:",token);
        fcmDevices(token);
    });

    // var apnToken = await firebase.messaging().ios.getAPNSToken();
    // console.log("apnToken apnToken:",apnToken);

    // if (apnToken) {
    //     fcmDevices(apnToken);
    // } else {
    //     // firebase.messaging().ios.registerForRemoteNotifications().then(() => {
    //     //     firebase.messaging().ios.getAPNSToken().then((token) => {
    //     //         fcmDevices(token);
    //     //     })
    //     // });
    //     PushNotificationIOS.addEventListener("register", async (deviceToken) => {
    //         fcmDevices(deviceToken);
    //     });
    // }
    await AppData.setFCMInitStatus(true);
    return count;
}


export async function fcmDevices(fcmToken) {
    console.log("fcmToken:", fcmToken);
    var payload =
    {
        deviceInfo: {
            deviceId: DeviceInfo.getUniqueId(),
            osName: DeviceInfo.getSystemName(),
            osVersion: DeviceInfo.getSystemVersion(),
            appId: 'HellenicBank',
            appVersion: DeviceInfo.getVersion(),
            platForm: Platform.OS
        },
        fcmToken: fcmToken
    };
    // console.log("payload:", payload);
    let platform = appConfig.is_huawei ? 'HUAWEI' : Platform.OS.toUpperCase();
    let result = await userAction.addContactDevice(payload.deviceInfo.deviceId,
        payload.fcmToken, platform);
    console.log("fcmDevices result:", result);
    return result;
}

export async function deleteFcmDevices() {
    var payload =
    {
        deviceInfo: {
            deviceId: DeviceInfo.getUniqueId(),
            osName: DeviceInfo.getSystemName(),
            osVersion: DeviceInfo.getSystemVersion(),
            appId: 'HellenicBank',
            appVersion: DeviceInfo.getVersion(),
            platForm: Platform.OS
        }
    };
    await userAction.deleteContactDevice(payload.deviceInfo.deviceId);
}
export async function clearFCM() {
    try {
        console.log("CLEARRRRRR");
        if (appConfig.is_huawei) {
            HmsPushInstanceId.deleteToken("")
                .then((result) => {
                    this.log("deleteToken", result);
                })
                .catch((err) => {
                    alert("[deleteToken] Error/Exception: " + JSON.stringify(err));
                });
        }
        else {
            //TODO: handle badge icon reset here
            firebase.notifications().removeAllDeliveredNotifications();
            firebase.notifications().cancelAllNotifications();
            firebase.notifications().setBadge(0);
            if (Platform === 'android')
                BadgeAndroid.setBadge(0);
            if (Platform === 'ios') {
                PushNotificationIOS.setApplicationIconBadgeNumber(0);
                PushNotificationIOS.removeAllDeliveredNotifications();
            }
        }
        await deleteFcmDevices();
    } catch (e) {
        console.log('Exception clearin fcm:', e);
    }
}

async function redirectToNotificationDetail(notiId) {
    var navigation = await AppData.getRootNavigation();
    navigation.navigate("NotificationDetail", { from: 'push', notificationID: notiId });
    // var notifications = [];
    // var loadNotifications = await notificationsAction.getNotifications();
    // if(loadNotifications.code==='OK')
    //     notifications = loadNotifications.data.content;

    // var findNotifications = notifications.filter(noti => {
    //     return noti.id === notiId;
    // })

    // if(findNotifications.length > 0){
    //     await notificationsAction.markViewedCommunication(notiId);
    //     var navigation = await AppData.getRootNavigation();
    //     navigation.navigate("NotificationDetail",{data:findNotifications[0]});
    // }
}

function processDataNotificationHuawei(msg) {
    const RNRemoteMessageObj = new RNRemoteMessage(msg);
    var data = RNRemoteMessageObj.getData();
    if (data) {
        try {
            data = JSON.parse(data);
        } catch (error) {
            data = data.replace(/'/g, '"');
            data = JSON.parse(data);
        }
    }
    return data;
}