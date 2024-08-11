class OverworldMap {
  constructor(config) {
    // give the constructor a config object to pass in the map and game objects
    // this is how all the maps can be different but the same class can be used
    // we will pass the game objects into the world
    this.gameObjects = config.gameObjects;

    // this is the lower and upper map that will be drawn - lower = floor, upper = treetops
    this.lowerImg = new Image();
    this.lowerImg.src = config.lowerSrc;
    this.upperImg = new Image();
    this.upperImg.src = config.upperSrc;

    // the map will be drawn into the canvas element - but must be drawn in the correct order
  }

  drawLowerImage(ctx) {
    // draw the lower image first
    ctx.drawImage(this.lowerImg, 0, 0);
  }
  drawUpperImage(ctx) {
    // draw the lower image first
    ctx.drawImage(this.upperImg, 0, 0);
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
