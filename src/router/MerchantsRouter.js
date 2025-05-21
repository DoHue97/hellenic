import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Merchants from '../pages/merchants/Merchants';
import MerchantDetail from '../pages/merchants/MerchantDetail';
import { config_path } from "../config/config_path";

const Stack = createStackNavigator();

export default function MerchantsRouter() {
    return (
        <Stack.Navigator initialRouteName={config_path.merchants} screenOptions={{ headerShown: false,gestureEnabled:false }}>
            <Stack.Screen name={config_path.merchants} component={Merchants} />
            <Stack.Screen name={config_path.merchant_detail} component={MerchantDetail} />
        </Stack.Navigator>
    )
}