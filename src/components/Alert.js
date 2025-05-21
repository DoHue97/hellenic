import React, { useState } from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { Box, Button, Center, Modal, Text, useTheme } from 'native-base'

function AlertComponent(props) {
    const [style, setStyle] = useState({})
    const { isOpen, message, otherMessage, onClose, actionName, buttonWidth, hideButton } = props;
    const { colors } = useTheme();
    const resizeModal = (ev) => {
        setStyle({ height: ev.nativeEvent.layout.height + 10 });
    }
    const currentStyles = useGlobalStyles();
    console.log("AAAA AlertComponent props: ", props)
    return (
        <Modal isOpen={isOpen} onClose={!hideButton ? onClose : undefined}>
            <View onLayout={(ev) => { resizeModal(ev) }} style={currentStyles.modal_alert}>
                <Center>
                    <Text color={colors.textCustom.onLight} textAlign={'center'} fontSize={"md"} accessibilityLabel='message'>{message}</Text>
                    {otherMessage}
                    {!hideButton && <Box marginTop={8} width={buttonWidth ? buttonWidth : '30%'}>
                        <Button colorScheme={"primary"} onPress={() => onClose()} accessibilityLabel='btnOk'>
                            {actionName ? actionName : "OK"}
                        </Button>
                    </Box>}
                </Center>
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
    modal_alert: {
        width: '90%',
        marginLeft: '5%',
        marginRight: '5%',
        backgroundColor: props.colors.white,
        paddingVertical: 16,
        paddingHorizontal: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: props.colors.border.main,
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