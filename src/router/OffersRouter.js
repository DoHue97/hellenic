import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Offers from '../pages/offers/Offers';
import OfferDetail from '../pages/offers/OfferDetail';
import { config_path } from "../config/config_path";

const Stack = createStackNavigator();

export default function OffersRouter() {
    return (
        <Stack.Navigator initialRouteName={config_path.offers} screenOptions={{ headerShown: false,gestureEnabled:false }}>
            <Stack.Screen name={config_path.offers} component={Offers} />
            <Stack.Screen name={config_path.offer_detail} component={OfferDetail} />
        </Stack.Navigator>
    )
}
