import React, { useState } from 'react'
import PropTypes from 'prop-types';
import { HStack, Pressable, Text } from 'native-base'
import { strings } from '../translations';
import { getTabs } from '../config/MenuAndTab';
import { useNavigation } from '@react-navigation/native';

function TabBarBottomComponent(props) {
    const { left, body, right } = props;
    const [active, setActive] = useState(0);
    const navigation = useNavigation();
    const tabs = getTabs();

    const onActiveTab = (route, index) => {
        setActive(index)
        navigation.navigate(route)
    }

    const renderTab = (activeIndex) => {
        var tabBarsComponent = [];
        tabs.map((tab, index) => {
            tabBarsComponent.push(
                <Pressable key={index} flex={1} onPress={() => onActiveTab(tab.route, index)}>
                    {activeIndex == index ? tab.activeIcon : tab.icon}
                    <Text numberOfLines={1}>{strings[tab.key]}</Text>
                </Pressable>
            )
        })
        return tabBarsComponent;
    }

    return (
        <HStack w={'100%'}>
            {renderTab(active)}
        </HStack>
    )
}

TabBarBottomComponent.propTypes = {
    
};

export default TabBarBottomComponent;