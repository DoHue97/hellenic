import React from 'react';
import { Container } from 'native-base';
import { ImageBackground, Platform } from 'react-native';
import { strings } from '../../translations';
import AlertComponent from '../../components/Alert';

const bg = require('../../../assets/images/bg.png');

export default function FirstPageView (props) {
    
    if(Platform.OS === 'ios') 
        return (
            <ImageBackground style={{ width: '100%', height: '100%' }} source={bg}>
                <AlertComponent
                    isVisible={props.isNeedUpdate}
                    title={strings.update_title}
                    message={strings.update_message}
                    onOkAction={props.goToStore}
                />
            </ImageBackground>
        );
    else
        return (
            <Container>
                <AlertComponent
                    isVisible={props.isNeedUpdate}
                    title={strings.update_title}
                    message={strings.update_message}
                    onOkAction={props.goToStore}
                />
            </Container>
        );
}
