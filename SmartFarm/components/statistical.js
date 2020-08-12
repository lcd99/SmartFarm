import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import {
  Container,
  Header,
  Content,
  DatePicker,
  Icon,
  Form,
  Picker,
} from 'native-base';

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';

import websocket from './websocket.js';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import LinearGradient from 'react-native-linear-gradient';

export default class Statistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,

      selected: '24h',

      name: this.props.route.params.name,
      username: this.props.route.params.username,
      pass: this.props.route.params.pass,
      nameDevice: this.props.route.params.nameDevice,

      dataStatistics: new Array(),

      totalFlow: '',
      labelsFlow: new Array(),
      dtFlow: new Array(),

      totalTime: '',
      labelsTime: new Array(),
      dtTime: new Array(),
    };
  }

  onValueChange(value) {
    this.setState({
      selected: value,
    });

    if (value == '24h') {
      var action = {
        action: '24h',
        data: {
          nameDevice: this.state.nameDevice,
          options: value,
        },
      };
    } else if (
      value == 'm1' ||
      value == 'm2' ||
      value == 'm3' ||
      value == 'm4' ||
      value == 'm5' ||
      value == 'm6' ||
      value == 'm7'
    ) {
      var action = {
        action: 'statisticalByMonth',
        data: {
          nameDevice: this.state.nameDevice,
          options: value,
        },
      };
    } else if (value == '365d' || value == 'fulltime' || value == '90d') {
      var action = {
        action: 'statisticalByYear',
        data: {
          nameDevice: this.state.nameDevice,
          options: value,
        },
      };
    } else {
      var action = {
        action: 'statisticalByDate',
        data: {
          nameDevice: this.state.nameDevice,
          options: value,
        },
      };
    }

    //console.log(action);
    //this.setState({spinner: !this.state.spinner});

    websocket.send(JSON.stringify(action));
  }

  componentDidMount() {
    try {
      //this.setState({spinner: !this.state.spinner});
      var action24h = {
        action: '24h',
        data: {
          nameDevice: this.state.nameDevice,
        },
      };
      websocket.send(JSON.stringify(action24h));

      this.unReceive = websocket.receive(e => {
        const data = JSON.parse(e.data);

        //console.log(data);

        if (data.action == '24h') {
          const dtStatistics = JSON.parse(data.message);

          var totalFlow = 0;
          var labelsFlow = new Array();
          var dtFlow = new Array();

          var totalTime = 0;
          var labelsTime = new Array();
          var dtTime = new Array();

          for (var i = 0; i < dtStatistics.length; i++) {
            if (dtStatistics[i].mode == 2) {
              totalFlow += dtStatistics[i].irrigation_flow;
              labelsFlow.push(dtStatistics[i].time);
              dtFlow.push(dtStatistics[i].irrigation_flow.toString());
            } else {
              totalTime += dtStatistics[i].irrigation_time;
              labelsTime.push(dtStatistics[i].time);
              dtTime.push(dtStatistics[i].irrigation_time);
            }
          }

          this.setState({
            totalFlow: totalFlow,
            labelsFlow: labelsFlow,
            dtFlow: dtFlow,

            totalTime: totalTime,
            labelsTime: labelsTime,
            dtTime: dtTime,
          });

          //this.setState({spinner: !this.state.spinner});
        } else if (data.action == 'statisticalByDate') {
          const dtStatisticsByDate = JSON.parse(data.message);

          //console.log(dtStatisticsByDate);
          var totalFlow = 0;
          var labelsFlow = new Array();
          var dtFlow = new Array();

          var totalTime = 0;
          var labelsTime = new Array();
          var dtTime = new Array();

          for (var i = 0; i < dtStatisticsByDate.length; i++) {
            if (dtStatisticsByDate[i].mode == 2) {
              totalFlow += dtStatisticsByDate[i].sumIrrFlow;
              labelsFlow.push(
                moment(dtStatisticsByDate[i].ChangeDate).format('DD'),
              );

              dtFlow.push(dtStatisticsByDate[i].sumIrrFlow.toString());
            } else {
              totalTime += dtStatisticsByDate[i].sumIrrTime;

              labelsTime.push(
                moment(dtStatisticsByDate[i].ChangeDate).format('DD'),
              );

              dtTime.push(dtStatisticsByDate[i].sumIrrTime.toString());
            }
          }

          this.setState({
            totalFlow: totalFlow,
            labelsFlow: labelsFlow,
            dtFlow: dtFlow,

            totalTime: totalTime,
            labelsTime: labelsTime,
            dtTime: dtTime,
          });
          //this.setState({spinner: !this.state.spinner});
        } else if (data.action == 'statisticalByMonth') {
          const dtStatisticsByDate = JSON.parse(data.message);

          //console.log(dtStatisticsByDate);
          var totalFlow = 0;
          var labelsFlow = new Array();
          var dtFlow = new Array();

          var totalTime = 0;
          var labelsTime = new Array();
          var dtTime = new Array();

          for (var i = 0; i < dtStatisticsByDate.length; i++) {
            if (dtStatisticsByDate[i].mode == 2) {
              totalFlow += dtStatisticsByDate[i].sumIrrFlow;
              labelsFlow.push(
                moment(dtStatisticsByDate[i].ChangeDate).format('DD'),
              );

              dtFlow.push(dtStatisticsByDate[i].sumIrrFlow.toString());
            } else {
              totalTime += dtStatisticsByDate[i].sumIrrTime;
              labelsTime.push(
                moment(dtStatisticsByDate[i].ChangeDate).format('DD'),
              );

              dtTime.push(dtStatisticsByDate[i].sumIrrTime.toString());
            }
          }

          this.setState({
            totalFlow: totalFlow,
            labelsFlow: labelsFlow,
            dtFlow: dtFlow,

            totalTime: totalTime,
            labelsTime: labelsTime,
            dtTime: dtTime,
          });
          //this.setState({spinner: !this.state.spinner});
        } else if (data.action == 'statisticalByYear') {
          const dtStatisticsByDate = JSON.parse(data.message);

          //console.log(dtStatisticsByDate);
          var totalFlow = 0;
          var labelsFlow = new Array();
          var dtFlow = new Array();

          var totalTime = 0;
          var labelsTime = new Array();
          var dtTime = new Array();

          for (var i = 0; i < dtStatisticsByDate.length; i++) {
            if (dtStatisticsByDate[i].mode == 2) {
              totalFlow += dtStatisticsByDate[i].sumIrrFlow;
              labelsFlow.push(dtStatisticsByDate[i].month.toString());
              dtFlow.push(dtStatisticsByDate[i].sumIrrFlow.toString());
            } else {
              totalTime += dtStatisticsByDate[i].sumIrrTime;
              labelsTime.push(dtStatisticsByDate[i].month.toString());
              dtTime.push(dtStatisticsByDate[i].sumIrrTime.toString());
            }
          }

          this.setState({
            totalFlow: totalFlow,
            labelsFlow: labelsFlow,
            dtFlow: dtFlow,

            totalTime: totalTime,
            labelsTime: labelsTime,
            dtTime: dtTime,
          });
          //this.setState({spinner: !this.state.spinner});
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const d = new Date();
    const n = d.getMonth() + 1;

    const chartConfigFlow = {
      backgroundGradientFrom: '#099773',
      backgroundGradientFromOpacity: 1,
      backgroundGradientTo: '#43b692',
      backgroundGradientToOpacity: 0.5,
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      //color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
      strokeWidth: 2, // optional, default 3
      barPercentage: 0.5,
      useShadowColorFromDataset: false, // optional
      propsForDots: {
        r: '6',
        strokeWidth: '2',
        stroke: '#ffa726',
      },
    };

    const chartConfigTime = {
      backgroundGradientFrom: '#099773',
      backgroundGradientFromOpacity: 1,
      backgroundGradientTo: '#43b692',
      backgroundGradientToOpacity: 0.5,
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      strokeWidth: 2, // optional, default 3
      barPercentage: 0.5,
      useShadowColorFromDataset: false, // optional
      propsForDots: {
        r: '6',
        strokeWidth: 2,
        stroke: '#ffa726',
      },
    };

    const dataTime = {
      labels: this.state.labelsTime,
      datasets: [
        {
          data: this.state.dtTime,
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
          strokeWidth: 2, // optional
        },
      ],
      legend: ['Tưới theo thời gian (phút)'], // optional
    };

    const dataFlow = {
      labels: this.state.labelsFlow,
      datasets: [
        {
          data: this.state.dtFlow,
        },
      ],
      //legend: ['Tưới theo thời gian'],
    };

    // console.log('TIME:  ', this.state.labelsTime);
    // console.log('FLOW:  ', this.state.labelsFlow);
    return (
      <Container>
        <Spinner visible={this.state.spinner} textContent={'Loading...'} />
        <Content>
          <View style={styles.container}>
            <LinearGradient
              colors={['#099773', '#43b692']}
              style={styles.linearGradient}>
              <View style={styles.viewStatistics}>
                <Form>
                  <Picker
                    //mode="dropdown"
                    //iosHeader="Select your SIM"
                    iosIcon={<Icon name="arrow-down" />}
                    //style={styles.optionsStatistics}
                    selectedValue={this.state.selected}
                    onValueChange={this.onValueChange.bind(this)}>
                    <Picker.Item label="24 giờ qua" value="24h" />
                    <Picker.Item label="7 ngày qua" value="7d" />
                    <Picker.Item label="28 ngày (4 tuần) qua" value="28d" />
                    <Picker.Item label="90 ngày qua" value="90d" />
                    <Picker.Item label="365 ngày qua" value="365d" />
                    <Picker.Item label="Toàn thời gian" value="fulltime" />
                    <Picker.Item label={'Tháng ' + (n - 1)} value="m1" />
                    <Picker.Item label={'Tháng ' + (n - 2)} value="m2" />
                    <Picker.Item label={'Tháng ' + (n - 3)} value="m3" />
                    <Picker.Item label={'Tháng ' + (n - 4)} value="m4" />
                    <Picker.Item label={'Tháng ' + (n - 5)} value="m5" />
                    <Picker.Item label={'Tháng ' + (n - 6)} value="m6" />
                    <Picker.Item label={'Tháng ' + (n - 7)} value="m7" />
                  </Picker>
                </Form>
              </View>
            </LinearGradient>
            <View style={styles.contentOptions}>
              <LinearGradient
                colors={['#099773', '#43b692']}
                style={styles.linearGradientOptions}>
                <View style={styles.options}>
                  <Icon
                    type="MaterialCommunityIcons"
                    name="water-pump"
                    style={{color: '#000'}}
                  />
                  <Text style={styles.txtOptions}>Tổng lưu lượng tưới</Text>
                  <Text style={styles.txtTotal}>
                    {this.state.totalFlow} lít
                  </Text>
                </View>
              </LinearGradient>
              <LinearGradient
                colors={['#099773', '#43b692']}
                style={styles.linearGradientOptions}>
                <View style={styles.options}>
                  <Icon
                    type="MaterialCommunityIcons"
                    name="camera-timer"
                    style={{color: '#000'}}
                  />
                  <Text style={styles.txtOptions}>Tổng thời gian tưới</Text>
                  <Text style={styles.txtTotal}>
                    {this.state.totalTime} giờ
                  </Text>
                </View>
              </LinearGradient>
            </View>
            {this.state.dtFlow.length > 0 && (
              <View style={styles.chartFlow}>
                <Text style={styles.txtTitle}>
                  Thống kê tưới theo lưu lượng
                </Text>
                <BarChart
                  data={dataFlow}
                  width={windowWidth - 20} // from react-native
                  height={220}
                  //yAxisLabel="$"
                  yAxisSuffix="l"
                  yAxisInterval={-1} // optional, defaults to 1
                  chartConfig={chartConfigFlow}
                  bezier
                  fromZero={true}
                  style={{
                    borderRadius: 10,
                    marginLeft: 10,
                  }}
                  verticalLabelRotation={0}
                />
              </View>
            )}

            {this.state.dtTime.length > 0 && (
              <View style={styles.chartTime}>
                <Text style={styles.txtTitle}>
                  Thống kê tưới theo thời gian
                </Text>
                <LineChart
                  data={dataTime}
                  width={windowWidth - 20}
                  height={220}
                  yAxisSuffix="p"
                  chartConfig={chartConfigTime}
                  style={{
                    borderRadius: 10,
                    marginLeft: 10,
                  }}
                  verticalLabelRotation={0}
                  bezier
                  fromZero={true}
                />
              </View>
            )}
          </View>
        </Content>
      </Container>
    );
  }
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: 'Montserrat',
  },

  contentOptions: {
    flex: 1,
    flexDirection: 'row',
    // justifyContent: 'space-between',
  },

  linearGradientOptions: {
    padding: 10,
    backgroundColor: 'transparent',
    //backgroundColor: 'rgba(134, 65, 244,1)',
    borderRadius: 10,
    marginTop: 10,
    marginLeft: 10,
    width: (windowWidth - 30) / 2,
    height: 100,
  },

  options: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  txtOptions: {
    marginTop: 10,
    textAlign: 'center',
  },

  linearGradient: {
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },

  viewStatistics: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  chartTime: {
    marginBottom: 10,
  },

  chartFlow: {
    marginVertical: 10,
  },

  txtTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },

  txtTotal: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  optionsStatistics: {},
});
