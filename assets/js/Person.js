// Person is specifically for people in the game canvas - other objects can use
// GameObject for their base class

class Person extends GameObject {
  constructor(config) {
    // give this an instance of the GameObject class to inherit its properties with the super keyword
    super(config);
    // create a movingProgress property to track the progress of the movement
    // with grid based movement, we do not want to stop in between grid spaces, so we will track the progress and animate the movement
    // between the grid spaces

    // set the starting progress remaining to 0 so that the character can be moved with an arrow key
    this.movingProgressRemaining = 0;
    // just like for moving, we need to make sure the character does not start standing while already standing
    this.isStanding = false;

    // add a flag for whether the Person is a player or not - default to false
    this.isPlayerControlled = config.isPlayerControlled || false;

    // map of instructions
    this.directionUpdate = {
      up: ["y", -1],
      down: ["y", 1],
      left: ["x", -1],
      right: ["x", 1],
    };
  }
  //  End of constructor

  //  Call update with the state to take care of the movement
  update(state) {
    // moved this from the updatePosition method to here to make sure the character can not move into a wall
    //  we check if there is progress remaining - if there is - keep moving
    // if there is no progress remaining, the state includes a behavior with an arrow direction - we use our utility to check if there is a wall
    // if there is a wall, return - if there is no wall, set the moving progress remaining to 16 - allowing the character to move

    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
    } else {
      // CASE: More cases will be added in the future
      //
      //
      // CASE: The character is player controlled and moved with an arrow key while keyboard ready
      // if there is no moving progress left (last direction has finished) && the state includes an arrow
      //  direction is in the state, so update the direction - if they are a Person && the map is not playing a cutscene
      if (
        !state.map.isCutscenePlaying &&
        this.isPlayerControlled &&
        // this.movingProgressRemaining === 0 && - this check is not needed any more after refactoring
        state.arrow
      ) {
        // This is a more rubust check than we previously had to ensure that the character CAN move BEFORE they do
        // here we are creating a new METHOD called startBehavior that will take the state and a behavior object
        // the behavior object will have a type and a direction (instructions)
        this.startBehavior(state, {
          type: "walk",
          direction: state.arrow,
        });
      }
      this.updateSprite(state);
    }
  }

  //  Start the behavior of the Person
  startBehavior(state, behavior) {
    // old code -> this.direction = state.arrow; - now we set direction to the behavior direction
    this.direction = behavior.direction;
    // currently only walk is supported, so we will check if the behavior is a walk
    // this functionality allows us to add more behaviors in the future
    if (behavior.type === "walk") {
      // check if the space is taken by a wall before being allowed to move
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        // if the space is taken, set a timeout to retry the walk, then return if the space is taken
        behavior.retry &&
          setTimeout(() => {
            // this creates an infinite loop of retrying the walk if the space is taken every 10ms
            // until the await is resolved in the OverworldEvent.js -> walk method this will keep trying to walk
            this.startBehavior(state, behavior);
          }, 10);
        return;
      }
      // before we start walking - let's move the wall
      // essentially - every time the character moves, we will move the wall created by the character's map mounting along with them
      state.map.moveWall(this.x, this.y, this.direction);
      // if the space is not taken, set the moving progress to 16 to allow the character to move 16 pixels (1 grid space)
      this.movingProgressRemaining = 16;
      // now that we have set the moving progress, we can update the sprite to animate the character
      this.updateSprite(state);
    }

    // handle the case where the behavior is stand
    if (behavior.type === "stand") {
      console.log("standing");
      this.isStanding = true;
      // we will use a setTimeout to set how long the standing should last, the time property will be in the behavior object
      setTimeout(() => {
        utils.emitEvent("personStandingComplete", { whoId: this.id });
        // when the time is up, set the isStanding flag to false
        this.isStanding = false;
      }, behavior.time);
    }
  }

  // Person is the only object that will have a movement speed so far, so we will set it here
  // we destructure the directionUpdate array to get the property and change
  // when this runs => property will be x or y, change will be -1 or 1
  // update the position of the object by the change amount
  // decrement the moving progress
  updatePosition() {
    const [property, change] = this.directionUpdate[this.direction];
    this[property] += change;

    // decrement the moving progress
    this.movingProgressRemaining -= 1;
    // then we need a way to tell other objects that the position has changed
    if (this.movingProgressRemaining === 0) {
      // we have finished moving so we can fire off a signal that other objects can listen to
      // to do this we will use a NATIVE BROWSER API called the CustomEvent API
      //  we created a utility function that will emit an event for browser handling with an event name and detail
      utils.emitEvent("personWalkingComplete", { whoId: this.id });
    }
  }

  //   Update the sprite to animate the character - without needing state!!!
  updateSprite() {
    // refactored => if there is progress remaining, set the animation to walk again and return
    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation(`walk-${this.direction}`);
      return;
    }
    // because we used the return this will only run if there is no progress remaining
    this.sprite.setAnimation(`idle-${this.direction}`);
  }
}
