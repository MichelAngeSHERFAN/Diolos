import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { BackHandler, Platform, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeAreaView from "react-native-safe-area-view";
import { WebView } from "react-native-webview";
import OneSignal, { OpenedEvent } from "react-native-onesignal";

let currentUrl = "https://diolos.com/";

const App = () => {
  const webviewRef = useRef<WebView>(null);
  const [url, setUrl] = useState("https://diolos.com/");
  const [siteUri, setSiteUri] = useState("https://diolos.com/");

  useEffect(() => {
    //OneSignal Init Code
    OneSignal.setLogLevel(6, 0);
    OneSignal.setAppId("ef3cfea0-b08d-42d5-8437-ae2393a2e1ab");
    //END OneSignal Init Code

    console.log("OneSignal.getDeviceState => ", OneSignal.getDeviceState());
    if (Platform.OS === "ios") {
      //Prompt for push on iOS
      console.log("On iOS device");
      console.log("Prompt for push on iOS");
      OneSignal.promptForPushNotificationsWithUserResponse(response => {
        console.log("Prompt response:", response);
      });
    } else {
      console.log("On Android device");
    }

    //Method for handling notifications received while app in foreground
    OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
      console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
      let notification = notificationReceivedEvent.getNotification();
      console.log("notification: ", notification);
      const data = notification.additionalData;
      console.log("additionalData: ", data);
      // Complete with null means don't show a notification.
      notificationReceivedEvent.complete(notification);
    });

    OneSignal.setNotificationOpenedHandler(onClickNotification);

    const backAction = () => {
      if (currentUrl === "https://diolos.com/" || currentUrl === "https://diolos.com/index.php") {
        console.warn("IF", url);
        BackHandler.exitApp();
        return false;
      } else {
        // goBack()
        console.warn("ELSE", url);
        webviewRef?.current?.goBack();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();

  }, []);

  const onClickNotification = (openedEvent: OpenedEvent) => {
    if (openedEvent.notification.launchURL) {
      console.log("openedEvent.notification.launchURL ==> ", openedEvent.notification.launchURL);
      setSiteUri(`${openedEvent.notification.launchURL || "https://diolos.com"}?d=${new Date().getTime()}`)
      // setTimeout(() => setSiteUri(`${openedEvent.notification.launchURL || "https://diolos.com"}?d=${(new Date()).toISOString()}`), 500)
    } else {
      console.log("openedEvent.notification.launchURL ==> NULL");
    }
  };

  console.warn("URL => ", url);

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
            onLoad={e => {
              setUrl(e.nativeEvent.url);
              currentUrl = e.nativeEvent.url;
            }}
            ref={webviewRef}
            // injectedJavaScript={INJECTEDJAVASCRIPT}
            // scalesPageToFit={false}
            // javaScriptEnabled={true}
            scrollEnabled={true}
            source={{
              uri: siteUri,
              headers: {
                "Accept-Language": "fr",
              },
            }}
            allowsBackForwardNavigationGestures={true}
            startInLoadingState={true}
            pullToRefreshEnabled={true}
          />
        </View>
        {/*{(url !== "https://diolos.com/" && url !== "https://diolos.com/index.php") &&*/}
        {/*(*/}
        {/*Platform.OS === 'ios' ? (*/}
        {/*  <TouchableOpacity onPress={onBack} style={{position: "absolute", top: getStatusBarHeight() + 7, left: 25, width: 30, height: 30, backgroundColor: 'transparent'}}>*/}
        {/*    <Image source={require("./Assets/left-arrow.png")} style={{ width: 30, height: 30 }} />*/}
        {/*  </TouchableOpacity>*/}
        {/*) : (*/}
        {/*  <TouchableOpacity onPress={onBack} style={{position: "absolute", top: getStatusBarHeight(true) + 7, left: 25, width: 30, height: 30, backgroundColor: 'transparent'}}>*/}
        {/*    <Image source={require("./Assets/left-arrow.png")} style={{ width: 30, height: 30 }} />*/}
        {/*  </TouchableOpacity>*/}
        {/*))}*/}
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
