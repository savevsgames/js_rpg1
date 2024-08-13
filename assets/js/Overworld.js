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

      // if we want the camera to follow the hero, we can set the x and y of the camera to the hero's x and y
      // we will need to subtract half of the canvas width and height to center the hero and then subtract
      // the hero's position from the canvas and any other objects in the scene, allowing them to move relative to the hero
      const cameraPerson = this.map.gameObjects.hero;
      // update all objects in the game - can be a performance issue with a large game - this is our state update function
      Object.values(this.map.gameObjects).forEach((object) => {
        //  because the cameraPerson will be neeeded to center the hero, and every other object will move relative to the hero
        //  we will want to make sure the CameraPerson is passed in before we draw anything - this prevents jittering
        object.update({
          arrow: this.directionInput.direction,
          //  we have separated this Object values loop, to first be able to update the hero's position
          map: this.map,
        });
      });

      // start drawning the lower image of the map - passing this.ctx so it knows what to draw to
      this.map.drawLowerImage(this.ctx, cameraPerson);
      // draw the game objects on the map
      // we have an object (gameObjects) of objects within the map object
      // loop through the game objects and draw them to this canvas context
      // using Object.values we are taking the values of iteration and not the keys
      Object.values(this.map.gameObjects)
        .sort((a, b) => {
          // sort will return positive if the order is correct and negative if it is not - this will re-order the array
          // to place the lower y value objects at the front of the array - this will draw them first. Essentially this
          // draws the objects in a North to South order.
          return a.y - b.y;
        })
        .forEach((object) => {
          // we pass in the cameraPerson so we can place relative to the hero
          object.sprite.draw(this.ctx, cameraPerson);
        });

      // draw the upper image of the map - this will draw on top of the other game objects
      this.map.drawUpperImage(this.ctx, cameraPerson);

      // we want this to call every frame, so we will use requestAnimationFrame to call the function recursively
      //  it is a built-in function that will call the function every frame
      requestAnimationFrame(() => {
        // we will ignore the possible timing issues with step not finishing before being called again and assume it will be fine
        // we can create a time stamp to check the time between frames and ensure the game runs at the same speed
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
    this.map = new OverworldMap(window.OverworldMaps.DemoRoom);
    // mount the objects to the map - in OverworldMap.js
    this.map.mountObjects();

    // create a new instancee of direction input to handle user input - and initialize it
    this.directionInput = new DirectionInput();
    this.directionInput.init();
    this.directionInput.direction;
    // console.log(this.directionInput.direction);

    // START THE GAME LOOP
    this.startGameLoop();
  }
}
