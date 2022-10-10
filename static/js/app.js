class App {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');

    this.resize();
    window.addEventListener('resize', () => {
      this.resize();
    }, false);

    this.createSettingsModal();
    this.canvas.addEventListener('click', () => {
      this.toggleSettingsModal();
    });
  }

  resize() {
    const w = document.body.offsetWidth;
    const h = document.body.offsetHeight;
    this.canvas.width  = w;
    this.canvas.height = h;
  }

  createSettingsModal() {
    this.div = document.createElement('div');
    this.div.id = 'settings_modal';
    this.div.hidden = true;
    this.div.textContent = 'Settings';
    document.body.appendChild(this.div);
  }

  toggleSettingsModal() {
    this.div.hidden = !this.div.hidden;
  }
}
