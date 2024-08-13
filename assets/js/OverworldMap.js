class OverworldMap {
  constructor(config) {
    // give the constructor a config object to pass in the map and game objects
    // this is how all the maps can be different but the same class can be used
    // we will pass the game objects into the world
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};

    // this is the lower and upper map that will be drawn - lower = floor, upper = treetops
    this.lowerImg = new Image();
    this.lowerImg.src = config.lowerSrc;
    this.upperImg = new Image();
    this.upperImg.src = config.upperSrc;

    this.isCutscenePlaying = false;

    // the map will be drawn into the canvas element - but must be drawn in the correct order
  }

  drawLowerImage(ctx, cameraPerson) {
    // draw the lower image first

    ctx.drawImage(
      this.lowerImg,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    );
  }
  drawUpperImage(ctx, cameraPerson) {
    // draw the lower image first
    ctx.drawImage(
      this.upperImg,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    );
  }

  // check if the space is taken by a wall before being allowed to move
  // take current x and y coordinates and the direction of the object's movement
  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);
    // if there is a wall at the next position, return true
    return this.walls[`${x}, ${y}`] || false;
  }

  // mount objects is a method that will mount the game objects to the map
  // this will be called when the map "starts"
  mountObjects() {
    // loop through the game objects values (not values anymore, because we want to also know their id's) and mount them to the map
    Object.keys(this.gameObjects).forEach((key) => {
      // get the object from the gameObjects object associated with that instance of the key
      let object = this.gameObjects[key];
      // set the object's id to the key - rather than needing an id parameter in the object when we create a gameObjects object
      // ie. hero: new Person({ id: "hero" }) - we can just set the id to the key
      object.id = key;
      // TODO: determine if the object should be mounted
      // object.mount to this which is the map in this case
      object.mount(this);
    });
  }

  // startCutscene is a method that will be called when a cutscene is triggered - it will take an array of events
  // it will be an async function
  async startCutscene(events) {
    // set the cutscene flag to true
    this.isCutscenePlaying = true;

    // START A LOOP OF ASYNC EVENTS and AWAIT each one
    for (let i = 0; i < events.length; i++) {
      // get the event from the events array and create a "handler" - a new instance of the OverworldEvent class
      // pass in a map and the event from the events array
      const eventHandler = new OverworldEvent({ map: this, event: events[i] });
      // this is where we will await the event to finish before moving on to the next event
      await eventHandler.init();
      // this means the loop will have to wait for each event to finish before moving on to the next one!!!!
      // this is how we can create a cutscene that plays out one event at a time
    }

    // when the scene is over - set the cutscene flag to false
    this.isCutscenePlaying = false;

    // reset the behavior loop index for all objects
    Object.values(this.gameObjects).forEach((object) => {
      // the behaviorEvent method needs the map passed in for each object
      object.doBehaviorEvent(this);
    });
  }

  // functions to add and remove walls
  // if no wall exists at that position, add it to the object (this.walls)
  addWall(x, y) {
    this.walls[`${x}, ${y}`] = true;
  }
  // if a wall exists at that position, remove it from the object (this.walls)
  removeWall(x, y) {
    delete this.walls[`${x}, ${y}`];
  }
  // when a wall needs to be moved, remove the wall and add it to the new position using the utility function
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    // get the new x and y coordinates using the utility function we created for moving characters
    const { x, y } = utils.nextPosition(wasX, wasY, direction);
    // add a wall at the new position determined by the direction
    this.addWall(x, y);
  }
}

// this is the configuration for the class instance we are using currently - DemoRoom
window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: "/assets/images/maps/DemoLower.png",
    upperSrc: "/assets/images/maps/DemoUpper.png",
    gameObjects: {
      // default src is hero's image source
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(1),
        y: utils.withGrid(10),
      }),
      npcA: new Person({
        x: utils.withGrid(10),
        y: utils.withGrid(10),
        src: "/assets/images/characters/people/npc1.png",
        // idle behavior loop
        behaviorLoop: [
          { type: "walk", direction: "left" },
          { type: "stand", direction: "up", time: 1000 },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "down", time: 1000 },
          { type: "walk", direction: "down" },
        ],
      }),
      npcB: new Person({
        x: utils.withGrid(2),
        y: utils.withGrid(6),
        src: "/assets/images/characters/people/npc2.png",
        behaviorLoop: [
          { type: "stand", direction: "down", time: 1000 },
          { type: "stand", direction: "left", time: 1000 },
          { type: "stand", direction: "up", time: 1000 },
          { type: "stand", direction: "right", time: 1000 },
        ],
      }),
    },
    walls: {
      // "16, 16": true, - we want to dynamically code this with a utility function - [dynamic key]: true
      // the utility expression in the array will return a string that will be used as the key
      // each key will represent x and y coordinates of one point of a wall
      [utils.asGridCoord(7, 6)]: true,
      [utils.asGridCoord(8, 6)]: true,
      [utils.asGridCoord(7, 7)]: true,
      [utils.asGridCoord(8, 7)]: true,
    },
  },
  Kitchen: {
    lowerSrc: "/assets/images/maps/KitchenLower.png",
    upperSrc: "/assets/images/maps/KitchenUpper.png",
    gameObjects: {
      // default src is hero's image source
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(6),
        y: utils.withGrid(4),
      }),
      npcA: new Person({
        x: utils.withGrid(4),
        y: utils.withGrid(7),
        src: "/assets/images/characters/people/npc1.png",
      }),
      npcB: new Person({
        x: utils.withGrid(10),
        y: utils.withGrid(6),
        src: "/assets/images/characters/people/npc2.png",
      }),
    },
  },
};
