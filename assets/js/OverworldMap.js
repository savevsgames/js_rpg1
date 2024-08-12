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
        x: utils.withGrid(6),
        y: utils.withGrid(4),
      }),
      npc1: new Person({
        x: utils.withGrid(4),
        y: utils.withGrid(7),
        src: "/assets/images/characters/people/npc1.png",
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
