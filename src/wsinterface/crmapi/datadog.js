import { DdLogs,DatadogProviderConfiguration,SdkVerbosity,DdSdkReactNative } from '@datadog/mobile-react-native';
import { configDatadog } from '../../config/config_datadog';

export const datadog = {
    sendRumDatadog,
    sendAction,
    sendLogs,
    initDatadog,
    setUser
}

function initDatadog(){
    const config = new DatadogProviderConfiguration(
        configDatadog.client_token,
        configDatadog.enviroment,
        configDatadog.application_id,
        true, // track user interactions (such as a tap on buttons).
        true, // track XHR resources
        true // track errors
    );
    config.site = 'US5';
    // Optional: Enable or disable native crash reports
    config.nativeCrashReportEnabled = true;
    // Optional: Sample RUM sessions (in this example, 80% of session are sent to Datadog. Default is 100%)
    config.sessionSamplingRate = 80;
    // Optional: Sample tracing integrations for network calls between your app and your backend (in this example, 80% of calls to your instrumented backend are linked from the RUM view to the APM view. Default is 20%)
    // You need to specify the hosts of your backends to enable tracing with these backends
    config.resourceTracingSamplingRate = 80;
    // config.firstPartyHosts = ['example.com']; // matches 'example.com' and subdomains like 'api.example.com'
    // Optional: set the reported service name (by default, it uses the package name or bundleIdentifier of your Android or iOS app respectively)
    // config.serviceName = 'com.example.reactnative';
    // Optional: let the SDK print internal logs above or equal to the provided level. Default is undefined (meaning no logs)
    config.verbosity = SdkVerbosity.WARN;
    return config;
}

function sendRumDatadog(method, url, context_start, response_status, resource_type, context_stop){
	// DdRum.startResource(Date.now() + '', method, url, context_start, Date.now());
	// DdRum.stopResource(Date.now() + '', response_status, resource_type, context_stop, Date.now());
}

function sendAction(action_type, action_name){
    // DdRum.addAction(action_type, action_name, {}, Date.now());
    // DdRum.startAction(action_type, action_name, {}, Date.now());
    // DdRum.stopAction({}, Date.now());
}

function sendLogs(type, description, context){
    if(type == 'debug'){
        DdLogs.debug(description, context);
    } else if(type == 'info'){
        DdLogs.info(description, context);
    } else if(type == 'warn'){
        DdLogs.warn(description, context);
    } else if(type == 'error'){
        DdLogs.error(description, context);
    }
}

function setUser(contact){
    DdSdkReactNative.setUser({
        id: contact.id,
        name: contact.first_name + (contact.last_name ? contact.last_name : ""),
        email: contact.email
    });
}
