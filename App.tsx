import * as React from 'react';
import { StyleSheet, View, StatusBar, Platform, Button, Alert, TouchableOpacity, Text, Image, NativeModules } from "react-native";
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import {WebView} from 'react-native-webview';
import { useEffect, useRef, useState } from "react";
import { getStatusBarHeight } from 'react-native-status-bar-height';
import OneSignal from 'react-native-onesignal';

// const INJECTEDJAVASCRIPT = 'const meta = document.createElement(\'meta\'); meta.setAttribute(\'content\', \'width=800, initial-scale=0.5, maximum-scale=0.99, user-scalable=0\'); meta.setAttribute(\'name\', \'viewport\'); document.getElementsByTagName(\'head\')[0].appendChild(meta); '

const App = () => {
  const webviewRef = useRef<WebView>(null)
  const [url, setUrl] = useState("")

  useEffect(() => {
    //OneSignal Init Code
    OneSignal.setLogLevel(6, 0);
    OneSignal.setAppId("ef3cfea0-b08d-42d5-8437-ae2393a2e1ab");
    //END OneSignal Init Code

    console.log("TEEEEEEST", OneSignal.getDeviceState());

    if (Platform.OS === 'ios') {
      //Prompt for push on iOS
      console.log("Prompt for push on iOS");
      OneSignal.promptForPushNotificationsWithUserResponse(response => {
        console.log("Prompt response:", response);
      });
    }

    //Method for handling notifications received while app in foreground
    OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
      console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
      let notification = notificationReceivedEvent.getNotification();
      console.log("notification: ", notification);
      const data = notification.additionalData
      console.log("additionalData: ", data);
      // Complete with null means don't show a notification.
      notificationReceivedEvent.complete(notification);
    });

    //Method for handling notifications opened
    OneSignal.setNotificationOpenedHandler(notification => {
      console.log("OneSignal: notification opened:", notification);
    });
  }, []);

  const onBack = () => {
    webviewRef?.current?.goBack()
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        forceInset={{top: 'always', bottom: 'never'}}
        style={Platform.OS === 'ios' ? styles.StatusBarForIos : null}>
        {Platform.OS === 'android' ? (
          <StatusBar backgroundColor={'#007fcb'} />
        ) : (
          StatusBar.setBarStyle('light-content', true)
        )}
        <View style={styles.Container}>
          <WebView
            onLoad={e => setUrl(e.nativeEvent.url)}
            ref={webviewRef}
            // injectedJavaScript={INJECTEDJAVASCRIPT}
            // scalesPageToFit={false}
            // javaScriptEnabled={true}
            // scrollEnabled
            source={{uri: 'https://diolos.com/'}}
          />
        </View>
        {(url !== "https://diolos.com/" && url !== "https://diolos.com/index.php") &&
        (
        Platform.OS === 'ios' ? (
          <TouchableOpacity onPress={onBack} style={{position: "absolute", top: getStatusBarHeight() + 7, left: 25, width: 30, height: 30, backgroundColor: 'transparent'}}>
            <Image source={require("./Assets/left-arrow.png")} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onBack} style={{position: "absolute", top: getStatusBarHeight(true) + 7, left: 25, width: 30, height: 30, backgroundColor: 'transparent'}}>
            <Image source={require("./Assets/left-arrow.png")} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
        )
        )
        }
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  StatusBarForIos: {
    height: StatusBar.currentHeight,
    backgroundColor: '#007fcb',
  },
  Container: {
    // borderWidth: 1,
    // borderColor: '#007fcb',
    // borderColor: 'red',
    width: '100%',
    height: '100%',
  },
});

export default App;
