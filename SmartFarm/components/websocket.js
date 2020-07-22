class APIWebSocket {
  static idListener = 0;

  constructor() {
    this.listener = {};
  }

  connect() {
    this.ws = new WebSocket('ws://45.124.87.133/api/ws');
    //this.ws = new WebSocket('ws://192.168.1.3/api/ws');
    this.ws.onopen = this.onopen.bind(this);
    this.ws.onmessage = this.onmessage.bind(this);
    this.ws.onerror = this.onerror.bind(this);
    this.ws.onclose = this.onclose.bind(this);
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
    console.log(e);
  }

  onclose(e) {
    console.log(e);
    setTimeout(() => {
      this.connect();
    }, 1000);
  }
}

const wss = new APIWebSocket();
export default wss;
