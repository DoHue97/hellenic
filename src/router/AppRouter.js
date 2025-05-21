import React, { useRef } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FirstPage from '../pages/first-page/FirstPage';
import LandingPage from '../pages/landing-page/LandingPage';
import Login from '../pages/loginv2/Login';
import LoginWithOtp from '../pages/loginv2/LoginWithOtp';
import VerifyEmail from '../pages/verify-email/VerifyEmail';
import Register from '../pages/register/Register';
import ForgotPassword from '../pages/forgot-password/ForgotPassword';
import Verification from '../pages/verify/Verify';
import Profile from '../pages/profile/Profile';
import ContactUs from '../pages/contact-us/Contact';
import About from '../pages/about/About';
import FAQRouter from '../router/FAQRouter';
import ProfileRouter from '../router/ProfileRouter';
import TermAndConditions from '../pages/term-and-conditions/TermAndConditions';
import NotificationDetail from '../pages/notifications/NotificationDetail';
import { config_path } from "../config/config_path";
import HomeDrawerRouter from "./HomeDrawerRouter";
import { DdRumReactNavigationTracking, ViewNamePredicate  } from '@datadog/mobile-react-navigation';
import { appInfo } from "../config/appinfo";
import Notifications from "../pages/notifications/Notifications";

const viewNamePredicate: ViewNamePredicate = function customViewNamePredicate(route: Route<string, any |    undefined>, trackedName: string) {
    return "Tracked name:" + trackedName;
}

const Stack = createStackNavigator();

export function AppRootRouter(props) {    
  const navigationRef = React.createRef(null);
  const routeNameRef = useRef();

    return (
        <NavigationContainer ref={navigationRef} onReady={() => {
            console.log("onReady navigation===");
            if(appInfo && appInfo.intergratedDatadog){
                DdRumReactNavigationTracking.stopTrackingViews();
                DdRumReactNavigationTracking.startTrackingViews(navigationRef.current, viewNamePredicate)
            }
           }}
           onStateChange={async () => {
                const previousRouteName = routeNameRef.current;
                const currentRouteName = navigationRef.current.getCurrentRoute().name;
        
                if (previousRouteName !== currentRouteName) {
                    await props.initDatadog(props.existEmail);
                }
                routeNameRef.current = currentRouteName;
                DdRumReactNavigationTracking.stopTrackingViews();          
            }
            }
        >
            <Stack.Navigator initialRouteName={config_path.first_page} screenOptions={{ headerShown: false,gestureEnabled: false }}>
                <Stack.Screen name={config_path.first_page} component={FirstPage} />
                <Stack.Screen name={config_path.landing_page} component={LandingPage} />

                <Stack.Screen name={config_path.login} component={Login}/>
                <Stack.Screen name={config_path.login_otp} component={LoginWithOtp}/>
                <Stack.Screen name={config_path.verify_email} component={VerifyEmail}/>

                <Stack.Screen name={config_path.register} component={Register}/>
                <Stack.Screen name={config_path.forgot_password} component={ForgotPassword} />
                <Stack.Screen name={config_path.verification} component={Verification} />

                <Stack.Screen name={config_path.home_drawer_router} component={HomeDrawerRouter} />

                <Stack.Screen name={config_path.profile} component={Profile} />

                <Stack.Screen name={config_path.contact_us} component={ContactUs} />
                <Stack.Screen name={config_path.about} component={About} />
                <Stack.Screen name={config_path.term_condition} component={TermAndConditions} />
                <Stack.Screen name={config_path.faq_router} component={FAQRouter} />

                <Stack.Screen name={config_path.profile_router} component={ProfileRouter} />
                <Stack.Screen name={config_path.notification_detail} component={NotificationDetail} />
                <Stack.Screen name={config_path.notifications} component={Notifications} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
