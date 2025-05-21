import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import MyAccount from '../pages/my-account/MyAccount';
// import Profile from '../pages/profile/Profile';
import MyCards from '../pages/my-cards/MyCards';
import Transactions from '../pages/transactions/Transactions';
import Notifications from '../pages/notifications/Notifications';
import NotificationDetail from '../pages/notifications/NotificationDetail';
import ProfileSetting from '../pages/profile/ProfileSetting';
import ProfileEmail from '../pages/profile/ProfileEmail';
import { config_path } from "../config/config_path";

const Stack = createStackNavigator();

export default function MyAccountRouter() {
    return (
        <Stack.Navigator initialRouteName={config_path.my_account} screenOptions={{ headerShown: false,gestureEnabled:false }}>
            <Stack.Screen name={config_path.my_account} component={MyAccount} />
            <Stack.Screen name={config_path.my_cards} component={MyCards} />
            <Stack.Screen name={config_path.transactions} component={Transactions} />
            <Stack.Screen name={config_path.notifications} component={Notifications} />
            <Stack.Screen name={config_path.notification_detail} component={NotificationDetail} />
            <Stack.Screen name={config_path.profile_setting} component={ProfileSetting} />
            <Stack.Screen name={config_path.profile_email} component={ProfileEmail} />
        </Stack.Navigator>
    )
}