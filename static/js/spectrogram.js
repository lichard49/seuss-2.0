// full window app that renders a spectrogram
class SpectrogramApp extends App {
  constructor(canvas) {
    super(canvas);
  }

  // add a sample of data to the spectrogram image
  push(column_data, {flip=true, z_scale=1}={}) {
    // fit column size to height of screen
    column_data = this.interpolateArray(column_data, this.canvas.height);

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

  linearInterpolate(before, after, at_point) {
    return before + (after - before) * at_point;
  };

  interpolateArray(data, fit_count) {
    const new_data = new Array();
    const spring_factor = new Number((data.length - 1) / (fit_count - 1));
    new_data[0] = data[0]; // for new allocation
    for (let i = 1; i < fit_count - 1; i++) {
      const tmp = i * spring_factor;
      const before = new Number(Math.floor(tmp)).toFixed();
      const after = new Number(Math.ceil(tmp)).toFixed();
      const at_point = tmp - before;
      new_data[i] = this.linearInterpolate(data[before], data[after], at_point);
    }
    new_data[fit_count - 1] = data[data.length - 1]; // for new allocation
    return new_data;
  };
}
