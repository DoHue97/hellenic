import React, { useState } from 'react'
import PropTypes from 'prop-types';
import { Pressable, StatusBar, StyleSheet, View } from 'react-native';
import { Box, Button, Center, Modal, Text, useTheme } from 'native-base'
import { MenuBarIcon } from './IconsComponent';

function MainHeader(props) {
    const [style, setStyle] = useState({})
    const { leftContent, rightContent, customFlex, hasMenu, navigation, extraHeight } = props;
    
    const styles = useGlobalStyles();
    console.log("AAAA MainHeader props: ", props)

    return (
         <View style={styles.headerContain}>
            <StatusBar color={false} colorValue='rgba(0,0,0,0.0)' />
            <View noBorder noShadow transparent style={{ alignItems:'center' , height: extraHeight ? extraHeight : 70 }}>
                <View style={{ flex: 6, justifyContent:"flex-start", flexDirection:'row', flexWrap:"wrap"}}>
                    {hasMenu && <Pressable 
                        onPress={() => navigation.openDrawer()} 
                        style={{ justifyContent: "center", paddingRight: 10 }}
                    >
                        <MenuBarIcon/>
                    </Pressable>}
                    {leftContent}
                </View>
                {customFlex ? rightContent : 
                (rightContent ? <View style={{ flex: 1, alignItems: 'flex-end', justifyContent:"center" }}>
                    {rightContent}
                </View> : <View/>)}
            </View>
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
    headerContain:{
        paddingLeft: '2%',
        paddingRight: '2%',
        justifyContent: 'center',
        backgroundColor: props.colors.primary[600],
    },
});

MainHeader.propTypes = {
    leftContent: PropTypes.object,
    rightContent: PropTypes.object,
    customFlex: PropTypes.bool,
    hasMenu: PropTypes.bool,
    extraHeight: PropTypes.number,
};

export default MainHeader;