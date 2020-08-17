/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component, useEffect, useState} from 'react';
import {
  AppState,
  ToastAndroid,
  Platform,
  DeviceEventEmitter,
} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack';
//import {createDrawerNavigator} from '@react-navigation/drawer';
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
import DeviceManagement from './components/deviceManagement.js';
import HistorySchedule from './components/historySchedule.js';
import Statistics from './components/statistical.js';
import moment from 'moment';

//const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

Ionicons.loadFont();

console.disableYellowBox = true;

import ReactNativeAN from 'react-native-alarm-notification';

const alarmNotifData = {
  title: 'Tưới xong',
  message: '',
  vibrate: true,
  play_sound: true,
  schedule_type: 'once',
  channel: 'wakeup',
  data: {content: 'my notification id is 22'},
  loop_sound: true,
  has_button: true,
};

const repeatAlarmNotifData = {
  title: 'Thông báo',
  message: 'Stand up',
  vibrate: true,
  play_sound: true,
  schedule_type: 'repeat',
  channel: 'wakeup',
  data: {content: 'my notification id is 22'},
  loop_sound: true,
  repeat_interval: 1, // repeat after 1 minute
};

class SmartFarm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fireDate: '',
      update: [],
      futureFireDate: '1000',
      alarmId: null,

      timesAlarm: [],
    };
  }

  setAlarm = async (input, message) => {
    const {fireDate, update, timesAlarm} = this.state;

    // var checkTimes = moment().format('DD-MM-yyyy').toString() + ' ' + moment(new Date()).format('HH:mm') + ':00';

    // for(var i = 0; i < timesAlarm.length; i++) {
    //   if(checkTimes == timesAlarm[i]){

    //   }
    // }

    const details = {
      ...alarmNotifData,
      fire_date: input,
      message: message + input,
    };
    console.log(`alarm set: ${input}`);

    try {
      const alarm = await ReactNativeAN.scheduleAlarm(details);
      console.log(alarm);
      if (alarm) {
        this.setState({
          update: [...update, {date: `alarm set: ${input}`, id: alarm.id}],
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  setRpeatAlarm = async () => {
    const {fireDate, update} = this.state;

    const details = {...repeatAlarmNotifData, fire_date: fireDate};
    console.log(`alarm set: ${fireDate}`);

    try {
      const alarm = await ReactNativeAN.scheduleAlarm(details);
      console.log(alarm);
      if (alarm) {
        this.setState({
          update: [...update, {date: `alarm set: ${fireDate}`, id: alarm.id}],
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  setFutureAlarm = async () => {
    const {futureFireDate, update} = this.state;

    const fire_date = ReactNativeAN.parseDate(
      new Date(Date.now() + parseInt(futureFireDate, 10)),
    );
    const details = {...alarmNotifData, fire_date};
    console.log(`alarm set: ${fire_date}`);

    try {
      const alarm = await ReactNativeAN.scheduleAlarm(details);
      console.log(alarm);
      if (alarm) {
        this.setState({
          update: [...update, {date: `alarm set: ${fire_date}`, id: alarm.id}],
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  stopAlarmSound = () => {
    ReactNativeAN.stopAlarmSound();
  };

  sendNotification = () => {
    const details = {
      ...alarmNotifData,
      data: {content: 'my notification id is 45'},
    };
    console.log(details);
    ReactNativeAN.sendNotification(details);
  };
  showPermissions = () => {
    ReactNativeAN.checkPermissions(permissions => {
      console.log(permissions);
    });
  };
  componentWillUnmount() {
    if (this.unReceive) {
      this.unReceive();
    }

    DeviceEventEmitter.removeListener('OnNotificationDismissed');
    DeviceEventEmitter.removeListener('OnNotificationOpened');
  }
  componentDidMount() {
    try {
      DeviceEventEmitter.addListener('OnNotificationDismissed', async function(
        e,
      ) {
        const obj = JSON.parse(e);
        console.log(`Notification id: ${obj.id} dismissed`);
      });

      DeviceEventEmitter.addListener('OnNotificationOpened', async function(e) {
        const obj = JSON.parse(e);
        console.log(obj);
      });

      if (Platform.OS === 'ios') {
        this.showPermissions();

        ReactNativeAN.requestPermissions({
          alert: true,
          badge: true,
          sound: true,
        }).then(
          data => {
            console.log('RnAlarmNotification.requestPermissions', data);
          },
          data => {
            console.log('RnAlarmNotification.requestPermissions failed', data);
          },
        );
      }

      this.unReceive = Ws.receive(e => {
        // console.log(e);

        const data = JSON.parse(e.data);

        if (data.action == 'DeviceSendDataCompleted') {
          if (data.message == 'addLogBalconyDevice Success') {
            // if (this.state.nameDevice == data.data.nameDevice) {
            let input =
              moment()
                .format('DD-MM-yyyy')
                .toString() +
              ' ' +
              data.data.time +
              ':00';
            this.setAlarm(input, 'Đã tưới xong ');
          }
          // }
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  render() {
    createHomeStack = ({route}) => {
      const {name} = route.params;
      const {username} = route.params;
      const {pass} = route.params;
      const {nameDevice} = route.params;
      //console.log(JSON.stringify(dataUser));
      return (
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              let iconName;
              if (route.name === 'Home') {
                iconName = focused ? 'md-home' : 'md-home';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'ios-person-circle' : 'ios-person-circle';
              }

              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: '#099773',
            inactiveTintColor: 'gray',
          }}>
          <Tab.Screen
            name="Home"
            component={Home}
            options={{
              headerLeft: null,
              title: 'Trang chủ',
            }}
            initialParams={{
              name: name,
              username: username,
              pass: pass,
              nameDevice: nameDevice,
            }}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              title: 'Thông tin cá nhân',
            }}
            initialParams={{
              name: name,
              username: username,
              pass: pass,
              nameDevice: nameDevice,
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
            // eslint-disable-next-line no-undef
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
            name="DeviceManagement"
            component={DeviceManagement}
            options={{
              title: 'Quản lý thiết bị',
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
