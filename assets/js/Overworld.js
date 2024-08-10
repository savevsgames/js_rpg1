// This will be a class that will be used to create the overworld map and extend
// its functionality including states and events.  It will draw image data into the canvas
// element.
class Overworld {
  constructor(config) {
    // pass in an element for the overworld to operate in
    this.element = config.element;
    // get the canvas element from the overworld element
    this.canvas = this.element.querySelector(".game-canvas");
    // get the canvas context to get access to the drawing API - we will be referencing
    //  this.ctx regularly so we will store it in a variable
    this.ctx = this.canvas.getContext("2d");
  }

  init() {
    // canvas in HTML needs to have images loaded into the browser memory before we can draw them into the canvas context
    const image = new Image();
    image.onload = () => {
      // draw the image into the canvas context using the drawImage method
      this.ctx.drawImage(image, 0, 0);
    };
    image.src = "/assets/images/maps/DemoLower.png";
  }
}
