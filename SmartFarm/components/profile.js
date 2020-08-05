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
    };
  }

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
          }
        } else {
          console.log(data.message);
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
          <Header>
            <Left>
              <TouchableOpacity onPress={() => this.setState({isUpdate: false})}>
                <Icon
                  name="angle-left"
                  type="FontAwesome"
                  style={{fontSize: 30, color: '#fff', paddingHorizontal: 10}}
                />
              </TouchableOpacity>
            </Left>
            <Body>
              <Title>Cập nhật thông tin</Title>
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
                  <Text style={styles.txtInfoUser}>
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
                    <TouchableOpacity>
                      <Icon
                        name="account-edit"
                        type="MaterialCommunityIcons"
                        style={styles.iconEditPassword}
                      />
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
          <View style={styles.btnUpdateProfile}>
            <Text style={styles.txtUpdateProfile}>
              {this.state.isUpdate == false ? 'Cập nhật thông tin' : 'Cập nhật'}
            </Text>
          </View>
        </TouchableOpacity>
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

  iconEditPassword: {
    fontSize: 20,
    color: '#fff',
    backgroundColor: 'green',
    padding: 5,
    borderRadius: 5,
  },

  btnUpdateProfile: {
    backgroundColor: 'green',
    padding: 10,
    marginHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
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
  },

  textInput: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 5,
    paddingLeft: 10,
    fontSize: 18,
    backgroundColor: 'rgba(5,165,209,0.1)',
  },
});
