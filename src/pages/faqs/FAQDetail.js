import React from 'react';
import { View, Pressable, Linking } from 'react-native';
import { Container, Content, Text, useTheme } from 'native-base';
import MainHeader from '../../components/MainHeader';
import { BackIcon } from '../../components/IconsComponent';
import { strings } from '../../translations'
import HTML from 'react-native-render-html'
import WebView from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';

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

export default function FAQDetail (props) {
    const route = useRoute();
    var title = route.params && route.params.title;
    var content = route.params && route.params.content;
    const navigation = useNavigation();
    const { fontSizes } = useTheme();
    return (
        <Container>
            <MainHeader
                customFlex
                leftContent={
                    <View style={{ flex: 1, justifyContent: "flex-start" }}>
                        <Pressable style={{ flexDirection: 'row', alignItems: "center" }} onPress={() => navigation.goBack()}>
                            <BackIcon styles={{ marginRight: 10 }} />
                            <View style={{ flex: 1, alignItems: "center" }}>
                                <Text>{strings.faq}</Text>
                            </View>
                        </Pressable>
                    </View>
                }
            />
            <Content padder>
                <Text fontSize={fontSizes.xl} style={{ paddingBottom: 10 }}>{strings.faqs_content[title]}</Text>
                <HTML 
                    {...DEFAULT_PROPS}
                    html={strings.faqs_content[content]}
                />
            </Content>
        </Container>
    );
}
