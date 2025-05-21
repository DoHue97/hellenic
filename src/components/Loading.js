import React from "react";
import Modal from "react-native-modal";
import { Spinner, useTheme } from 'native-base';
import { View } from 'react-native';

export default function Loading(props) {
    const { showLoading } = props;
    const { colors } = useTheme();

    return(
        <Modal isVisible={showLoading}>
            <View style={{ alignSelf: 'center', height: 70, width: 80 }}>
                <Spinner color={colors.white} />
            </View>
        </Modal>
    )
}