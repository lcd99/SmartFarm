import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
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
import Toast from 'react-native-simple-toast';
import LinearGradient from 'react-native-linear-gradient';

export default class AccountManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,

      isUpdate: false,

      name: this.props.route.params.name,
      username: this.props.route.params.username,
      pass: this.props.route.params.pass,
      nameDevice: this.props.route.params.nameDevice,

      avatar: '',
      usernameUpdate: '',
      nameUpdate: '',
      numberPhoneUpdate: '',
      emailUpdate: '',
      addressUpdate: '',
      passwordUpdate: '',
      imgUpdate: '',

      passOldValue: '',
      passNewValue: '',
      passUpdate: '',

      modalVisible: false,

      pressOldPass: false,
      pressNewPass: false,
      pressPassUpdate: false,
      showOldPass: true,
      showNewPass: true,
      showPassUpdate: true,
    };
  }

  setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };

  _isUpdateClick = () => {
    this.setState({isUpdate: !this.state.isUpdate});
    if (this.state.isUpdate == true) {
      var updateInfoUserBalcony = {
        action: 'updateInfoUserBalcony',
        data: {
          username: this.state.username,
          name: this.state.nameUpdate,
          phone: this.state.numberPhoneUpdate,
          email: this.state.emailUpdate,
          address: this.state.addressUpdate,
        },
      };
      websocket.send(JSON.stringify(updateInfoUserBalcony));
    }
  };

  showOldPass = () => {
    if (this.state.pressOldPass == false) {
      this.setState({showOldPass: false, pressOldPass: true});
    } else {
      this.setState({showOldPass: true, pressOldPass: false});
    }
  };

  showNewPass = () => {
    if (this.state.pressNewPass == false) {
      this.setState({showNewPass: false, pressNewPass: true});
    } else {
      this.setState({showNewPass: true, pressNewPass: false});
    }
  };

  showPassUpdate = () => {
    if (this.state.pressPassUpdate == false) {
      this.setState({showPassUpdate: false, pressPassUpdate: true});
    } else {
      this.setState({showPassUpdate: true, pressPassUpdate: false});
    }
  };

  setConfirmChangePass = () => {
    if (
      this.state.passOldValue == '' ||
      this.state.passNewValue == '' ||
      this.state.passUpdate == ''
    ) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ', [
        {
          text: 'OK',
          onPress: () => null,
          style: 'cancel',
        },
      ]);
    } else if (this.state.passOldValue != this.state.pass) {
      Alert.alert('Thông báo', 'Mật khẩu cũ không đúng', [
        {
          text: 'Nhập lại',
          onPress: () => null,
          style: 'cancel',
        },
      ]);
      this.setState({passOldValue: ''});
    } else if (this.state.passNewValue != this.state.passUpdate) {
      Alert.alert('Thông báo', 'Mật khẩu mới và nhập lại mật khẩu không khớp', [
        {
          text: 'Nhập lại',
          onPress: () => null,
          style: 'cancel',
        },
      ]);
      this.setState({passNewValue: '', passUpdate: ''});
    } else {
      var changePassUserBalcony = {
        action: 'changePassUserBalcony',
        data: {
          username: this.state.username,
          pass: this.state.passUpdate,
        },
      };
      websocket.send(JSON.stringify(changePassUserBalcony));
    }
  };

  componentDidMount() {
    try {
      var getInfoUserBalcony = {
        action: 'getInfoUserBalcony',
        data: {
          username: this.state.username,
        },
      };
      websocket.send(JSON.stringify(getInfoUserBalcony));

      this.unReceive = websocket.receive(e => {
        const data = JSON.parse(e.data);
        if (data.action == 'changePassUserBalcony') {
          if (data.message == 'UpdatePass Success') {
            Alert.alert(
              'Thông báo',
              'Đổi mật khẩu thành công \nĐăng nhập lại để tiếp tục sử dụng',
              [
                {
                  text: 'OK',
                  onPress: () => this.props.navigation.navigate('Login'),
                  style: 'cancel',
                },
              ],
            );
          } else {
            Alert.alert('Thông báo', 'Đổi mật khẩu thất bại', [
              {
                text: 'OK',
                onPress: () => null,
                style: 'cancel',
              },
            ]);
          }
        }
        if (data.action == 'getInfoUserBalcony') {
          const dtUser = data.data;

          this.setState({
            usernameUpdate: dtUser.usernameUpdate,
            numberPhoneUpdate: dtUser.phoneUpdate,
            emailUpdate: dtUser.emailUpdate,
            addressUpdate: dtUser.addressUpdate,
            nameUpdate: dtUser.nameUpdate,
            avatar: dtUser.img,
          });
        } else if (data.action == 'updateInfoUserBalcony') {
          if (data.message == 'Update Success') {
            Toast.showWithGravity(
              'Sửa thông tin cá nhân thành công',
              Toast.LONG,
              Toast.TOP,
            );
            this.setState({name: this.state.nameUpdate});
            this.setState({isUpdate: false});
          } else {
            Toast.showWithGravity(
              'Sửa thông tin cá nhân thất bại',
              Toast.LONG,
              Toast.TOP,
            );
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  render() {
    const uri = 'http://45.124.87.133/Content/assets/images/users/logo.png';
    return (
      <Container>
        {this.state.isUpdate == true && (
          <Header
            androidStatusBarColor="gray"
            style={{backgroundColor: '#fff'}}>
            <Left>
              <TouchableOpacity
                onPress={() => this.setState({isUpdate: false})}>
                <Icon
                  name="angle-left"
                  type="FontAwesome"
                  style={{fontSize: 30, color: '#000', paddingHorizontal: 10}}
                />
              </TouchableOpacity>
            </Left>
            <Body>
              <Title style={{color: '#000', fontWeight: 'bold'}}>
                Cập nhật thông tin
              </Title>
            </Body>
            <Right />
          </Header>
        )}

        <Content>
          <View style={styles.container}>
            <View style={styles.viewTop}>
              <View style={styles.thumbnail}>
                <Thumbnail large source={{uri: uri}} />
              </View>
              {/* <Text style={{fontSize: 16, color: '#454545'}}>Họ tên</Text> */}
              <Text style={styles.txtName}>
                {this.state.name.toString().toUpperCase()}
              </Text>
            </View>
            {this.state.isUpdate == false && (
              <View style={styles.contentProfile}>
                <View style={styles.titleContent}>
                  <Text style={styles.txtTitle}>Thông tin cá nhân</Text>
                </View>
                <View style={styles.infoUser}>
                  <View style={styles.viewLeftInfoUser}>
                    <Icon
                      name="ios-person"
                      type="Ionicons"
                      style={styles.iconProfile}
                    />
                    <Text style={styles.txtSubTitle}>TÀI KHOẢN</Text>
                  </View>

                  <Text style={styles.txtInfoUser}>
                    {this.state.usernameUpdate}
                  </Text>
                </View>
                <View style={styles.infoUser}>
                  <View style={styles.viewLeftInfoUser}>
                    <Icon
                      name="phone-square"
                      type="FontAwesome"
                      style={styles.iconProfile}
                    />
                    <Text style={styles.txtSubTitle}>SỐ ĐIỆN THOẠI</Text>
                  </View>
                  <Text style={styles.txtInfoUser}>
                    {this.state.numberPhoneUpdate}
                  </Text>
                </View>
                <View style={styles.infoUser}>
                  <View style={styles.viewLeftInfoUser}>
                    <Icon
                      name="email"
                      type="MaterialIcons"
                      style={styles.iconProfile}
                    />
                    <Text style={styles.txtSubTitle}>EMAIL</Text>
                  </View>
                  <Text
                    style={{
                      flex: 1,
                      flexWrap: 'wrap',
                      marginLeft: 50,
                      fontStyle: 'italic',
                      fontSize: 16,
                      color: '#454545',
                    }}>
                    {this.state.emailUpdate}
                  </Text>
                </View>
                <View style={styles.infoUser}>
                  <View style={styles.viewLeftInfoUser}>
                    <Icon
                      name="ios-location"
                      type="Ionicons"
                      style={styles.iconProfile}
                    />
                    <Text style={styles.txtSubTitle}>ĐỊA CHỈ</Text>
                  </View>
                  <Text
                    style={{
                      flex: 1,
                      flexWrap: 'wrap',
                      marginLeft: 50,
                      fontStyle: 'italic',
                      fontSize: 16,
                      color: '#454545',
                    }}>
                    {this.state.addressUpdate}
                  </Text>
                </View>
                <View style={styles.infoUser}>
                  <View style={styles.viewLeftInfoUser}>
                    <Icon
                      name="ios-lock-closed"
                      type="Ionicons"
                      style={styles.iconProfile}
                    />
                    <Text style={styles.txtSubTitle}>MẬT KHẨU</Text>
                  </View>
                  <View style={styles.viewLeftInfoUser}>
                    <Text style={styles.txtPassword}>**********</Text>
                    <TouchableOpacity
                      onPress={() => {
                        this.setModalVisible(true);
                      }}>
                      <LinearGradient
                        colors={['#30c67c', '#30c67c']}
                        style={styles.linearGradientIcon}>
                        <Icon
                          name="account-edit"
                          type="MaterialCommunityIcons"
                          style={styles.iconEditPassword}
                        />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            {this.state.isUpdate == true && (
              <View style={styles.contentProfile}>
                <View style={styles.formUpdate}>
                  <Text style={styles.titleUpdate}>HỌ TÊN</Text>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={value => this.setState({nameUpdate: value})}
                    value={this.state.nameUpdate}
                    underlineColorAndroid="transparent"
                  />
                </View>
                <View style={styles.formUpdate}>
                  <Text style={styles.titleUpdate}>SỐ ĐIỆN THOẠI</Text>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={value =>
                      this.setState({numberPhoneUpdate: value})
                    }
                    keyboardType="numeric"
                    value={this.state.numberPhoneUpdate}
                  />
                </View>
                <View style={styles.formUpdate}>
                  <Text style={styles.titleUpdate}>EMAIL</Text>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={value => this.setState({emailUpdate: value})}
                    value={this.state.emailUpdate}
                  />
                </View>
                <View style={styles.formUpdate}>
                  <Text style={styles.titleUpdate}>ĐỊA CHỈ</Text>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={value =>
                      this.setState({addressUpdate: value})
                    }
                    value={this.state.addressUpdate}
                  />
                </View>
                {/* <View style={styles.formUpdate}>
                  <Text style={styles.titleUpdate}>MẬT KHẨU</Text>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={value =>
                      this.setState({passwordUpdate: value})
                    }
                    value={this.state.passwordUpdate}
                    secureTextEntry={true}
                  />
                </View> */}
              </View>
            )}
          </View>
        </Content>
        <TouchableOpacity onPress={this._isUpdateClick}>
          <LinearGradient
            colors={['#30c67c', '#30c67c']}
            style={styles.linearGradient}>
            <View style={styles.btnUpdateProfile}>
              <Text style={styles.txtUpdateProfile}>
                {this.state.isUpdate == false
                  ? 'Cập nhật thông tin'
                  : 'Cập nhật'}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
        {this.state.isUpdate == false && (
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Login')}>
            <LinearGradient
              colors={['#fd4b2f', '#fd4b2f']}
              style={styles.linearGradient}>
              <View style={styles.btnLogout}>
                <Text style={styles.txtLogout}>Đăng xuất</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <Modal
          //scrollHorizontal={true}
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(!this.state.modalVisible);
          }}>
          <View style={styles.modalView}>
            <View style={styles.modalCenterView}>
              <Text style={styles.titleChangePass}>Đổi mật khẩu</Text>
              <View style={styles.formUpdatePass}>
                <Text style={styles.titleUpdate}>MẬT KHẨU CŨ</Text>
                <View style={styles.inInput}>
                  <TextInput
                    style={styles.input}
                    onChangeText={value => this.setState({passOldValue: value})}
                    value={this.state.passOldValue}
                    secureTextEntry={this.state.showOldPass}
                  />
                  <TouchableOpacity
                    styles={styles.inputIconEye}
                    onPress={this.showOldPass.bind(this)}>
                    <Icon
                      type="Ionicons"
                      name={
                        this.state.pressOldPass == false
                          ? 'ios-eye'
                          : 'ios-eye-off'
                      }
                      style={styles.inputIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.formUpdatePass}>
                <Text style={styles.titleUpdate}>MẬT KHẨU MỚI</Text>
                <View style={styles.inInput}>
                  <TextInput
                    style={styles.input}
                    onChangeText={value => this.setState({passNewValue: value})}
                    value={this.state.passNewValue}
                    secureTextEntry={this.state.showNewPass}
                  />
                  <TouchableOpacity
                    styles={styles.inputIconEye}
                    onPress={this.showNewPass.bind(this)}>
                    <Icon
                      type="Ionicons"
                      name={
                        this.state.pressNewPass == false
                          ? 'ios-eye'
                          : 'ios-eye-off'
                      }
                      style={styles.inputIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.formUpdatePass}>
                <Text style={styles.titleUpdate}>NHẬP LẠI MẬT KHẨU MỚI</Text>
                <View style={styles.inInput}>
                  <TextInput
                    style={styles.input}
                    onChangeText={value => this.setState({passUpdate: value})}
                    value={this.state.passUpdate}
                    secureTextEntry={this.state.showPassUpdate}
                  />
                  <TouchableOpacity
                    styles={styles.inputIconEye}
                    onPress={this.showPassUpdate.bind(this)}>
                    <Icon
                      type="Ionicons"
                      name={
                        this.state.pressPassUpdate == false
                          ? 'ios-eye'
                          : 'ios-eye-off'
                      }
                      style={styles.inputIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.viewButton}>
                <View style={styles.viewText}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setModalVisible(!this.state.modalVisible);
                    }}>
                    <Text style={styles.txtCancel}>HỦY</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.viewText}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setConfirmChangePass(!this.state.modalVisible);
                    }}>
                    <Text style={styles.txtOK}>XÁC NHẬN</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: 'Montserrat',
  },

  viewTop: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  thumbnail: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: 'green',
  },

  txtName: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },

  contentProfile: {
    flex: 1,
    marginHorizontal: 15,
    marginTop: 10,
  },

  titleContent: {
    marginVertical: 10,
  },

  txtTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#454545',
  },

  infoUser: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#454545',
    marginBottom: 10,
  },

  txtSubTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#454545',
    marginLeft: 10,
  },

  txtInfoUser: {
    fontStyle: 'italic',
    fontSize: 16,
    color: '#454545',
    //flexWrap: 'wrap'
  },

  txtPassword: {
    fontStyle: 'italic',
    fontSize: 16,
    color: '#454545',
    marginRight: 15,
    paddingVertical: 6,
    textAlign: 'center',
  },

  viewLeftInfoUser: {
    flexDirection: 'row',
  },

  iconProfile: {
    fontSize: 20,
    color: '#454545',
  },

  linearGradientIcon: {
    padding: 5,
    borderRadius: 5,
  },
  iconEditPassword: {
    fontSize: 20,
    color: '#fff',
    backgroundColor: 'transparent',
  },

  btnUpdateProfile: {
    backgroundColor: 'transparent',
    // padding: 10,
    // marginHorizontal: 15,
    // borderRadius: 5,
    // alignItems: 'center',
    // //marginBottom: 10,
    // marginHorizontal: 10,
  },

  linearGradient: {
    marginTop: 10,
    padding: 10,
    marginHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    //marginBottom: 10,
    marginHorizontal: 10,
  },

  btnLogout: {
    backgroundColor: 'transparent',
  },

  txtLogout: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
  },

  txtUpdateProfile: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
  },

  formUpdate: {
    marginBottom: 10,
  },

  titleUpdate: {
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 10,
  },

  textInput: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 5,
    paddingLeft: 10,
    fontSize: 18,
    //backgroundColor: 'rgba(5,165,209,0.1)',
    backgroundColor: 'rgba(0,0,0,0)',
    paddingVertical: 10,
    color: '#000',
  },

  modalView: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },

  modalCenterView: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    elevation: 5,
    flexDirection: 'column',
    marginHorizontal: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    borderRadius: 20,
    marginTop: 50,
  },

  titleChangePass: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },

  formUpdatePass: {
    marginHorizontal: 20,
    marginTop: 10,
  },

  viewButton: {
    marginTop: 20,
    flexDirection: 'row',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  viewText: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    paddingBottom: 10,
  },

  txtCancel: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 18,
  },

  txtOK: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 18,
  },

  inInput: {
    flexDirection: 'row',
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
  },

  inputIcon: {
    padding: 10,
    //backgroundColor: '#f00',
  },

  input: {
    flex: 1,
    color: '#000',
    paddingLeft: 10,
  },
});
