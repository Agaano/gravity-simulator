export default class pixel {
    constructor(x,y,speed, color) {
      this.x = x;
      this.y = y;
      this.speed = speed;
      this.color = color;
    }
  
    getPixel() {
      return {
        x: this.x,
        y: this.y,
        speed: this.speed,
        color: this.color,
      };
    }
  }