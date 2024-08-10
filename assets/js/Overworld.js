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
    // NOTE = The canvas HAS a context, and the ctx is the thing that allows us to draw the image into the canvas
    const image = new Image();
    image.onload = () => {
      // draw the image into the canvas context using the drawImage method
      this.ctx.drawImage(image, 0, 0);
    };
    image.src = "/assets/images/maps/DemoLower.png";
    console.log("Overworld initialized");

    // draw a shadow at the hero's feet
    const shadow = new Image();
    // copy the code from the image.onload function for hero
    shadow.onload = () => {
      this.ctx.drawImage(shadow, 0, 0, 32, 32, x * 16 - 8, y * 16 - 18, 32, 32);
    };
    shadow.src = "/assets/images/characters/shadow.png";

    // draw the hero
    let x = 1;
    let y = 4;
    const hero = new Image();
    hero.onload = () => {
      this.ctx.drawImage(
        hero,
        0, // top corner of the image cutout
        0, // left corner of the image cutout
        32, // width of the image cutout
        32, // height of the image cutout
        x * 16 - 8, // x position on the canvas - 16 is the width of the tile -then we "nudge" the hero to the left by 8 pixels
        y * 16 - 18, // y position on the canvas - 16 is the height of the tile -then we "nudge" the hero up by 18 pixels
        32, // width of the image on the canvas
        32 // height of the image on the canvas
      );
    };
    hero.src = "/assets/images/characters/people/hero.png";
  }
}
