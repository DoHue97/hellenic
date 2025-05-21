import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Profile from '../pages/profile/Profile';
import ProfileEmail from '../pages/profile/ProfileEmail';
import { config_path } from "../config/config_path";

const Stack = createStackNavigator();

export default function ProfileRouter() {
    return (
        <Stack.Navigator initialRouteName={config_path.profile} screenOptions={{ headerShown: false, gestureEnabled:false }}>
            <Stack.Screen name={config_path.profile} component={Profile} />
            <Stack.Screen name={config_path.profile_email} component={ProfileEmail} />
        </Stack.Navigator>
    )
}