import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {
  Container,
  Content,
  Input,
  Icon,
  Button,
  InputGroup,
  Thumbnail,
  Left,
  Right,
  List,
  ListItem,
  Body,
  Header,
  Title,
} from 'native-base';

import websocket from './websocket.js';
import LinearGradient from 'react-native-linear-gradient';

export default class DeviceManagement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.route.params.name,
      username: this.props.route.params.username,
      pass: this.props.route.params.pass,
      nameDevice: this.props.route.params.nameDevice,

      codeDevice: '',
      amount: '0',
    };
  }

  componentDidMount() {
    try {
      var getInfoDevice = {
        action: 'getInfoDevice',
        data: {
          username: this.state.username,
        },
      };
      websocket.send(JSON.stringify(getInfoDevice));

      this.unReceive = websocket.receive(e => {
        const data = JSON.parse(e.data);
        if (data.action == 'getInfoDevice') {
          const infoDevice = JSON.parse(data.message);
          const sl = data.data.sl;

          // console.log('AAAAA: ', infoDevice[0].nameDevice);
          // console.log('BBBBB: ', data.data.sl);

          this.setState({
            codeDevice: infoDevice[0].nameDevice,
            amount: sl,
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  render() {
    return (
      <Container>
        <Content>
          <View style={styles.container}>
            <View style={styles.centerView}>
              <LinearGradient
                colors={['#099773', '#43b692']}
                style={styles.linearGradient}>
                <View style={styles.amountDevice}>
                  <Text style={{fontSize: 20, color: '#ebf2ea'}}>
                    Số lượng thiết bị
                  </Text>
                  <Text
                    style={{
                      marginTop: 20,
                      fontWeight: '600',
                      fontSize: 50,
                      color: '#ebf2ea',
                    }}>
                    {this.state.amount}
                  </Text>
                </View>
              </LinearGradient>
            </View>
            <LinearGradient
              colors={['#099773', '#43b692']}
              style={styles.linearGradientContent}>
              <ListItem>
                <Left>
                  <Text style={styles.sttDevice}>1</Text>
                  <View style={styles.infoDevice}>
                    <Text style={styles.textInfoDevice}>
                      Tên thiết bị: Thiết bị tưới ban công
                    </Text>
                    <Text style={styles.textInfoDevice}>
                      Mã thiết bị: {this.state.codeDevice}
                    </Text>
                  </View>
                </Left>
              </ListItem>
            </LinearGradient>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: 'Montserrat',
  },

  linearGradient: {
    width: '50%',
    alignItems: 'center',
    marginTop: 10,
    height: 200,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  linearGradientContent: {
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },

  amountDevice: {
    alignItems: 'center',
  },

  infoDeviceView: {
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },

  infoDevice: {
    marginLeft: 10,
    padding: 5,
  },

  centerView: {
    alignItems: 'center',
  },

  sttDevice: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    padding: 10,
    color: '#ebf2ea',
  },
  textInfoDevice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ebf2ea',
  },
});
