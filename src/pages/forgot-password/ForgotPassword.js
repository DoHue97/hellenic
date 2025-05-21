
import React, { Component, useState } from 'react';
import ForgotPasswordView from './ForgotPasswordView';
import {connect} from 'react-redux';
import { useNavigation } from '@react-navigation/native';

export default function ForgotPassword (props) {
    const navigation = useNavigation();
    const [focused, setFocused] = useState(false);
    const [email, setEmail] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    const [validator, setValidator] = useState({
        isSuccessEmail: undefined,
    });
    const [error, setError] = useState({
        showAlert: false,
        title: '',
        message: '',
        status: '',
    });
    const [registerInfo, setRegisterInfo] = useState(null);

    const handleFocus = (name) => {
        setFocused(name);
    }

    const onHandleChange = (target, value) => {
        var register_info = registerInfo;
        register_info[target] = value;
        setRegisterInfo(register_info)
    }

    const validate = (target) => {
        var { email } = registerInfo;
        var _validator = validator;
        if (target === 'email') {
            if (!isValidEmail(email)) {
                setValidator({ ..._validator, isSuccessEmail: false })
                return false;
            }
            else {
                setValidator({ ..._validator, isSuccessEmail: true })
                return true;
            }
        }
    }

    const setVisibleAlert = (isVisible, status, title, message) => {
        setShowLoading(false)
        setError({
            showAlert: isVisible,
            title: title ? title : '',
            message: message ? message : '',
            status: status ? status : ''
        })
    }

    const goBack = () => {
        navigation.goBack();;
    }

    const onForgotPassword = () => {
        
    }

    return (
        <ForgotPasswordView
            validator={validator}
            showLoading={showLoading}
            error={error}
            goBack={goBack}
            onForgotPassword={onForgotPassword}
            onHandleChange={onHandleChange}
            handleFocus={handleFocus}
            validate={validate}
            setVisibleAlert={setVisibleAlert}
        />
    );
}
