/**
 * @format
 */

import { AppRegistry, Platform } from "react-native";
import App from './App';
import {name as appName} from './app.json';

if (Platform.OS === 'ios') {
  AppRegistry.registerComponent(appName, () => App);
} else {
  AppRegistry.registerComponent(appName.toLowerCase(), () => App);
}

// AppRegistry.registerComponent(appName.toLowerCase(), () => App);
