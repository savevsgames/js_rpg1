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
    this.updatePosition();
    this.updateSprite(state);

    // if there is no moving progress left (last direction has finished) && the state includes an arrow
    //  direction is in the state, so update the direction - if they are a Person
    if (
      this.isPlayerControlled &&
      this.movingProgressRemaining === 0 &&
      state.arrow
    ) {
      this.direction = state.arrow;
      // if the space is not taken, move the character
      console.log(state.map.isSpaceTaken(this.x, this.y, this.direction));
      this.movingProgressRemaining = 16;
    }
  }

  // Person is the only object that will have a movement speed so far, so we will set it here
  // we destructure the directionUpdate array to get the property and change
  // when this runs => property will be x or y, change will be -1 or 1
  // update the position of the object by the change amount
  // decrement the moving progress
  updatePosition() {
    if (this.movingProgressRemaining > 0) {
      const [property, change] = this.directionUpdate[this.direction];
      this[property] += change;
      this.movingProgressRemaining -= 1;
    }
  }

  //   Update the sprite to animate the character using the state
  updateSprite(state) {
    if (!this.isPlayerControlled) {
      this.sprite.setAnimation(`idle-${this.direction}`);
    }

    // game object has a this.sprite and this.sprite has a setAnimation method
    // we will set the animation based on the direction with the key
    // since we cant do both idle and walk, we will need to add a conditional to check if the character is moving
    if (
      this.isPlayerControlled &&
      this.movingProgressRemaining === 0 &&
      !state.arrow
    ) {
      // this is for when we want to stop the character from moving
      this.sprite.setAnimation(`idle-${this.direction}`);
      return;
    }

    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation(`walk-${this.direction}`);
    }
    // this logic will not work for NPCs, so we will need to modify it in the future
  }
}
