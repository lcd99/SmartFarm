import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ContentThatGoesAboveTheFlatList,
  ContentThatGoesBelowTheFlatList,
  FlatList,
} from 'react-native';

import {Container, Header, Content, DatePicker, Icon, Left} from 'native-base';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import websocket from './websocket.js';
import LinearGradient from 'react-native-linear-gradient';


export default class HistorySchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenDate: moment(new Date()).format('YYYY-MM-DD'),
      isPickerVisible: false,

      pass: this.props.route.params.pass,
      username: this.props.route.params.username,
      nameDevice: this.props.route.params.nameDevice,

      dataHistoryBalcony: new Array(),
    };
  }

  // setDate(newDate) {
  //   this.setState({chosenDate: newDate});
  // }

  handleConfirm = DateTime => {
    this.setState({
      isPickerVisible: false,
      chosenDate: moment(DateTime).format('YYYY-MM-DD'),
    });

    this.setDataSchedule();
  };

  hidePicker = () => {
    this.setState({
      isPickerVisible: false,
    });
  };

  showPicker = () => {
    this.setState({isPickerVisible: true});
  };

  loadDays = day => {
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

  renderItem = ({item, index}) => (
    <View style={styles.contentHistory}>
      <Text style={styles.txtTime}>{item.time}</Text>
      <Text style={styles.txtMode}>
        {item.mode == '1'
          ? 'Thời gian tưới: ' + item.irrigation_time + ' phút'
          : 'Lưu lượng tưới: ' + item.irrigation_flow + ' lít'}
      </Text>
      <Text style={styles.txtDayRepeat}>
        Ngày tưới: {this.loadDays(item.day)}
      </Text>
    </View>
  );

  setDataSchedule = () => {
    try {
      var getHistoryBalcony = {
        action: 'historyBalcony',
        data: {
          username: this.state.username,
          nameDevice: this.state.nameDevice,
          changeDate: this.state.chosenDate,
        },
      };
      websocket.send(JSON.stringify(getHistoryBalcony));
      this.unReceive = websocket.receive(e => {
        //console.log(e);
        const data = JSON.parse(e.data);

        //console.log(data);
        if (data.action == 'historyBalcony') {
          const dtHistoryBalcony = JSON.parse(data.message);

          //console.log(dtHistoryBalcony);
          this.setState({dataHistoryBalcony: dtHistoryBalcony});
        }

        // this.setState({
        //   dataHistoryBalcony: data,
        //   ...this.state.dataHistoryBalcony,
        // });

        //this.setState({dataHistoryBalcony: data.message});
      });
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    try {
      var getHistoryBalcony = {
        action: 'historyBalcony',
        data: {
          username: this.state.username,
          nameDevice: this.state.nameDevice,
          changeDate: this.state.chosenDate,
        },
      };

      //console.log(JSON.stringify(getHistoryBalcony));

      websocket.send(JSON.stringify(getHistoryBalcony));

      this.unReceive = websocket.receive(e => {
        const data = JSON.parse(e.data);

        //console.log(data);
        //this.setState({spinner: !this.state.spinner});

        if (data.action == 'historyBalcony') {
          const dtHistoryBalcony = JSON.parse(data.message);

          //console.log(dtHistoryBalcony);
          this.setState({dataHistoryBalcony: dtHistoryBalcony});
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
            <TouchableOpacity onPress={this.showPicker}>
              <LinearGradient
                colors={['#099773', '#43b692']}
                style={styles.linearGradient}>
                <View style={styles.viewDays}>
                  <Left>
                    <Icon
                      type="Ionicons"
                      name="today"
                      style={{color: '#EBF2EA'}}
                    />
                  </Left>
                  <Text style={styles.txtDays}>{this.state.chosenDate}</Text>
                  <DateTimePickerModal
                    isVisible={this.state.isPickerVisible}
                    onConfirm={this.handleConfirm}
                    onCancel={this.hidePicker}
                    is24Hour={true}
                    mode={'date'}
                  />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <SafeAreaView style={styles.container}>
            <View style={styles.history}>
              <FlatList
                data={this.state.dataHistoryBalcony}
                keyExtractor={item => item.Id}
                renderItem={this.renderItem}
                //refreshing={this.state.refreshData}
                ListHeaderComponent={ContentThatGoesAboveTheFlatList}
                ListFooterComponent={ContentThatGoesBelowTheFlatList}
                // onRefresh={this.handleRefresh}
              />
            </View>
          </SafeAreaView>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  linearGradient: {
    flex: 1,
    paddingVertical: 10,
    margin: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
  },

  viewDays: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    
  },

  txtDays: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#EBF2EA',
  },

  history: {
    flex: 1,
  },

  contentHistory: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 10,
    color: '#EBF2EA',
    flexDirection: 'column',
    marginVertical: 5,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  txtTime: {
    fontSize: 20,
    fontWeight: '500',
  },

  txtMode: {
    fontSize: 13,
    fontWeight: '500',
    fontStyle: 'italic',
    height: 18,
  },

  txtDayRepeat: {
    fontSize: 13,
    fontWeight: '500',
    fontStyle: 'italic',
    height: 18,
  },
});
