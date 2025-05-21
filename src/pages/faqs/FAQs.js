import React, { useEffect, useState } from 'react';
import { View, Pressable, FlatList } from 'react-native';
import { Container, Content, ListItem, Text } from 'native-base';
import MainHeader from '../../components/MainHeader';
import { BackIcon } from '../../components/IconsComponent';
import { strings } from '../../translations'
import { useNavigation } from '@react-navigation/native';
import { config_path } from '../../config/config_path';

export default function FAQs (props) {
    const [faqs, setFaqs] = useState([]);
    
    useEffect(() => {
        var _faqs = [];
        for (var i = 1; i <= 17; i++) {
            var question = "faq_q" + i;
            var answer = "faq_q" + i + "_a";
            _faqs.push({
                question: question,
                answer: answer
            });
        }
        setFaqs(_faqs)
    }, []);

    const navigation = useNavigation();
    const onDetailFAQ = (item) => {
        navigation.navigate(config_path.faq_detail, { content: item.answer, title: item.question })
    }
    return (
        <Container>
            <MainHeader
                customFlex
                leftContent={
                    <View style={{ flex: 1, justifyContent: "flex-start" }}>
                        <Pressable style={{ flexDirection: 'row', alignItems: "center" }} onPress={() => navigation.goBack()}>
                            <BackIcon styles={{ marginRight: 10 }} />
                            <View style={{ flex: 1, alignItems: "center" }}>
                                <Text>{strings.faq_title}</Text>
                            </View>
                        </Pressable>
                    </View>
                }
            />
            <Content padder>
                <FlatList
                    data={faqs}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({ item, index }) =>
                        <ListItem key={index} onPress={() => onDetailFAQ(item)} >
                            <Text default>{strings.faqs_content[item.question]}</Text>
                        </ListItem>
                    }
                />
            </Content>
        </Container>
    );
}
