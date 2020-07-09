/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {Component, useEffect, useState} from 'react';
import { AppState} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Ws from './components/websocket.js';
import WsDevice from './components/websocketDevice.js';
import Login from './components/login.js';
import SetUpDevice from './components/setUpDevice.js';
import Schedule from './components/schedule.js';
import Home from './components/home.js';
import Profile from './components/profile.js';
import AccountManagement from './components/AccountManagement.js';
import HistorySchedule from './components/historySchedule.js';
import Statistics from './components/statistical.js';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

console.disableYellowBox = true;

 class SmartFarm extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    createHomeStack = ({route}) => {
      const {name} = route.params;
      const {username} = route.params;
      const {pass} = route.params;
      //console.log(JSON.stringify(dataUser));
      return (
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              let iconName;
              if (route.name === 'Home') {
                iconName = focused ? 'ios-home' : 'ios-home';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'ios-contact' : 'ios-contact';
              }

              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: 'green',
            inactiveTintColor: 'gray',
          }}>
          <Tab.Screen
            name="Home"
            component={Home}
            options={{
              headerLeft: null,
            }}
            initialParams={{
              name: name,
              username: username,
              pass: pass,
            }}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              title: 'Thông tin cá nhân',
            }}
          />
        </Tab.Navigator>
      );
    };
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false,
              headerLeft: null,
            }}
          />
          <Stack.Screen
            name="SetUpDevice"
            component={SetUpDevice}
            options={{
              title: 'Cài đặt thiết bị',
            }}
          />
          <Stack.Screen
            name="Home"
            component={createHomeStack}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Schedule"
            component={Schedule}
            options={{
              title: 'Lịch tưới',
            }}
          />
          <Stack.Screen
            name="AccountManagement"
            component={AccountManagement}
            options={{
              title: 'Quản lý tài khoản',
            }}
          />
          <Stack.Screen
            name="HistorySchedule"
            component={HistorySchedule}
            options={{
              title: 'Lịch sử tưới',
            }}
          />
          <Stack.Screen
            name="Statistics"
            component={Statistics}
            options={{
              title: 'Thống kê',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default function App() {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = nextAppState => {
    Ws.close();
    Ws.connect();
    WsDevice.close();
    WsDevice.connect();
    setAppState(nextAppState);
  };

  return <SmartFarm />;
}
