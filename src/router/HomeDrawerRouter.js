import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { config_path } from "../config/config_path";
import TabBarRouter from '../router/TabBarRouter';
import SideBar from '../pages/sidebar/Sidebar';

const Drawer = createDrawerNavigator();

export default function HomeDrawerRouter(){
    return (
        <Drawer.Navigator 
            drawerType={"back"}
            overlayColor={1}
            drawerStyle={{
                width: '83%',
            }}
            screenOptions={{
                swipeEnabled:false
            }}
            drawerContent={props => <SideBar {...props} />}>
            <Drawer.Screen name={config_path.tab_bar_router} component={TabBarRouter} />
        </Drawer.Navigator>
    );
}