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
    // give the Overworld a map parameter to store the map
    this.map = null;
  }

  // this will be the main game loop that will run the game
  startGameLoop() {
    // step is the function that will be called recursively to run the game
    const step = () => {
      // clear the canvas before drawing the next frame
      // use the clearRect method to clear the canvas with an x, y, (top-left) width, height (screen size) to clear it all
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // start drawning the lower image of the map - passing this.ctx so it knows what to draw to
      this.map.drawLowerImage(this.ctx);

      // draw the game objects on the map
      // we have an object (gameObjects) of objects within the map object
      // loop through the game objects and draw them to this canvas context
      // using Object.values we are taking the values of iteration and not the keys
      Object.values(this.map.gameObjects).forEach((object) => {
        // object.x += 0.01;
        // this above line will move the objects all to the right as the game loop runs
        object.sprite.draw(this.ctx);
      });
      // draw the upper image of the map - this will draw on top of the other game objects
      this.map.drawUpperImage(this.ctx);

      // we want this to call every frame, so we will use requestAnimationFrame to call the function recursively
      //  it is a built-in function that will call the function every frame
      requestAnimationFrame(() => {
        // call the step function recursively
        step();
      });
    };
    // call the step function ONCE to start the game loop - allowing step to be called by requestAnimationFrame recursively
    step();
  }

  init() {
    // Now we need to tell the overworld which map to load
    // create a new instance of the OverworldMap class and pass in the config data from the DemoRoom map
    this.map = new OverworldMap(window.OverworldMaps.Kitchen);

    // START THE GAME LOOP
    this.startGameLoop();
  }
}
