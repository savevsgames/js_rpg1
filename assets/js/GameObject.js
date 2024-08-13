class GameObject {
  // we create the game object with a config parameter that will let us change the parameters of the object as needed
  //   Game Object can also be extended to include extra functionality for player movement, etc - this is for drawing a basic object
  constructor(config) {
    // we need a way to identify the objeccts we create so we will give them an id
    this.id = null;
    // we will need to know if the object is mounted or not
    this.isMounted = false;
    // config can pass in a position for the object, if not, it will default to 0,0
    this.x = config.x || 0;
    this.y = config.y || 0;
    // direction will be represented as a string - up, down, left, right
    this.direction = config.direction || "down";
    // create the concept of a sprite for the object
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || "/assets/images/characters/people/hero.png",
    });

    // we need to recieve the behaviorLoop data from the config of a game object in OverworldMap.js
    this.behaviorLoop = config.behaviorLoop || [];
    this.behaviorLoopIndex = 0;
  }
  mount(map) {
    console.log("mounting object");
    this.isMounted = true;
    map.addWall(this.x, this.y);

    //  if we have a behavior loop, we will start the behavior loop after a short delay to make sure the world is finished loading
    setTimeout(() => {
      // pass in the map state to the behavior loop
      this.doBehaviorEvent(map);
      // 10 ms delay to start the behavior loop
    }, 10);
  }

  // update() {
  // // this will be used to update the object's state
  // };

  // this function will take in the map and the behaviorLoop and use the index of the behaviorLoop to determine the behavior
  async doBehaviorEvent(map) {
    if (map.isCutscenePlaying || this.behaviorLoop.length === 0) {
      // if a cutscene is playing, or theobject does not have a behavior event, then we will return
      // isCutscenePlaying is a property defined in the OverworldMap class
      return;
    }

    // this is where we will execute the "behaviors" listed in the behaviorLoop, one by one
    // in this method the first thing we need to do is identify the event we should be working on right now
    // this will pull the event from the behaviorLoop array and position behaviorLoopIndex
    let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
    // WHO is the object doing the behaviorLoop? we dont get the id from the behaviorLoop array, so we need to check the object
    eventConfig.who = this.id;

    // we are going to create a new instance of an OVeRWORLD event config - the eventConfig will be passed in along with the map

    // The OverworldEvent class will be responsible for handling all types of events that can happen in the overworld
    // messages, battles, etc - in addition to the movement events
    const eventHandler = new OverworldEvent({ map, event: eventConfig });
    // we want this to finish before calling the next event so we will await the init method
    await eventHandler.init();
    // after the event is finished, we will increment the behaviorLoopIndex
    this.behaviorLoopIndex++;
    // if the behaviorLoopIndex is greater than the length of the behaviorLoop, we will reset the index to 0
    if (this.behaviorLoopIndex === this.behaviorLoop.length) {
      this.behaviorLoopIndex = 0;
    }
    // after the event is finished, we will call the next event - effectively creating a loop, but with a delay
    this.doBehaviorEvent(map);
  }
}
