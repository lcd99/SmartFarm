import {Alert} from 'react-native';
class APIWebSocket {
  static idListener = 0;

  constructor() {
    this.listener = {};
  }

  connect() {
    try {
      this.ws = new WebSocket('ws://45.124.87.133/api/ws');
      //this.ws = new WebSocket('ws://192.168.1.23/api/ws');
      this.ws.onopen = this.onopen.bind(this);
      this.ws.onmessage = this.onmessage.bind(this);
      this.ws.onerror = this.onerror.bind(this);
      this.ws.onclose = this.onclose.bind(this);
    } catch (error) {
      console.log('Error websocket: ' + error);
      //this.setState({spinner: !this.state.spinner});
      // Alert.alert('Thông báo', 'Vui lòng kiểm tra lại internet', [
      //   {
      //     text: 'OK',
      //     onPress: () => null,
      //     style: 'cancel',
      //   },
      // ]);
    }
  }

  close() {
    if (!this.ws) {
      return;
    }
    this.ws.close();
  }

  onopen() {
    console.log('Client -> ServerApp: Connected!');
  }
  /// onmessage là khi nhan tin nhắn từ server => client, send là từ client => server, kết nối giữ xuyên xuot đến tắt app

  onmessage = e => {
    // console.log(e);
    // json = JSON.parse(e.data);
    // console.log('Server send client: ', json );
    Object.keys(this.listener).map(k => this.listener[k](e));
  };

  send(data) {
    // if (!this.ws) {
    //   return;
    // }
    this.ws.send(data);
  }
  receive(listen) {
    const id = APIWebSocket.idListener++;
    this.listener[id] = listen;
    return () => {
      delete this.listener[id];
    };
  }

  onerror(e) {
    console.log('onerror: ' + e.message);
    // Alert.alert('Thông báo', 'Không thể kết nối đến server', [
    //   {
    //     text: 'Đồng ý',
    //     onPress: () => null,
    //     style: 'cancel',
    //   },
    // ]);
  }

  onclose(e) {
    console.log('onclose: ' + e.message);
    this.connect();
    //setTimeout(this.connect(), 1000);
  }
}

const wss = new APIWebSocket();
export default wss;
