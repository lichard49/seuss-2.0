// interface with microphone device
class Microphone {
  constructor(buffer_size) {
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    }).then((stream) => {
      this.handlePermissionSuccess(stream);
    });

    this.event_listeners = [];
    this.buffer_size = buffer_size;
  }

  // called when user gives permission to use the microphone
  handlePermissionSuccess(stream) {
    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);
    const processor = context.createScriptProcessor(this.buffer_size, 1, 1);

    source.connect(processor);
    processor.connect(context.destination);

    // emit events with raw audio data packets
    processor.addEventListener('audioprocess', (e) => {
      this.event_listeners.forEach(listener => {
        listener(e);
      });
    });
  };
}
