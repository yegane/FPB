/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import AppContainers from './navigation/navigator';

export default class App extends React.Component {
  render() {
    const ReactNative = require('react-native');
    try {
      ReactNative.I18nManager.allowRTL(false);
    } catch (e) {}
    return (
      <View style={{flex: 1}}>
        <AppContainers />
      </View>
    );
  }
}
