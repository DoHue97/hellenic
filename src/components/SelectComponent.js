import React, { useState } from 'react'
import PropTypes from 'prop-types';
import { Dimensions, Image, PixelRatio, Platform, StyleSheet, View } from 'react-native';
import { FlatList, Pressable, Text, useTheme } from 'native-base'
import { ArrowDown } from './IconsComponent';
import { main_styles } from '../theme/main_styles';

const masterCard = require('../../assets/icons/mastercard.png');
const visaCard = require('../../assets/icons/visa.png');

function SelectComponent(props) {
    const { onClickSelectComponent, onValueChange, data, placeHolder, renderItem, value } = props;
    const [showMenuItem, setShowMenuItem] = useState(false)

    const styles = useGlobalStyles();
    console.log("AAAA SelectComponent props: ", props)

    const onToggleMenu = () => {
        setShowMenuItem(!showMenuItem)
        onClickSelectComponent();
    }

    const onHide = (item) => {
        setShowMenuItem(false)
        if (onValueChange) onValueChange(item)
    }

    const getObjectByValue = (data, value) => {
        if (value) {
            let values = data.filter(e => e.id === value);
            if (values.length > 0) return values[0];
            else return null;
        }
        return null;
    }
    let selectedValue = getObjectByValue(data,value);
    return (
        
        <View style={{ width: '100%' }}>
            <Pressable onPress={onToggleMenu} style={showMenuItem ? [styles.selectboxStyle, styles.selectboxStyleShowItem] : styles.selectboxStyle}>
                <View style={{ marginRight: 16 }}>
                    {selectedValue && selectedValue.brand && selectedValue.brand === 'MASTER_CARD' && <Image resizeMode={'contain'} source={masterCard} style={{ width: 30, height: 30 }} />}
                    {selectedValue && selectedValue.brand && selectedValue.brand === 'VISA' && <Image resizeMode={'contain'} source={visaCard} style={{ width: 30, height: 30 }} />}
                </View>
                <View style={{ flex:5 }}>
                    {selectedValue ? <Text>{selectedValue.card_number}</Text> : <Text>{placeHolder}</Text> }
                    {selectedValue && selectedValue.classification_name ? <Text style={{textTransform:'capitalize'}}>{selectedValue.classification_name}{selectedValue.funding_type ? " " + selectedValue.funding_type.toLowerCase() : ""}</Text> : null}
                </View>
                <View style={{ flex:1, alignItems: 'flex-end' }}>
                    <ArrowDown/>
                </View>
            </Pressable>
            {props.show && <View style={styles.menuItemContainerCustom}>
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({ item, index }) =>
                        <Pressable onPress={()=> onHide(item)} style={index == data.length - 1 ? styles.menuItemLast : styles.menuItem}>
                            {renderItem(item)}
                        </Pressable>
                    }
                />
            </View>}
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
    menuItemContainerCustom: {
        position: 'absolute',
        width: '100%',
        top: main_styles.isPlus || main_styles.isIphoneX ? 55 : 50,
        borderWidth: main_styles.borderWidth * 2,
        borderTopWidth: 0,
        backgroundColor: props.colors.primary[600],
        borderColor: props.colors.input.border,
        padding: 8,
        maxHeight: 120,
        elevation: 5,
        shadowColor: props.colors.primary[600],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        zIndex: Platform.OS == 'android' ?  1000000000000 : undefined
    },
    menuItemLast:{
        paddingTop: 12,
        paddingBottom: 12
    },
    menuItem:{
        paddingTop: 12,
        paddingBottom: 12,
        borderBottomWidth: main_styles.borderWidth * 2,
        borderColor: props.colors.input.border,
    },
    selectboxStyle: {
        width: '100%',
        height: main_styles.isPlus || main_styles.isIphoneX ? 55 : 50,
        borderWidth: main_styles.borderWidth * 2,
        borderColor: props.colors.input.border,
        borderRadius: 8,
        backgroundColor: props.colors.input.background,
        flexDirection: 'row',
        alignItems:'center',
        elevation: 5,
        shadowColor: props.colors.dark[600],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        paddingLeft: 12,
        paddingRight: 12,
    },
    selectboxStyleShowItem:{
        borderBottomWidth: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        elevation: 0,
        shadowColor: null,
        shadowOffset: null,
        shadowOpacity: null,
        shadowRadius: null,
    },
});

SelectComponent.propTypes = {
    onClickSelectComponent: PropTypes.func,
    onValueChange: PropTypes.func,
    data: PropTypes.array,
    placeHolder: PropTypes.string,
    renderItem: PropTypes.func,
    value: PropTypes.string,
    show: PropTypes.bool,
};

export default SelectComponent;