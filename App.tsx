import * as React from 'react';
import {StyleSheet, View, StatusBar, Platform, Text} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import {WebView} from 'react-native-webview';

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
        <Text>test</Text>
        <View style={styles.Container}>
          <WebView source={{uri: 'https://google.com/'}} />
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
    borderWidth: 1,
    // borderColor: '#007fcb',
    borderColor: 'red',
    width: '100%',
    height: '100%',
  },
});

export default App;
