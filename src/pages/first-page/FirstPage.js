import React, { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { connect } from 'react-redux';
import BootSplash from "react-native-bootsplash";
import VersionCheck from 'react-native-version-check';
import { getData, forceLogOut } from '../../utils/common';
import { navigateAndReset } from '../../utils/util';
import { commonAction } from '../../process/common';
import FirstPageView from './FirstPageView';
import { config_path } from '../../config/config_path';
import { useNavigation } from '@react-navigation/native';

export default function FirstPage (props) {
    const navigation = useNavigation();
    const [isNeedUpdate, setIsNeedUpdate] = useState(false);
    const [urlStore, setUrlStore] = useState('');

    useEffect(() => {},[]);

    const onLoadData = async () => {
        await checkVersion();
    }

    const checkVersion = async () => {
        VersionCheck.needUpdate()
        .then(async res => {
            if (res && res.isNeeded) {
                BootSplash.hide();
                setIsNeedUpdate(res.isNeeded);
                setUrlStore(res.storeUrl);
            } else {
                checkLogin();
            }
        }).catch(error => {
            checkLogin();
        });
    }

    const checkLogin = async () => {
        var REFRESH_TOKEN_STATUS = AppData.getRefreshTokenStatus();
		if (REFRESH_TOKEN_STATUS == 'COMPLETED') {
            var result = await commonAction.checkLogin();
            if (result) {
                var isEmailValidation = await getData("IS_VERIFY_EMAIL");
                if (isEmailValidation == true) {
                    BootSplash.hide();
                    navigateAndReset(navigation, config_path.home_drawer_router);
                } else if (isEmailValidation == false) {
                    var isRemember = await getData("IS_REMEMBER_ME");
                    if (isRemember) {
                        BootSplash.hide();
                        var emailValidation = await getData("EMAIL_VALIDATION", true);
                        navigateAndReset(navigation, config_path.login, { activeStep: emailValidation ? "verify_email_continue" : "verify_email" });
                    } else {
                        navigateAndReset(navigation, config_path.landing_page);
                    }
                } else {
                    BootSplash.hide();
                    navigateAndReset(navigation, config_path.home_drawer_router);
                }
            }
            else {
                BootSplash.hide();
                navigateAndReset(navigation, config_path.landing_page);
            }
        } else if(REFRESH_TOKEN_STATUS=='UNAUTHORIZED'){
            BootSplash.hide();
            forceLogOut();
        } else{
            commonAction.clearData();
            BootSplash.hide();
            navigateAndReset(navigation, config_path.landing_page);
        }
    }

    const goToStore = () => {
        if (urlStore) {
            Linking.openURL(urlStore).catch(err => console.error('An error occurred', err));
        }
    }

    return (
        <FirstPageView
            isNeedUpdate={isNeedUpdate}
            goToStore={goToStore}
        />
    );
}
