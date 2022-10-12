// full window app that renders a spectrogram
class SpectrogramApp extends App {
  constructor(canvas) {
    super(canvas);
  }

  // add a sample of data to the spectrogram image
  push(column_data, {flip=true, z_scale=1}={}) {
    // create a new column of the image
    const column_image = this.context.createImageData(1, column_data.length);

    // populate image column with pixel values
    for (let i = 0; i < column_data.length; i++) {
      const flip_i = flip ? column_data.length - i : i;
      const value = column_data[flip_i];
      const clamped_value = Math.min(255, value * z_scale);

      column_image.data[i * 4 + 0] = clamped_value;
      column_image.data[i * 4 + 1] = clamped_value;
      column_image.data[i * 4 + 2] = clamped_value;
      column_image.data[i * 4 + 3] = 255;
    }

    // slide existing image
    const prev_image_data = this.context.getImageData(1, 0,
        this.canvas.width - 1, this.canvas.height);
    this.context.putImageData(prev_image_data, 0, 0);

    // render new column
    app.context.putImageData(column_image, this.canvas.width - 1, 0);
  }
}
