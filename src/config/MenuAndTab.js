import React, { Component } from 'react';
import { HomeIcon,HomeIconActive,  OffersIcon,OffersIconActive, MerchantIcon,MerchantIconActive, AccountIcon,AccountIconActive,LogOutIconActive, SpendIconIcon, SpendIconActive } from '../components/IconsComponent';
import { config_path } from './config_path';

export var config = {
    tabBottomNavigation: [
        { name: 'Home', key: "home_title", route: config_path.home, icon: <HomeIcon />,activeIcon: <HomeIconActive/>, isBadge: false },
        { name: 'Offers', key: "offers_title", route: config_path.offers_router, icon: <OffersIcon />,activeIcon:<OffersIconActive/>, isBadge: false },
        { name: 'Merchants', key: "merchants_title", route: config_path.merchants_router, icon: <MerchantIcon />,activeIcon:<MerchantIconActive/>, isBadge: false },
        { name: 'SpendPreferences', key: "spend_title", route: config_path.spend_prefrences, icon: <SpendIconIcon />,activeIcon:<SpendIconActive/> ,isBadge: false },
        { name: 'Accounts',key:"account_title", route: config_path.my_account_router, icon: <AccountIcon />,activeIcon:<AccountIconActive/> ,isBadge: true }
    ],
    menuSidebar: [],
    transactionMonths: [1, 6, 12],
    transactionData: ['Awards', 'Spends', 'Purchases'],
    
}

export function getTabs() {
    var store = AppData.getStore().getState();
    var configuration = store.configuration.appConfig;
    var tabs = config.tabBottomNavigation;
    if (configuration && !configuration.orderVersion) {
        tabs = config.tabBottomNavigation.filter((tab) => {
            return tab.name !== 'Orders';
        })
    }
    return tabs;
}

export function getMenu(language) {
    var store = AppData.getStore().getState();
    var configuration = store.configuration.appConfig;
    var offers = store.offers.offers;
    var menus = language==='ENG' ? config.menuSidebar : config.menuSidebarGR;
    if (configuration && !configuration.voucherVersion) {
        menus = menus.filter((menu) => {
            return menu.name !== 'MyVouchers';
        })
    }
    var isShowReferMenu;
    if (offers.length > 0) {
        for (let i = 0; i < offers.length; i++) {
            if (offers[i].classification == 'REWARD_REFERRALS') {
                isShowReferMenu = true;
            }
        }
    }
    if(!isShowReferMenu){
        menus = menus.filter((menu) => {
            return menu.name !== 'ReferAFriend';
        })
    }
    return menus;
}