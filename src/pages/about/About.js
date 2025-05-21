import React from 'react';
import { View, TouchableOpacity, Linking } from 'react-native';
import { Container, Content, Text } from 'native-base';
import MainHeader from '../../components/MainHeader';
import { BackIcon } from '../../components/IconsComponent';
import { strings } from '../../translations'
import HTML from 'react-native-render-html'
import WebView from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

export default function About(props) {
    const navigation = useNavigation();
    
    const DEFAULT_PROPS = {
        WebView,
        htmlStyles: {},
        renderers: {},
        computeEmbeddedMaxWidth(contentWidth) {
            return contentWidth - 40;
        },
        onLinkPress(evt, href) {
            Linking.openURL(href);
        },
        debug: true,
    };

    return (
        <Container>
            <MainHeader
                customFlex
                leftContent={
                    <View style={{ flex: 1, justifyContent: "flex-start" }}>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: "center" }} onPress={() => navigation.goBack()}>
                            <BackIcon styles={{ marginRight: 10 }} />
                            <View style={{ flex: 1, alignItems: "center" }}>
                                <Text>{strings.about}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                }
            />
            <Content padder>
                <View style={{padding:10, alignItems: 'center', alignContent: 'center' }}>
                    <HTML html={strings.about_content} {...DEFAULT_PROPS}/>
                </View>
            </Content>
        </Container>
    );
}