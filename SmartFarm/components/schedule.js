import React, {Component, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  TextInput,
  ScrollView,
  FlatList,
  Switch,
  SafeAreaView,
  TouchableHighlight,
  Animated,
  Alert,
} from 'react-native';

import {
  Container,
  Content,
  Button,
  Icon,
  Left,
  CheckBox,
  Header,
  Body,
  Right,
  ListItem,
  Footer,
  FooterTab,
  Form,
  Text,
} from 'native-base';

//import ToggleSwitch from 'toggle-switch-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ToggleSwitch from 'rn-toggle-switch';
import Swipeout from 'react-native-swipeout';
import Dialog from 'react-native-dialog';

import Spinner from 'react-native-loading-spinner-overlay';

// import Constants from 'expo-constants';

import moment from 'moment';
import websocket from './websocket.js';

//import TimePicker from 'react-native-simple-time-picker';

export default class Schedule extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    select1: false,
    select2: false,
    select3: false,
    select4: false,
    select5: false,
    select6: false,
    select7: false,

    modalVisible: false,
    switchValue: false,
    modalChoseDay: false,
    modalTime: false,
    modalFlow: false,
    selectRepeat: false,
    selectTime: false,
    selectFlow: false,
    modalModeIrr: false,
    isEnabled: true,

    date: new Date(),
    time: {
      hours: new Date().getHours(),
      minutes: new Date().getMinutes(),
    },
    mode: 'time',
    showModal: true,

    isPickerVisible: false,

    chosenTime: new Date().getHours() + ':' + new Date().getMinutes(),

    text: '',
    irrigationTime: '30',
    irrigationFlow: '2',
    day: new Array(),
    rangeDay: new Array(),
    repeat: '0',

    timeIrr: true,
    flowIrr: false,

    dataSchedule: new Array(),
    refreshData: false,
    updateData: false,

    spinner: false,

    editItem: false,
    isChecked: new Array(),
    selectedLists: new Array(),

    controlOpacity: new Animated.Value(0),
    controlHeight: new Animated.Value(0),
    controlWidth: new Animated.Value(0),

    dialogVisible: false,

    username: '',
    passInput: '',

    pass: this.props.route.params.pass,
    showPass: true,
    press: false,

    iconAddSchedule: '',
    iconDeleteSchedule: '',
  };

  checkActiveIconFooter = () => {
    if (this.state.iconAddSchedule == '') {
      this.setState({iconAddSchedule: 'active'});
      this.setState({iconDeleteSchedule: ''});
    } else {
      this.setState({iconAddSchedule: ''});
      this.setState({iconDeleteSchedule: 'active'});
    }
  };

  showPass = () => {
    if (this.state.press == false) {
      this.setState({showPass: false, press: true});
    } else {
      this.setState({showPass: true, press: false});
    }
  };

  loadDay = day => {
    var loadDay = new Array();
    var arr = day
      .toString(10)
      .replace(/\D/g, '0')
      .split('')
      .map(Number);
    //console.log(arr);

    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == '1') loadDay.push('CN');
      if (arr[i] == '2') loadDay.push('Th2');
      if (arr[i] == '3') loadDay.push('Th3');
      if (arr[i] == '4') loadDay.push('Th4');
      if (arr[i] == '5') loadDay.push('Th5');
      if (arr[i] == '6') loadDay.push('Th6');
      if (arr[i] == '7') loadDay.push('Th7');
    }

    return loadDay.toString();
  };

  handleConfirm = DateTime => {
    this.setState({
      isPickerVisible: false,
      chosenTime: moment(DateTime).format('HH:mm'),
    });
  };

  hidePicker = () => {
    this.setState({
      isPickerVisible: false,
    });
  };

  showPicker = () => {
    this.setState({isPickerVisible: true});
  };

  setDate = (event, date) => {
    date = date || this.state.state;
    this.setState({
      show: Platform.OS === 'ios' ? true : false,
      date,
    });
  };

  datePicker = () => {
    this.show('date');
  };

  timePicker = () => {
    this.show('time');
  };

  setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };

  setModalVisibleChoseDay = visible => {
    this.setState({modalChoseDay: visible});
  };

  setModalVisibleTime = visible => {
    this.setState({modalTime: visible});
  };

  setModalVisibleFlow = visible => {
    this.setState({modalFlow: visible});
  };

  setConfirmTime = visible => {
    this.setState({modalTime: visible});
    this.setState({irrigationTime: this.state.text});
    this.setState({text: ''});
  };

  setConfirmModeIrr = visible => {
    this.setState({modalModeIrr: visible});
  };

  setConfirmFlow = visible => {
    this.setState({modalFlow: visible});
    this.setState({irrigationFlow: this.state.text});
    this.setState({text: ''});
  };

  setModalModeIrr = visible => {
    this.setState({modalModeIrr: visible});
  };

  setSelectedDay = () => {};

  selectModeTime = () => {
    this.setState({timeIrr: true});
    this.setState({flowIrr: false});
    this.setModalModeIrr(false);
  };

  selectModeFlow = () => {
    this.setState({timeIrr: false});
    this.setState({flowIrr: true});
    this.setModalModeIrr(false);
  };

  setRepeat = () => {
    if (this.state.selectRepeat == false) {
      this.setState({selectRepeat: true});
      this.setState({repeat: '1'});
    } else {
      this.setState({selectRepeat: false});
      this.setState({repeat: '0'});
    }
  };

  setConfirmSelectDay = visible => {
    this.state.day = new Array();
    this.state.rangeDay = new Array();
    if (this.state.select1 == true) {
      this.state.day.push(1);
      this.state.rangeDay.push('CN');
    }
    if (this.state.select2 == true) {
      this.state.day.push(2);
      this.state.rangeDay.push('Th2');
    }
    if (this.state.select3 == true) {
      this.state.day.push(3);
      this.state.rangeDay.push('Th3');
    }
    if (this.state.select4 == true) {
      this.state.day.push(4);
      this.state.rangeDay.push('Th4');
    }
    if (this.state.select5 == true) {
      this.state.day.push(5);
      this.state.rangeDay.push('Th5');
    }
    if (this.state.select6 == true) {
      this.state.day.push(6);
      this.state.rangeDay.push('Th6');
    }
    if (this.state.select7 == true) {
      this.state.day.push(7);
      this.state.rangeDay.push('Th7');
    }

    this.setState({modalChoseDay: visible});
  };

  handleInputChange = text => {
    this.setState({
      text: text.replace(/[^0-9]/g, ''),
    });
  };

  addBalconyIrrigationSchedule = () => {
    //console.log(this.state.timeIrr);

    //this.setState({spinner: !this.state.spinner});

    try {
      if (this.state.timeIrr == true) {
        var addScheduleModeTime = {
          action: 'addScheduleModeTime',
          data: {
            time: this.state.chosenTime, //
            irrigationTime: this.state.irrigationTime,
            day: this.state.day.join(''),
            repeat: this.state.repeat,
          },
        };
        websocket.send(JSON.stringify(addScheduleModeTime));
      } else if (this.state.flowIrr == true) {
        var addScheduleModeFlow = {
          action: 'addScheduleModeFlow',
          data: {
            time: this.state.chosenTime,
            irrigationFlow: this.state.irrigationFlow,
            day: this.state.day.join(''),
            repeat: this.state.repeat,
          },
        };
        websocket.send(JSON.stringify(addScheduleModeFlow));
      }
    } catch (error) {
      console.log(error);
    }
  };

  updateStatusSchedule(idSchedule, statusSchedule) {
    var updateStatus = {
      action: 'updateStatus',
      data: {
        id: idSchedule,
        status: statusSchedule == 1 ? 0 : 1,
      },
    };

    //console.log(updateStatus);
    websocket.send(JSON.stringify(updateStatus));
  }

  showDialog = () => {
    if (this.state.selectedLists.length == 0) {
      alert('Vui lòng chọn lịch cần xóa');
    } else {
      this.setState({dialogVisible: true});
    }
  };

  handleCancel = () => {
    this.setState({dialogVisible: false});
  };

  handleDelete = () => {
    // The user has pressed the "Delete" button, so here you can do your own logic.
    // ...Your logic
    //this.setState({spinner: !this.state.spinner});

    console.log('passInput: ', this.state.passInput);
    console.log('pass: ', this.state.pass);

    if (this.state.passInput == this.state.pass) {
      var deleteSchedule = {
        action: 'deleteSchedule',
        data: {
          id: this.state.selectedLists,
        },
      };

      websocket.send(JSON.stringify(deleteSchedule));
    } else {
      alert('Mật khẩu không đúng!');
    }
    //this.setState({dialogVisible: false});
  };

  toggleEditItem() {
    if (!this.state.editItem) {
      Animated.parallel([
        Animated.timing(this.state.controlOpacity, {
          toValue: 1,
          duration: 400,
        }),
        Animated.timing(this.state.controlHeight, {
          toValue: 50,
          duration: 400,
        }),
        Animated.timing(this.state.controlWidth, {
          toValue: 20,
          duration: 400,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(this.state.controlOpacity, {
          toValue: 0,
          duration: 400,
        }),
        Animated.timing(this.state.controlHeight, {
          toValue: 0,
          duration: 400,
        }),
        Animated.timing(this.state.controlWidth, {
          toValue: 0,
          duration: 400,
        }),
      ]).start();
    }

    this.setState({editItem: !this.state.editItem});
  }

  isIconCheckedOrNot = (item, index) => {
    let {isChecked, selectedLists} = this.state;
    isChecked[index] = !isChecked[index];
    this.setState({isChecked: isChecked});
    if (isChecked[index] == true) {
      selectedLists.push(item.id);
    } else {
      selectedLists.pop(item.id);
    }

    console.log(selectedLists);
  };

  renderItem = ({item, index}) => (
    <View style={styles.item}>
      <ListItem>
        <Animated.View
          style={{
            opacity: this.state.controlOpacity,
            width: this.state.controlWidth,
          }}>
          <CheckBox
            color="red"
            checked={this.state.isChecked[index]}
            onPress={() => this.isIconCheckedOrNot(item, index)}
          />
        </Animated.View>
        <Body>
          <Text style={styles.txtTime}>{item.time}</Text>
          <Text style={styles.txtMinute}>
            {item.mode == '1'
              ? 'Thời gian tưới: ' + item.irrigation_time + ' phút'
              : 'Lưu lượng tưới: ' + item.irrigation_flow + ' lít'}
          </Text>

          <Text style={styles.txtMinute}>
            Ngày tưới: {this.loadDay(item.day)}
          </Text>
        </Body>
        <Right>
          <ToggleSwitch
            text={{
              on: 'on',
              off: 'off',
              activeTextColor: '#000',
              inactiveTextColor: '#000',
            }}
            textStyle={{fontWeight: '200'}}
            color={{
              indicator: 'white',
              active: 'rgba(0, 181, 0, 1)',
              inactive: 'rgba( 255, 0, 0, 1)',
              activeBorder: '#00B300',
              inactiveBorder: '#FF0000',
            }}
            active={item.status == 1 ? true : false}
            //disabled={false}
            width={25}
            radius={10}
            onValueChange={() => {
              //console.log(item.id, item.status);
              this.updateStatusSchedule(item.id, item.status);
            }}
          />
        </Right>
      </ListItem>
    </View>
  );

  componentWillUnmount() {
    if (this.unReceive) {
      this.unReceive();
    }
    let initialCheck = this.state.selectedLists.map(() => false);
    this.setState({isChecked: initialCheck});
  }
  componentDidMount() {
    // setTimeout(() => {
    //   this.setState({spinner: !this.state.spinner});
    // }, 3000);

    //this.setState({spinner: !this.state.spinner});
    try {
      var getScheduleIrr = {
        action: 'ClientGetScheduleIrr',
      };
      websocket.send(JSON.stringify(getScheduleIrr));
      this.unReceive = websocket.receive(e => {
        //console.log(e);
        const data = JSON.parse(e.data);

        //console.log(e);
        if (
          data.action == 'addScheduleModeTime' ||
          data.action == 'addScheduleModeFlow'
        ) {
          if (data.message == 'addSchedule success') {
            console.log('Thêm thành công');

            websocket.send(JSON.stringify(getScheduleIrr));
            this.unReceive = websocket.receive(e => {
              //console.log(e);
              const data = JSON.parse(e.data);
              this.setState({dataSchedule: data});
            });
            this.setModalVisible(false);
            //this.setState({spinner: !this.state.spinner});
          } else {
            //alert(data.message);
            //console.log('Thêm thất bại');
          }
        } else if (data.action == 'updateStatus') {
          if (data.message == 'updateSuccess') {
            console.log('updateSuccess');
            this.setState({dialogVisible: false});
          } else {
            console.log('updateFail');
          }
        } else {
          this.setState({dataSchedule: data});
          //this.setState({spinner: !this.state.spinner});
        }

        if (data.action == 'deleteSchedule') {
          if (data.message == 'deleteSuccess') {
            console.log('deleteSuccess');
            this.setState({dialogVisible: false});

            this.setState({isChecked: new Array()});
            this.setState({selectedLists: new Array()});

            websocket.send(JSON.stringify(getScheduleIrr));

            this.unReceive = websocket.receive(e => {
              //console.log(e);
              const data = JSON.parse(e.data);
              this.setState({dataSchedule: data});
            });
          } else {
            console.log('deleteFail');
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const {
      select1,
      select2,
      select3,
      select4,
      select5,
      select6,
      select7,
    } = this.state;

    const {modalVisible} = this.state;
    const {modalChoseDay} = this.state;
    const {modalTime, modalFlow, modalModeIrr} = this.state;
    const {flowIrr, timeIrr} = this.state;

    const {isPickerVisible, chosenTime} = this.state;

    const {irrigationTime, irrigationFlow, text} = this.state;

    const {dataSchedule, isEnabled} = this.state;

    return (
      <Container>
        <Spinner visible={this.state.spinner} textContent={'Loading...'} />
        <View>
          <Dialog.Container visible={this.state.dialogVisible}>
            <Dialog.Title>Xóa lịch</Dialog.Title>
            <Dialog.Description>Nhập mật khẩu để tiếp tục</Dialog.Description>
            <Dialog.Input
              placeholder="Nhập mật khẩu"
              style={{borderBottomWidth: 1}}
              onChangeText={value => this.setState({passInput: value})}
              value={this.state.passInput}
              secureTextEntry={this.state.showPass}
            />
            <Dialog.Button label="Cancel" onPress={this.handleCancel} />
            <Dialog.Button label="Delete" onPress={this.handleDelete} />
          </Dialog.Container>
        </View>
        <ScrollView>
          <Content style={styles.Content}>
            <SafeAreaView style={styles.container}>
              <FlatList
                data={dataSchedule}
                keyExtractor={item => item.id}
                renderItem={this.renderItem}
                refreshing={this.state.refreshData}
                // onRefresh={this.handleRefresh}
              />
            </SafeAreaView>
          </Content>
        </ScrollView>
        <Animated.View
          style={{
            ...styles.btnDelete,
            opacity: this.state.controlOpacity,
            height: this.state.controlHeight,
          }}>
          <Button bordered danger onPress={this.showDialog}>
            <Text>Xóa lịch đã chọn</Text>
            <Icon type="Ionicons" name="ios-trash" />
          </Button>
        </Animated.View>

        <Footer>
          <FooterTab>
            <Button
              style={{backgroundColor: '#1fab89'}}
              active
              onPress={() => {
                this.setModalVisible(true);
              }}>
              <Icon
                active
                type="Ionicons"
                name="ios-alarm"
                style={{color: '#d7fbe8'}}
              />
              {/* <View style={styles.ViewFab}> */}
              <Form>
                <View style={styles.centeredView}>
                  <Modal
                    scrollHorizontal={true}
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                      this.setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.modalView}>
                      <View style={styles.modalHeader}>
                        <TouchableOpacity>
                          <Button
                            transparent
                            onPress={() => {
                              this.setModalVisible(!modalVisible);
                            }}>
                            <Icon
                              size={35}
                              type="AntDesign"
                              name="close"
                              style={styles.iconHeaderModal}
                            />
                          </Button>
                        </TouchableOpacity>
                        <Text style={styles.modalText} center>
                          THÊM GIỜ TƯỚI
                        </Text>
                        <Button
                          transparent
                          onPress={this.addBalconyIrrigationSchedule}>
                          <Icon
                            size={35}
                            type="AntDesign"
                            name="check"
                            style={styles.iconHeaderModal}
                          />
                        </Button>
                      </View>
                      <View>
                        <TouchableOpacity onPress={this.showPicker}>
                          <View style={styles.selectTime}>
                            <Text style={styles.txtSelectTime}>
                              {this.state.chosenTime}
                            </Text>
                            <DateTimePickerModal
                              isVisible={isPickerVisible}
                              onConfirm={this.handleConfirm}
                              onCancel={this.hidePicker}
                              is24Hour={true}
                              mode={'time'}
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          this.setModalVisibleChoseDay(true);
                        }}>
                        <Modal
                          scrollHorizontal={true}
                          animationType="slide"
                          transparent={true}
                          visible={modalChoseDay}
                          onRequestClose={() => {
                            this.setModalVisibleChoseDay(!modalVisible);
                          }}>
                          <View style={styles.centeredViewChoseDay}>
                            <ScrollView>
                              <View style={styles.modalViewChoseDay}>
                                <Text style={styles.modalTextSelectDay}>
                                  Chọn ngày lặp
                                </Text>
                                <TouchableOpacity
                                  onPress={() =>
                                    this.setState({select2: !select2})
                                  }>
                                  <View style={styles.viewChoseDay}>
                                    <Left>
                                      <Text style={styles.txtDay}>Thứ 2</Text>
                                    </Left>
                                    <CheckBox
                                      checked={select2}
                                      color="#454545"
                                      style={styles.cbSelectDay}
                                      onPress={() =>
                                        this.setState({select2: !select2})
                                      }
                                    />
                                  </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() =>
                                    this.setState({select3: !select3})
                                  }>
                                  <View style={styles.viewChoseDay}>
                                    <Left>
                                      <Text style={styles.txtDay}>Thứ 3</Text>
                                    </Left>
                                    <CheckBox
                                      checked={this.state.select3}
                                      color="#454545"
                                      onPress={() =>
                                        this.setState({select3: !select3})
                                      }
                                      style={styles.cbSelectDay}
                                    />
                                  </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() =>
                                    this.setState({select4: !select4})
                                  }>
                                  <View style={styles.viewChoseDay}>
                                    <Left>
                                      <Text style={styles.txtDay}>Thứ 4</Text>
                                    </Left>
                                    <CheckBox
                                      checked={this.state.select4}
                                      color="#454545"
                                      style={styles.cbSelectDay}
                                      onPress={() =>
                                        this.setState({select4: !select4})
                                      }
                                    />
                                  </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() =>
                                    this.setState({select5: !select5})
                                  }>
                                  <View style={styles.viewChoseDay}>
                                    <Left>
                                      <Text style={styles.txtDay}>Thứ 5</Text>
                                    </Left>
                                    <CheckBox
                                      checked={this.state.select5}
                                      color="#454545"
                                      style={styles.cbSelectDay}
                                      onPress={() =>
                                        this.setState({select5: !select5})
                                      }
                                    />
                                  </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() =>
                                    this.setState({select6: !select6})
                                  }>
                                  <View style={styles.viewChoseDay}>
                                    <Left>
                                      <Text style={styles.txtDay}>Thứ 6</Text>
                                    </Left>
                                    <CheckBox
                                      checked={this.state.select6}
                                      color="#454545"
                                      style={styles.cbSelectDay}
                                      onPress={() =>
                                        this.setState({select6: !select6})
                                      }
                                    />
                                  </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() =>
                                    this.setState({select7: !select7})
                                  }>
                                  <View style={styles.viewChoseDay}>
                                    <Left>
                                      <Text style={styles.txtDay}>Thứ 7</Text>
                                    </Left>
                                    <CheckBox
                                      checked={this.state.select7}
                                      color="#454545"
                                      style={styles.cbSelectDay}
                                      onPress={() =>
                                        this.setState({select7: !select7})
                                      }
                                    />
                                  </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() =>
                                    this.setState({select1: !select1})
                                  }>
                                  <View style={styles.viewChoseDay}>
                                    <Left>
                                      <Text style={styles.txtDay}>
                                        Chủ nhật
                                      </Text>
                                    </Left>
                                    <CheckBox
                                      checked={this.state.select1}
                                      color="#454545"
                                      style={styles.cbSelectDay}
                                      onPress={() =>
                                        this.setState({select1: !select1})
                                      }
                                    />
                                  </View>
                                </TouchableOpacity>
                                <View style={styles.viewButton}>
                                  <View style={styles.viewText}>
                                    <TouchableOpacity
                                      onPress={() => {
                                        this.setModalVisibleChoseDay(
                                          !modalChoseDay,
                                        );
                                      }}>
                                      <Text style={styles.txtCancel}>HỦY</Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.viewText}>
                                    <TouchableOpacity
                                      onPress={() => {
                                        this.setConfirmSelectDay(
                                          !modalChoseDay,
                                        );
                                      }}>
                                      <Text style={styles.txtOK}>XÁC NHẬN</Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                            </ScrollView>
                          </View>
                        </Modal>

                        <View style={styles.modalOptions}>
                          <View style={styles.itemOptions}>
                            <Left>
                              <Text style={styles.txtItemModal}>Lặp lại</Text>
                            </Left>
                            <Text style={styles.txtMinute}>
                              {this.state.rangeDay.toString()}
                            </Text>
                            <Icon
                              type="Entypo"
                              name="chevron-small-right"
                              style={styles.iconItemModal}
                            />
                          </View>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          this.setModalVisibleTime(true);
                        }}>
                        <View style={styles.modalOptions}>
                          <View style={styles.itemOptions}>
                            <Left>
                              <Text style={styles.txtItemModal}>Thời gian</Text>
                            </Left>
                            <Text style={styles.txtMinute}>
                              {this.state.irrigationTime} phút
                            </Text>
                            <Icon
                              type="Entypo"
                              name="chevron-small-right"
                              style={styles.iconItemModal}
                            />
                            <Modal
                              scrollHorizontal={true}
                              animationType="slide"
                              transparent={true}
                              visible={modalTime}
                              onRequestClose={() => {
                                this.setModalVisibleTime(!modalVisible);
                              }}>
                              <View style={styles.centeredViewTime}>
                                <ScrollView>
                                  <View style={styles.modalViewTime}>
                                    <Text style={styles.modalTextTime}>
                                      Thời gian tưới (phút)
                                    </Text>
                                    <TextInput
                                      style={styles.textInputTime}
                                      placeholder="Nhập thời gian tưới (phút)"
                                      underlineColorAndroid="transparent"
                                      autoFocus={true}
                                      placeholderStyle={{}}
                                      keyboardType="numeric"
                                      onChangeText={this.handleInputChange}
                                      value={this.state.text}
                                    />
                                    <View style={styles.viewButton}>
                                      <View style={styles.viewText}>
                                        <TouchableOpacity
                                          onPress={() => {
                                            this.setModalVisibleTime(
                                              !modalTime,
                                            );
                                          }}>
                                          <Text style={styles.txtCancel}>
                                            HỦY
                                          </Text>
                                        </TouchableOpacity>
                                      </View>
                                      <View style={styles.viewText}>
                                        <TouchableOpacity
                                          onPress={() => {
                                            this.setConfirmTime(!modalTime);
                                          }}>
                                          <Text style={styles.txtOK}>
                                            XÁC NHẬN
                                          </Text>
                                        </TouchableOpacity>
                                      </View>
                                    </View>
                                  </View>
                                </ScrollView>
                              </View>
                            </Modal>
                          </View>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          this.setModalVisibleFlow(true);
                        }}>
                        <View style={styles.modalOptions}>
                          <View style={styles.itemOptions}>
                            <Left>
                              <Text style={styles.txtItemModal}>
                                Lưu lượng tưới
                              </Text>
                            </Left>
                            <Text style={styles.txtMinute}>
                              {this.state.irrigationFlow} lít
                            </Text>
                            <Icon
                              type="Entypo"
                              name="chevron-small-right"
                              style={styles.iconItemModal}
                            />
                            <Modal
                              scrollHorizontal={true}
                              animationType="slide"
                              transparent={true}
                              visible={modalFlow}
                              onRequestClose={() => {
                                this.setModalVisibleFlow(!modalVisible);
                              }}>
                              <View style={styles.centeredViewTime}>
                                <ScrollView>
                                  <View style={styles.modalViewTime}>
                                    <Text style={styles.modalTextTime}>
                                      Lưu lượng tưới (lít)
                                    </Text>
                                    <TextInput
                                      style={styles.textInputTime}
                                      placeholder="Nhập lưu lượng tưới (lít)"
                                      underlineColorAndroid="transparent"
                                      autoFocus={true}
                                      placeholderStyle={{}}
                                      keyboardType="numeric"
                                      onChangeText={this.handleInputChange}
                                      value={this.state.text}
                                    />
                                    <View style={styles.viewButton}>
                                      <View style={styles.viewText}>
                                        <TouchableOpacity
                                          onPress={() => {
                                            this.setModalVisibleFlow(
                                              !modalFlow,
                                            );
                                          }}>
                                          <Text style={styles.txtCancel}>
                                            HỦY
                                          </Text>
                                        </TouchableOpacity>
                                      </View>
                                      <View style={styles.viewText}>
                                        <TouchableOpacity
                                          onPress={() => {
                                            this.setConfirmFlow(!modalFlow);
                                          }}>
                                          <Text style={styles.txtOK}>
                                            XÁC NHẬN
                                          </Text>
                                        </TouchableOpacity>
                                      </View>
                                    </View>
                                  </View>
                                </ScrollView>
                              </View>
                            </Modal>
                          </View>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          this.setModalModeIrr(true);
                        }}>
                        <View style={styles.modalOptions}>
                          <View style={styles.itemOptions}>
                            <Left>
                              <Text style={styles.txtItemModal}>
                                Chọn chế độ tưới
                              </Text>
                            </Left>
                            <Text style={styles.txtMinute}>
                              {this.state.timeIrr === true
                                ? 'Tưới theo thời gian'
                                : 'Tưới theo lưu lượng'}
                            </Text>
                            <Icon
                              type="Entypo"
                              name="chevron-small-right"
                              style={styles.iconItemModal}
                            />
                            <Modal
                              scrollHorizontal={true}
                              animationType="slide"
                              transparent={true}
                              visible={modalModeIrr}
                              onRequestClose={() => {
                                this.setModalModeIrr(!modalVisible);
                              }}>
                              <View style={styles.centeredViewTime}>
                                <ScrollView>
                                  <View style={styles.modalViewTime}>
                                    <Text style={styles.modalTextTime}>
                                      Chọn chế độ tưới
                                    </Text>
                                    <View style={styles.modeIrr}>
                                      <TouchableOpacity
                                        onPress={() => {
                                          this.selectModeTime(!modalModeIrr);
                                        }}>
                                        <View style={styles.modeView}>
                                          <Text style={styles.modeText}>
                                            Tưới theo thời gian
                                          </Text>
                                        </View>
                                      </TouchableOpacity>
                                      <TouchableOpacity
                                        onPress={() => {
                                          this.selectModeFlow(!modalModeIrr);
                                        }}>
                                        <View style={styles.modeView}>
                                          <Text style={styles.modeText}>
                                            Tưới theo lưu lượng
                                          </Text>
                                        </View>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                </ScrollView>
                              </View>
                            </Modal>
                          </View>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={this.setRepeat.bind(this)}>
                        <View style={styles.modalOptions}>
                          <View style={styles.itemOptions}>
                            <Left>
                              <Text style={styles.txtItemModal}>
                                Lặp lại hằng tuần
                              </Text>
                            </Left>
                            <CheckBox
                              checked={this.state.selectRepeat}
                              color="#454545"
                              style={styles.cbSelectDay}
                              onPress={this.setRepeat.bind(this)}
                            />
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </Modal>
                </View>
              </Form>
              {/* </View> */}
            </Button>
            <Button
              active
              onPress={() => this.toggleEditItem()}
              style={{backgroundColor: '#1fab89'}}>
              <Icon
                type="Ionicons"
                name="ios-trash"
                style={{color: '#d7fbe8'}}
              />
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   // marginTop: Constants.statusBarHeight,
  // },

  Content: {
    flex: 1,
    flexDirection: 'column',
    fontFamily: 'Montserrat',
  },

  item: {
    flex: 1,
    margin: 0,
  },

  btnDelete: {
    marginHorizontal: 50,
  },

  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
    paddingTop: 10,
    borderBottomColor: '#454545',
    borderBottomWidth: 1,
    paddingHorizontal: 20,
  },

  txtTime: {
    fontSize: 20,
    color: '#454545',
    paddingBottom: 5,
  },

  txtMinute: {
    fontSize: 13,
    fontWeight: '500',
    color: '#454545',
    fontStyle: 'italic',
    height: 15,
  },
  centeredView: {},

  modalView: {
    flex: 1,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    elevation: 5,
    flexDirection: 'column',
    top: 50,
  },

  modalHeader: {
    flexDirection: 'row',
    marginTop: 15,
  },

  modalText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
    color: '#454545',
    fontWeight: 'bold',
  },

  iconHeaderModal: {
    color: '#454545',
    top: -10,
  },

  modalOptions: {
    borderBottomColor: '#D6DBDF',
    borderBottomWidth: 1,
    marginHorizontal: 20,
  },

  itemOptions: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
    paddingTop: 10,
    marginBottom: 5,
    marginTop: 20,
  },

  txtItemModal: {
    color: '#454545',
    height: 20,
    fontWeight: '500',
  },

  iconItemModal: {
    color: '#454545',
    right: -5,
    height: 30,
  },

  viewChoseTime: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectTime: {
    marginHorizontal: 20,
    marginVertical: 20,
    backgroundColor: 'rgba(244, 246, 246, 0.9)',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  txtSelectTime: {
    fontSize: 28,
    color: '#454545',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  centeredViewTime: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },

  //modal nhập thời gian tưới

  modalViewTime: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    top: 50,
  },

  textInputTime: {
    borderColor: '#454545',
    borderBottomWidth: 1,
    fontSize: 16,
  },

  modalTextTime: {
    borderColor: '#454545',
    marginBottom: 5,
    fontSize: 18,
    fontWeight: 'bold',
  },

  //modal chọn ngày
  centeredViewChoseDay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalViewChoseDay: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    top: 50,
  },

  textStyle: {
    color: 'white',
    fontWeight: 'bold',
  },

  viewChoseDay: {
    flexDirection: 'row',
    borderBottomColor: '#D6DBDF',
    borderBottomWidth: 1,
    top: 10,
    marginVertical: 10,
  },

  modalTextSelectDay: {
    bottom: 10,
    fontWeight: 'bold',
    fontSize: 18,
  },

  txtDay: {
    marginBottom: 5,
    height: 20,
  },

  cbSelectDay: {
    marginBottom: 5,
    marginEnd: 10,
  },

  viewButton: {
    top: 20,
    flexDirection: 'row',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  viewText: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  txtCancel: {
    color: 'red',
    fontWeight: 'bold',
  },

  txtOK: {
    color: 'green',
    fontWeight: 'bold',
  },

  modeView: {
    marginVertical: 10,
    backgroundColor: 'rgba(244, 246, 246, 0.9)',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modeText: {
    marginVertical: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },

  modeIrr: {},

  viewLeft: {
    flexDirection: 'row',
  },

  inputIcon: {
    color: '#fff',
    marginLeft: 20,
    marginRight: 20,
  },
});
