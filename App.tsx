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
  const [myDeviceUserID, setMyDeviceUserID] = useState("");

  const [key, setKey] = useState(0);
  const [isReady, setIsReady] = useState(false);

  let tmpDeviceUserId: string | null | undefined = null;

  useEffect(() => {
    //OneSignal Init Code
    OneSignal.setLogLevel(6, 0);
    OneSignal.setAppId("ef3cfea0-b08d-42d5-8437-ae2393a2e1ab");
    //END OneSignal Init Code

    // OneSignal.addPermissionObserver(event => {
    //   console.log("OneSignal: permission changed:", event);
    // });
    //
    // OneSignal.addSubscriptionObserver(event => {
    //   console.log("OneSignal: subscription changed event:", event);
    //   console.log("OneSignal: subscription changed from userId:", event.from.userId);
    //   console.log("OneSignal: subscription changed to userId:", event.to.userId);
    //   console.log("OneSignal: subscription changed from pushToken:", event.from.pushToken);
    //   console.log("OneSignal: subscription changed to pushToken:", event.to.pushToken);
    //   console.log("OneSignal: subscription changed from isPushDisabled:", event.from.isPushDisabled);
    //   console.log("OneSignal: subscription changed to isPushDisabled:", event.to.isPushDisabled);
    //   console.log("OneSignal: subscription changed from isSubscribed:", event.from.isSubscribed);
    //   console.log("OneSignal: subscription changed to isSubscribed:", event.to.isSubscribed);
    // });

    const getDeviceUserID = async () => {
      // console.log("OneSignal.getDeviceState111 => ", (await OneSignal.getDeviceState())?.userId);
      tmpDeviceUserId = (await OneSignal.getDeviceState())?.userId;
      // console.warn("tmpDeviceUserId after => ", tmpDeviceUserId);
      tmpDeviceUserId && setMyDeviceUserID(tmpDeviceUserId);
    };
    getDeviceUserID().then();

    // console.log("OneSignal.getDeviceState => ", OneSignal.getDeviceState());

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
        // console.warn("IF", url);
        BackHandler.exitApp();
        return false;
      } else {
        // goBack()
        // console.warn("ELSE", url);
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

  const onClickNotification = async (openedEvent: OpenedEvent) => {
    if (openedEvent.notification.launchURL) {
      console.log("openedEvent.notification.launchURL ==> ", openedEvent.notification.launchURL);
      await setSiteUri(`${openedEvent.notification.launchURL || "https://diolos.com"}?tmp_to_remove=${new Date().getTime()}`);
      await setSiteUri(`${openedEvent.notification.launchURL || "https://diolos.com"}`);
    } else {
      console.log("openedEvent.notification.launchURL ==> NULL");
    }
  };

  console.log("URL => ", url);
  // console.warn("URL => ", url);
  console.log("myDeviceUserID1 => ", myDeviceUserID);

  let ready: () => Promise<any>;
  ready = async () => {
    const deviceState = await OneSignal.getDeviceState();
    if (deviceState?.isSubscribed && !myDeviceUserID) return ready();
    setIsReady(true);
  };

  if (!isReady) {
    ready().then();
    return <View />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        forceInset={{ top: "always", bottom: "never" }}
        style={Platform.OS === "ios" ? styles.StatusBarForIos : null}>
        {Platform.OS === "android" ? (
          <StatusBar backgroundColor={"#007fcb"} />
        ) : (
          StatusBar.setBarStyle("light-content", true)
        )}
        <View style={styles.Container}>
          <WebView
            allowsLinkPreview={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            onLoad={(e) => {
              setUrl(e.nativeEvent.url);
              currentUrl = e.nativeEvent.url;
              setKey(key + 1);
              // console.warn(key);
            }}
            ref={webviewRef}
            scrollEnabled={true}
            source={{
              uri: siteUri,
              headers: {
                "Accept-Language": "fr",
                "OneSignalUserId": myDeviceUserID,
                "InternalTest": siteUri,
              },
            }}
            allowsBackForwardNavigationGestures={true}
            startInLoadingState={true}
            pullToRefreshEnabled={true}
          />
          {/*<Button title="Reload Me!" onPress={() => { WebViewRef && WebViewRef.reload(); }} />*/}
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
    backgroundColor: "#007fcb",
  },
  Container: {
    // borderWidth: 1,
    // borderColor: '#007fcb',
    // borderColor: 'red',
    width: "100%",
    height: "100%",
  },
});

export default App;
