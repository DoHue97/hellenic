import React from 'react';
import Communications from 'react-native-communications';
import { View, Pressable } from 'react-native';
import { Container, Content, Text, HStack} from 'native-base';
import MainHeader from '../../components/MainHeader';
import { BackIcon } from '../../components/IconsComponent';
import { strings } from '../../translations'
import { useNavigation } from '@react-navigation/native';

export default function Contact (props) {
    const navigation = useNavigation();
    return (
        <Container>
            <MainHeader
                customFlex
                leftContent={
                    <View style={{ flex: 1, justifyContent: "flex-start" }}>
                        <Pressable style={{ flexDirection: 'row', alignItems: "center" }} onPress={()=> navigation.goBack()}>
                            <BackIcon styles={{ marginRight: 10 }} />
                            <View style={{ flex: 1, alignItems: "center" }}>
                                <Text header onPrimary>{strings.btn_contact}</Text>
                            </View>
                        </Pressable>
                    </View>
                }
            />
            <Content padder>
                <View style={{ marginLeft: 20, marginBottom: 20 }}>
                    <Text style={{ marginBottom: 20 }}>{strings.contact_us_need_help}</Text>
                    <Text style={{ marginBottom: 20 }}>{strings.contact_us_need_touch}</Text>
                    <HStack>
                        <HStack>
                            <Pressable onPress={() => Communications.phonecall("80009999", true)}>
                                <Text bold link style={{ marginBottom: 20 }}>8000 9999 </Text>
                            </Pressable>
                        </HStack>
                        <HStack>
                            <Text style={{ fontWeight:'normal' }}>{strings.contact_us_tel_free_des}</Text>
                        </HStack>
                    </HStack>
                    <HStack>
                        <HStack>
                            <Pressable onPress={() => Communications.phonecall("+357 22 500 500", true)}>
                                <Text bold link>+357 22 500 500 </Text>
                            </Pressable>
                        </HStack>
                        <HStack>
                            <Text style={{ fontWeight:'normal' }}>{strings.contact_us_from}</Text>
                        </HStack>
                    </HStack>
                </View>
            </Content>
        </Container>
    );
}
