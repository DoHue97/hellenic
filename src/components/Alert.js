import React, { useState } from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'native-base'
import Modal from "react-native-modal";

function AlertComponent(props) {
    const [style, setStyle] = useState({})
    const { isVisible, title, message, onOkAction, actionName } = props;
    const { colors } = useTheme();
    const resizeModal = (ev) => {
        setStyle({ height: ev.nativeEvent.layout.height + 10 });
    }
    const styles = useGlobalStyles();
    console.log("AAAA AlertComponent props: ", props)
    return (
        <Modal isOpen={isVisible}>
            <View onLayout={(ev) => { resizeModal(ev) }} style={[styles.modal, styles.alert]}>
                <Text center bold>{title}</Text>
                <Text center>{message}</Text>
                <View style={{ width: '100%', marginTop: 20 }}>
                    <Button onPress={() => onOkAction()}>
                        <Text>{actionName ? actionName : "OK"}</Text>
                    </Button>
                </View>
            </View>
        </Modal>
    )
}

function useGlobalStyles() {
    const { colors } = useTheme();
    // We only want to recompute the stylesheet on changes in color.
    const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
    return styles;
}

const getGlobalStyles = (props) => StyleSheet.create({
    modal: {
        width: '90%',
        marginLeft: '5%',
        marginRight: '5%',
        backgroundColor: props.colors.primary[600],
        borderRadius: 10,
    },
    alert:{
        paddingTop: 30,
        paddingBottom: 30,
        paddingLeft: 15,
        paddingRight: 15,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

AlertComponent.propTypes = {
    isOpen: PropTypes.bool,
    message: PropTypes.string,
    actionName: PropTypes.string,
    otherMessage: PropTypes.object,
    onClose: PropTypes.func
};

export default AlertComponent;