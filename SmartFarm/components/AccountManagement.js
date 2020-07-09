import React, {Component} from 'react';
import {
  Text,
  View,
} from 'react-native';
import websocket from './websocket.js';

export default class AccountManagement extends Component {

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Quản lý tài khoản</Text>
      </View>
    );
  }
}
