import React, {Component} from 'react';
import {Text, View, StyleSheet, Image, ImageBackground, TextInput} from 'react-native';
import {Container, Content, Input, Icon, Button, InputGroup} from 'native-base';

import bc1 from '../images/bancong1.jpg';
import logo from '../images/logo.jpg';

export default class AccountManagement extends Component {

  constructor(props) {
    super(props);
    this.state = {

      ssidWifi: '',
      passWifi: '',
      username: '',
      pass: '',

      spinner: false,
    };
  }


  render() {
    const {ssidWifi, passWifi, username, pass} = this.state;

    return (
      <Container>
        <Content contentContainerStyle={{justifyContent: 'center', flex: 1}}>
          <View style={styles.contentTop}>
            <View style={styles.viewTop}>
              <Image style={styles.imgPopup} source={bc1} />
              <Image style={styles.imgAvt} source={logo} />
            </View>
          </View>
          <View style={styles.contentBottom}>
            <View style={styles.viewBottom}>
              
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentTop: {
    flex: 3,
  },

  contentBottom: {
    flex: 7,
    marginTop: 50,
  },

  viewTop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //marginHorizontal: 10,
    // backgroundColor: '#fff',
    // borderRadius: 20,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // elevation: 5,
  },

  imgPopup: {
    flex: 7,
    width: '100%',
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  imgAvt: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 110 / 2,
    flex: 3,
    borderWidth: 2,
    borderColor: 'green',
    bottom: -50,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    elevation: 5,
  },

  viewBottom: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    elevation: 5,
  },



});
