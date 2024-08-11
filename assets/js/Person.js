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

    // if there is no moving progress left (last direction has finished) && the state includes an arrow
    //  direction is in the state, so update the direction - if they are a Person
    if (
      this.isPlayerControlled &&
      this.movingProgressRemaining === 0 &&
      state.arrow
    ) {
      this.direction = state.arrow;
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
}
