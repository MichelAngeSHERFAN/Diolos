import * as React from 'react';
import {StyleSheet, View, StatusBar, Platform, Text} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import {WebView} from 'react-native-webview';

const INJECTEDJAVASCRIPT = 'const meta = document.createElement(\'meta\'); meta.setAttribute(\'content\', \'width=800, initial-scale=0.5, maximum-scale=0.99, user-scalable=0\'); meta.setAttribute(\'name\', \'viewport\'); document.getElementsByTagName(\'head\')[0].appendChild(meta); '


const App = () => {
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
        {/*<Text>test</Text>*/}
        <View style={styles.Container}>
          <WebView
            injectedJavaScript={INJECTEDJAVASCRIPT}
            // scalesPageToFit={false}
            javaScriptEnabled={true}
            // scrollEnabled
            source={{uri: 'https://diolos.com/'}}
          />
        </View>
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
