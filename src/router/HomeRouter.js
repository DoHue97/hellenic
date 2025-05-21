import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Home from '../pages/home/Home';
import AllotmentDetail from '../pages/home/AllotmentDetail';
import { config_path } from "../config/config_path";

const Stack = createStackNavigator();

export default function HomeRouter() {
    return (
        <Stack.Navigator initialRouteName={config_path.home} screenOptions={{ headerShown: false,gestureEnabled:false }}>
            <Stack.Screen name={config_path.home} component={Home} />
            <Stack.Screen name={config_path.allotment_detail} component={AllotmentDetail} />
        </Stack.Navigator>
    )
}