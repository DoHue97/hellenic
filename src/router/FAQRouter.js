import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import FAQs from '../pages/faqs/FAQs';
import FAQDetail from '../pages/faqs/FAQDetail';
import { config_path } from "../config/config_path";

const Stack = createStackNavigator();

export default function FAQRouter() {
    return (
        <Stack.Navigator initialRouteName={config_path.faqs} screenOptions={{ headerShown: false,gestureEnabled:false }}>
            <Stack.Screen name={config_path.faqs} component={FAQs} />
            <Stack.Screen name={config_path.faq_detail} component={FAQDetail} />
        </Stack.Navigator>
    )
}