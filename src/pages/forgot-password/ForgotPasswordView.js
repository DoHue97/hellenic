import React from 'react';
import { Text, Button, Input, Item, useTheme, InputGroup } from 'native-base';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import { SuccessIcon, ErrorIcon } from '../../components/IconsComponent';
import { strings } from '../../translations';
import main_styles from '../../../assets/theme/release/main_styles';

export default function ForgotPasswordView(props) {
    const { isSuccessEmail } = props;
    var disabled = !isSuccessEmail;
    const { colors } = useTheme();
    const main_styles = useGlobalStyles();
    return (
        <Modal
            style={main_styles.modal}
            isVisible={props.isShowModal}
            deviceWidth={main_styles.deviceWidth}
            deviceHeight={main_styles.deviceHeight}
            onBackdropPress={() => props.onClose()}
            backdropColor={main_styles.modalBackdropColor}
            backdropOpacity={1}
        >
            <View style={[main_styles.modalContent]}>
                <Text fontSize={'xl'} center>{strings.reset_your_passowrd}</Text>
                <Text color={colors.textCustom.info} center mt={12}>{strings.forgot_pass_title}</Text>
                <View style={main_styles.inputContainer}>
                    <InputGroup error={isSuccessEmail === false}>
                        <Input
                            placeholder={strings.enter_your_email}
                            placeholderTextColor={main_styles.placeholderTextColor}
                            ref={"EmailInput"}
                            keyboardType={'email-address'}
                            autoCapitalize={'none'}
                            onFocus={() => props.handleFocus("email")}
                            onEndEditing={() => props.validate("email")}
                            onChangeText={(text) => props.onHandleChange("email", text)}
                            returnKeyType={'done'}
                        />
                        {isSuccessEmail === true && <View style={{ paddingRight: 16 }}><SuccessIcon /></View>}
                        {isSuccessEmail === false && <View style={{ paddingRight: 16 }}><ErrorIcon /></View>}
                    </InputGroup>
                </View>
                <Button disabled={disabled} onPress={props.onForgot}>
                    <Text>{strings.btn_send}</Text>
                </Button>
            </View>
        </Modal>
    );
}

function useGlobalStyles() {
    const { colors } = useTheme();
    // We only want to recompute the stylesheet on changes in color.
    const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
    return styles;
}

const getGlobalStyles = (props) => StyleSheet.create({
    inputContainer: {
        width: '100%',
        height: 80,
        marginTop: main_styles.isIphoneX || main_styles.isPlus ? 14 : 4,
    },
    modalContent: {
        bottom: 0,
        top: '10%',
        left: 0,
        height: '80%',
        backgroundColor: props.colors.primary[600],
        borderWidth: 0.5,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingTop: 20,
        paddingBottom: 0,
        paddingLeft: 20,
        paddingRight: 20
    },
    modal: {
        padding: 0,
        margin: 0,
        left: 0,
        width: main_styles.deviceWidth,
    },
    modalBackdropColor: props.colors.background.modal,
    placeholderTextColor: props.colors.input.placeholder,
});