import React from "react";
import { View } from "react-native";
import { HStack, Text, useTheme, InputGroup, Input } from 'native-base';
import { WarningIcon, SuccessIcon, ErrorIcon } from "./IconsComponent";

function TextInput(props) {
    const { 
        name, label, placeHolder, iconInput, isSuccess, errorLabel, keyboardType,
        autoCapitalize, nextRefInput, showIconError, secureTextEntry, returnKeyType 
    } = props;
    const { colors, fontSizes } = useTheme();

    return (
        <View>
            <HStack>
                <HStack>
                    <Text>{label}</Text>
                </HStack>
                {isSuccess == false && <HStack>
                    <Text color={colors.red[600]} size={'xs'}>{errorLabel}</Text>
                    {showIconError && <WarningIcon />}
                </HStack>}
            </HStack>
            <InputGroup right={<>
                {iconInput && isSuccess == true && <SuccessIcon />}
                {iconInput && isSuccess == false && <ErrorIcon />}
            </>}>
                    <Input 
                        placeholder={placeHolder}
                        keyboardType={keyboardType ? keyboardType : 'default'}
                        autoCapitalize={autoCapitalize ? autoCapitalize : 'none'}
                        onFocus={() => props.onFocus(name)}
                        onEndEditing={() => props.validate(name)}
                        onChangeText={(text) => props.onHandleChange(name, text)}
                        returnKeyType={returnKeyType ? returnKeyType : 'default'}
                        secureTextEntry={secureTextEntry}
                        onSubmitEditing={(e) => { nextRefInput ? nextRefInput.focus() : undefined}}
                    />
            </InputGroup>
        </View>
    )
}

TextInput.propTypes = {
    label: PropTypes.string,
};

export default TextInput;