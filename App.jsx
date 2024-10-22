/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import AppNavigator from './navigation/AppNavigator';
import {DropdownProvider } from './components/DropdownContext';
import { View, Text} from 'react-native';
import { NativeModules, NativeEventEmitter, PermissionsAndroid } from 'react-native';

const { SmsListenerModule } = NativeModules;
const eventEmitter = new NativeEventEmitter(SmsListenerModule);

function App(){

  useEffect(() => {
    console.log("useEffect");
    const requestSmsPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
          {
            title: "SMS Permission",
            message: "This app needs access to your SMS to function properly.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("SMS permission granted");
          SmsListenerModule.startListeningToSMS();
        } else {
          console.log("SMS permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestSmsPermission();

    const eventListener = eventEmitter.addListener('onSMSReceived', (event) => {
      console.log('New SMS:', event);
      console.log('messageBody:', event?.messageBody);
    });

    return () => {
      eventListener.remove();
      SmsListenerModule.stopListeningToSMS();
    };
  }, []);

  return (
    <DropdownProvider>
      <AppNavigator />
    </DropdownProvider>
  )
}
export default App;