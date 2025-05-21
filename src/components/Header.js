import React, { useState } from 'react'
import PropTypes from 'prop-types';
import { StatusBar, StyleSheet, View } from 'react-native';
import { Button, HStack, Heading, Text, useTheme } from 'native-base'
import { BackIcon, MenuBarIcon } from './IconsComponent';

function Header(props) {
    const { hideLeft, leftCustom, rightCustom, title, isDrawer } = props;
    const classes = useGlobalStyles();
    const { colors } = useTheme();

    return (
        <View>
            <StatusBar backgroundColor={'rgba(0,0,0,0.5)'}/>
            <HStack w={'100%'}>
                {hideLeft ? <View></View> : <View>
                    {leftCustom ? <HStack>
                        <Button onPress={() => leftCustom.onLeftAction()} leftIcon={leftCustom.icon ? leftCustom.icon : undefined}>
                            <Text>{leftCustom.text}</Text>
                        </Button>
                    </HStack> : <HStack>
                        <Button>
                            {isDrawer ? <MenuBarIcon /> : <BackIcon />}
                        </Button>
                    </HStack>}
                </View>}
                {title && <HStack>
                    <Heading>{title}</Heading>
                </HStack>}
                {rightCustom ? <HStack>
                    <Button onPress={() => rightCustom.onRightAction()} leftIcon={rightCustom.icon ? rightCustom.icon : undefined}>                        
                        <Text>{rightCustom.text}</Text>
                    </Button>
                </HStack> : <View></View>}
            </HStack>
        </View>
    )
}

function useGlobalStyles() {
    const { colors } = useTheme();
    // We only want to recompute the stylesheet on changes in color.
    const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
    return styles;
}

const getGlobalStyles = (props) => StyleSheet.create({
    
});

Header.propTypes = {
    leftCustom: PropTypes.object,
    rightCustom: PropTypes.object,
    title: PropTypes.string,
    isDrawer: PropTypes.bool,
    hideLeft: PropTypes.bool,
};

export default Header;