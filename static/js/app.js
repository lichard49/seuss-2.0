class App {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');

    this.resize();
    window.addEventListener('resize', this.resize, false);
  }

  resize() {
    const w = document.body.offsetWidth;
    const h = document.body.offsetHeight;
    this.canvas.width  = w;
    this.canvas.height = h;
  }
}
