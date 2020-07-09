class APIWebSocketDevice {
  static idListener = 0;

  constructor() {
    this.listener = {};
  }

  connect() {
    this.ws = new WebSocket('ws://192.168.4.1');
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
    console.log('Client -> ServerDevice: Connected!');
  }

  onmessage = e => {
    Object.keys(this.listener).map(k => this.listener[k](e));
  };

  send(data) {
    this.ws.send(data);
  }
  receive(listen) {
    const id = APIWebSocketDevice.idListener++;
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
    // setTimeout(() => {
    //   this.connect();
    // }, 1000);
  }
}

const wssDevice = new APIWebSocketDevice();
export default wssDevice;
