class OverworldEvent {
  constructor({ map, event }) {
    this.map = map;
    this.event = event;
  }
  // OverworldEvent will have a number of methods that will be used to handle the different types of events
  // we will pass in the resolve function to each of these methods so that we can resolve the promise when the event is finished
  // the promise is being awaied in the doBehaviorEvent method in the GameObject class
  // the resolve function will tell the system that the event is finished and the next event can be started
  stand(resolve) {
    // this will tell us who is walking - ie npcA, or hero, etc
    const who = this.map.gameObjects[this.event.who];
    // startBehavior is a method of the Person class that will take a state and a behavior { type and direction }
    who.startBehavior(
      {
        map: this.map,
      },
      {
        type: "stand",
        direction: this.event.direction,
        time: this.event.time,
      }
    );

    const completeHandler = (event) => {
      if (event.detail.whoId === this.event.who) {
        document.removeEventListener("personStandingComplete", completeHandler);
        resolve();
      }
    };
    document.addEventListener("personStandingComplete", completeHandler);
  }

  walk(resolve) {
    // this will tell us who is walking - ie npcA, or hero, etc
    const who = this.map.gameObjects[this.event.who];
    // startBehavior is a method of the Person class that will take a state and a behavior { type and direction }
    who.startBehavior(
      {
        map: this.map,
      },
      {
        type: "walk",
        direction: this.event.direction,
        // if they hit a wall, they will retry the walk - in case it was created a player or npc and that wall is now gone
        // this walk event type is "consumed" in Person.js -> startBehavior - walk
        retry: true,
      }
    );

    // because events are scoped to the Id of the object, we need to make sure we are handling the correct event
    // thats why this cant be a simple event listener
    const completeHandler = (event) => {
      if (event.detail.whoId === this.event.who) {
        // to disconnect the event listener we need to reference it, and the function that is listening
        document.removeEventListener("personWalkingComplete", completeHandler);
        // resolve the promise
        resolve();
      }
    };

    // when the personWalkingComplete event is fired/started, we will call the completeHandler
    document.addEventListener("personWalkingComplete", completeHandler);
  }

  // creating a TextMessage event
  // takes in some text and a "thing" that should happen whenever we have seen the text
  textMessage(resolve) {
    // add a check to make sure the actor is facing the right direction to speak with the hero
    if (this.event.faceHero) {
      // get the object that is speaking
      const object = this.map.gameObjects[this.event.faceHero];
      // have them face the opposite direction of the hero (ie speak to the hero)
      object.direction = utils.oppositeDirection(
        this.map.gameObjects["hero"].direction
      );
    }

    const message = new TextMessage({
      text: this.event.text,
      onComplete: () => resolve(),
    });
    // This works with the init method below to create the element and append it to the game-container
    message.init(document.querySelector(".game-container"));
  }

  changeMap(resolve) {
    this.map.overworld.startMap(window.OverworldMaps[this.event.map]);
    resolve();
  }

  init() {
    // this will be the method that is called to start the event - kick off one of the instructional methods
    return new Promise((resolve) => {
      // the promise will have a resolve function that comes back with it
      // NOTE: this is a functional style of programming - it could also be done with a class based system and call this.resolve = resolve
      this[this.event.type](resolve);
    });
  }
}
