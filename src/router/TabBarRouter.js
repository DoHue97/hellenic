import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Home from '../pages/home/Home';
import SpendPreferences from '../pages/spend-preferences/SpendPreferences';
import HomeRouter from '../router/HomeRouter';
import OffersRouter from '../router/OffersRouter';
import MerchantsRouter from '../router/MerchantsRouter';
import MyAccountRouter from '../router/MyAccountRouter';
import TabBarBottomComponent from '../components/TabBarBottomComponent';
import { getTabs } from '../config/MenuAndTab';
import { config_path } from '../config/config_path';
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator tabBar={props => <TabBarBottomComponent parentProps={props} tabBars={getTabs()}/>}>
            <Tab.Screen name={config_path.home_page_router} component={HomeRouter} />
            <Tab.Screen name={config_path.offers_router} component={OffersRouter} />
            <Tab.Screen name={config_path.merchants_router} component={MerchantsRouter}/>
            <Tab.Screen name={config_path.spend_prefrences} component={SpendPreferences}/>
            <Tab.Screen name={config_path.my_account_router} component={MyAccountRouter}/>
        </Tab.Navigator>
    );
}

export default TabNavigator;