import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  BackHandler,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Container,
  Content,
  Button,
  Icon,
  Footer,
  FooterTab,
  Text,
  Badge,
} from 'native-base';

import {TouchableOpacity} from 'react-native-gesture-handler';

import LinearGradient from 'react-native-linear-gradient';

import {Card} from 'react-native-shadow-cards';

import bc1 from '../images/bancong1.png';
import farm1 from '../images/farm1.jpg';
import farm2 from '../images/farm2.jpg';
import imgCanabit from '../images/canabit.png';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.route.params.name,
      username: this.props.route.params.username,
      pass: this.props.route.params.pass,
      nameDevice: this.props.route.params.nameDevice,
    };
  }

  componentDidMount() {
    //BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }
  // componentWillUnmount() {
  //   BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  // }
  // onBackPress = () => {
  //   return true;
  // };

  render() {
    return (
      <Container>
        <LinearGradient
          colors={['#ebf4f5', '#ebf4f5']}
          style={styles.linearGradientContainer}>
          <Content style={styles.containerHome}>
            {/* <Card style={{paddingTop: 20, paddingBottom: 20}}> */}

            <View style={styles.headerHome}>
              <View style={styles.Header}>
                <Text style={styles.titleHome}>Xin chào!</Text>
                <Text style={styles.txtName}>{this.state.name}</Text>
              </View>
              <View style={styles.Notification}>
                <Button transparent dark style={styles.btnNotification}>
                  <Icon type="Ionicons" name="ios-notifications" />
                </Button>
              </View>
            </View>
            {/* </Card> */}
            <View style={styles.popup}>
              <Image style={styles.imgPopup} source={bc1} />
            </View>
            <View style={styles.TextHeader}>
              <Text style={styles.txtHeader}>Chức năng</Text>
              <View style={styles.contentOptions}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('DeviceManagement', {
                      pass: this.state.pass,
                      username: this.state.username,
                      nameDevice: this.state.nameDevice,
                    })
                  }>
                  <LinearGradient
                    colors={['#099773', '#43b692']}
                    style={styles.linearGradient}>
                    <View style={styles.options}>
                      <Icon
                        type="MaterialIcons"
                        name="devices-other"
                        style={styles.iconOptions}
                      />
                      <Text style={styles.txtOptions}>Quản lý thiết bị</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('Schedule', {
                      pass: this.state.pass,
                      username: this.state.username,
                      nameDevice: this.state.nameDevice,
                    })
                  }>
                  <LinearGradient
                    colors={['#099773', '#43b692']}
                    style={styles.linearGradient}>
                    <View style={styles.options}>
                      <Icon
                        type="Ionicons"
                        name="ios-settings"
                        style={styles.iconOptions}
                      />
                      <Text style={styles.txtOptions}>Cài đặt lịch tưới</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <View style={styles.contentOptions}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('HistorySchedule', {
                      pass: this.state.pass,
                      username: this.state.username,
                      nameDevice: this.state.nameDevice,
                    })
                  }>
                  <LinearGradient
                    colors={['#099773', '#43b692']}
                    style={styles.linearGradient}>
                    <View style={styles.options}>
                      <Icon
                        type="Ionicons"
                        name="md-calendar"
                        style={styles.iconOptions}
                      />
                      <Text style={styles.txtOptions}>
                        Xem lịch sử lịch tưới
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('Statistics', {
                      pass: this.state.pass,
                      username: this.state.username,
                      nameDevice: this.state.nameDevice,
                    })
                  }>
                  <LinearGradient
                    colors={['#099773', '#43b692']}
                    style={styles.linearGradient}>
                    <View style={styles.options}>
                      <Icon
                        type="Ionicons"
                        name="bar-chart"
                        style={styles.iconOptions}
                      />
                      <Text style={styles.txtOptions}>Thống kê</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
            {/* <View style={styles.TextHeader}>
              <Text style={styles.txtHeader}>Hình ảnh</Text>
              
            </View> */}
          </Content>
        </LinearGradient>
      </Container>
    );
  }
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    //color: 'rgba(9, 212, 93, 0.8)',
    justifyContent: 'center',
  },

  containerHome: {
    flex: 1,
    fontFamily: 'Montserrat',
    color: '#454545',
    margin: 15,
  },

  Header: {
    flex: 1,
  },

  headerHome: {
    flex: 1,
    flexDirection: 'row',
  },

  contentOptions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  linearGradientContainer: {
    flex: 1,
  },

  linearGradient: {
    flex: 1,
    marginTop: 10,
    borderRadius: 10,
  },

  options: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    alignItems: 'center',
    width: (windowWidth - 40) / 2,
    height: 115,
    justifyContent: 'center',
  },

  txtOptions: {
    marginTop: 5,
    textAlign: 'center',
    color: '#ebf2ea',
  },

  titleHome: {
    flex: 1,
    color: '#454545',
    fontSize: 26,
    fontWeight: 'bold',
  },

  txtName: {
    flex: 1,
    color: '#454545',
    fontSize: 15,
    marginLeft: 1,
    fontWeight: 'bold',
  },

  Notification: {
    justifyContent: 'center',
  },

  btnNotification: {
    backgroundColor: 'rgba(244, 246, 246, 0.9)',
    borderRadius: 10,
  },

  popup: {
    flex: 1,
    backgroundColor: '#3cf2de',
    borderRadius: 10,
    top: 10,
  },

  imgPopup: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },

  TextHeader: {
    flex: 1,
    marginTop: 20,
  },

  txtHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#454545',
    flex: 1,
  },

  iconView: {
    flex: 1,
    marginTop: 10,
  },

  btnFunction: {
    //backgroundColor: '#fff',
    backgroundColor: 'rgba(244, 246, 246, 0.9)',
    borderRadius: 10,
    marginTop: 5,
  },

  txtFunction: {
    color: '#454545',
    marginTop: 10,
  },

  cardViewContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cardView: {
    backgroundColor: 'rgba(248, 249, 249, 0.9)',
    marginTop: 10,
    flex: 1,
    height: 150,
    borderRadius: 10,
    borderWidth: 0.1,
    borderColor: '#20232a',
    position: 'relative',
    alignItems: 'center',
  },

  img: {
    flex: 1,
    width: '100%',
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: 'absolute',
    top: 0,
  },

  textView: {
    position: 'absolute',
    top: 100,
    marginTop: 10,
  },

  txtFarmName: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#454545',
  },

  footer: {
    backgroundColor: '#fff',
  },

  footerTab: {
    backgroundColor: '#fff',
  },

  iconFooter: {
    color: '#454545',
  },

  txtFooter: {
    color: '#454545',
  },

  iconOptions: {
    fontSize: 40,
    color: '#ebf2ea',
  },
});
