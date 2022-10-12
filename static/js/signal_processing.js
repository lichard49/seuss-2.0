// data structure that accepts data and emits it in windows of a given size
class SlidingWindow {
  constructor(window_size, slide_by) {
    this.queue = [];
    this.window_size = window_size;
    this.slide_by = slide_by;
    this.event_listeners = [];
  }

  // put a sample of data into the sliding window
  push(data) {
    this.queue.push(data);

    // if a window is full
    if (this.queue.length >= this.window_size) {
      // fire event listeners
      const queue_copy = [...this.queue];
      this.event_listeners.forEach(listener => {
        listener(queue_copy);
      });

      // slide window
      this.queue.splice(0, this.slide_by);
    }
  }
}

// operator to perform an FFT
class Fft {
  constructor(buffer_size) {
    this.audio_block_size = buffer_size;
    this.bytes_per_element = 4;

    this.initialized = false;
    this.stft_magnitudes = new Array();
    this.event_listeners = [];

    // load the PFFFT module
    pffft_simd().then(async (Module) => {
      this.Module = Module;
      this.pffft_runner = Module._pffft_runner_new(this.audio_block_size,
         this.bytes_per_element);

      this.n_data_bytes = this.audio_block_size * this.bytes_per_element;
      this.data_pointer = Module._malloc(this.n_data_bytes);
      this.data_heap = new Uint8Array(Module.HEAPU8.buffer, this.data_pointer,
          this.n_data_bytes);

      this.initialized = true;
    });
  }

  // perform FFT on a signal window
  getFrequencies(signal) {
    if (!this.initialized) {
      return null;
    }

    // prepare input signal in FFT format and run FFT
    this.data_heap.set(new Uint8Array(signal.buffer));
    this.Module._pffft_runner_transform(this.pffft_runner,
        this.data_heap.byteOffset);

    const fft_result = new Float32Array(this.data_heap.buffer,
        this.data_heap.byteOffset, signal.length);

    //calculate magnitudes and accumulate results
    const magnitudes = new Array(this.audio_block_size / 2);
    for (let i = 0; i < this.audio_block_size; i += 2) {
      magnitudes[Math.floor(i / 2)] = fft_result[i] * fft_result[i] +
          fft_result[i + 1] * fft_result[i + 1];
    }

    this.event_listeners.forEach(listener => {
      listener(magnitudes);
    });
  }
}
