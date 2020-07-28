import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import NetInfo from '@react-native-community/netinfo';

import websocket from './websocket.js';
import wsDevice from './websocketDevice.js';
import {Card} from 'react-native-shadow-cards';
//import logo from '../images/logoSF.png';
//import logo from '../images/logo.png';
import logo from '../images/logo.jpg';
import bg from '../images/bg.jpg';

export default class SetupDevice extends Component {
  constructor() {
    super();

    this.state = {
      ssidWifi: '',
      passWifi: '',
      username: '',
      pass: '',

      spinner: false,
    };
  }

  submit = () => {
    // this.setState({spinner: !this.state.spinner});

    var SendDataDevice = {
      action: 'AppSendDataDevice',
      data: {
        username: this.state.username,
        pass: this.state.pass,
        ssidWifi: this.state.ssidWifi,
        passWifi: this.state.passWifi,
        status: 0,
      },
    };

    console.log(JSON.stringify(SendDataDevice));

    wsDevice.send(JSON.stringify(SendDataDevice));
    //websocket.send(JSON.stringify(SendDataDevice));
  };

  componentWillUnmount() {
    if (this.unReceive) {
      this.unReceive();
    }
  }

  componentDidMount() {
    try {
      NetInfo.fetch().then(state => {
        console.log('Connection type', state.type);
        console.log('Is connected?', state.isConnected);

        if (!state.isConnected) {
          alert('Vui lòng kết nối với wifi thiết bị');
        } else {
          this.unReceive = wsDevice.receive(e => {
            console.log(e);

            const data = JSON.parse(e.data);
            console.log(data);

            if (data.action == 'DeviceToApp') {
              console.log('OK!');

              if (data.message == 'Success') {
                console.log('Thiết bị nhận data thành công');
                wsDevice.close();
                // this.setState({spinner: !this.state.spinner});
                this.props.navigation.navigate('Login');
              } else {
                console.log('Thiết bị nhận data thất bại');
                // this.setState({spinner: !this.state.spinner});
              }
            }
          });
        }
      });
    } catch (error) {
      alert(error.message);
    }
  }
  render() {
    const {ssidWifi, passWifi, username, pass} = this.state;
    return (
      <ImageBackground source={bg} style={styles.backgroundContainer}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Montserrat',
          }}>
          <Spinner visible={this.state.spinner} textContent={'Loading...'} />

          <Card style={{paddingTop: 20, paddingBottom: 20, margin: 10}}>
            <View style={{alignItems: 'center', marginBottom: 30}}>
              <Image source={logo} style={styles.logo} />
            </View>
            <View style={styles.inputViewGroup}>
              <View style={styles.inputView}>
                {/* <Text style={styles.textInput}>Tên wifi</Text> */}
                <TextInput
                  placeholder="Nhập tài khoản"
                  underlineColorAndroid="transparent"
                  placeholderTextColor="#454545"
                  style={styles.txtInput}
                  onChangeText={text => this.setState({username: text})}
                  value={username}
                />
              </View>
              <View style={styles.inputView}>
                {/* <Text style={styles.textInput}>Tên wifi</Text> */}
                <TextInput
                  placeholder="Nhập mật khẩu"
                  underlineColorAndroid="transparent"
                  placeholderTextColor="#454545"
                  style={styles.txtInput}
                  onChangeText={text => this.setState({pass: text})}
                  value={pass}
                />
              </View>
              <View style={styles.inputView}>
                {/* <Text style={styles.textInput}>Tên wifi</Text> */}
                <TextInput
                  placeholder="Nhập SSID"
                  underlineColorAndroid="transparent"
                  placeholderTextColor="#454545"
                  style={styles.txtInput}
                  onChangeText={text => this.setState({ssidWifi: text})}
                  value={ssidWifi}
                />
              </View>
              <View>
                {/* <Text style={styles.textInput}>Mật khẩu wifi</Text> */}
                <TextInput
                  placeholder="Nhập mật khẩu wifi"
                  underlineColorAndroid="transparent"
                  placeholderTextColor="#454545"
                  style={styles.txtInput}
                  onChangeText={text => this.setState({passWifi: text})}
                  value={passWifi}
                />
              </View>
              <TouchableOpacity
                style={styles.btnLoginWifi}
                onPress={this.submit}>
                <Text style={styles.submitText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    color: 'rgba(9, 212, 93, 0.8)',
    justifyContent: 'center',
  },

  inputViewGroup: {
    marginHorizontal: 20,
  },

  logo: {
    width: 125,
    height: 125,
  },

  inputView: {
  },

  textInput: {
    fontSize: 18,
    color: '#000',
  },

  txtInput: {
    height: 40,
    marginVertical: 5,
    borderColor: 'gray',
    borderBottomWidth: 1,
    borderRadius: 5,
    fontSize: 15,
    paddingHorizontal: 10,
  },

  btnLoginWifi: {
    marginTop: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#ffb22b',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fff',
  },
  submitText: {
    color: '#fff',
    textAlign: 'center',
  },
});
