class DirectionInput {
  constructor() {
    // start with an initial state and keep track of arrow presses in an array
    // we care about which key comes in and in which order
    this.heldDirections = [];

    // create a map of key codes to directions
    this.map = {
      ArrowUp: "up",
      KeyW: "up",
      ArrowDown: "down",
      KeyS: "down",
      ArrowLeft: "left",
      KeyA: "left",
      ArrowRight: "right",
      KeyD: "right",
    };
  }

  // we need a way for external classes to access the directions
  // this is a getter - it will prevent external classes from having to access the heldDirections array directly
  get direction() {
    return this.heldDirections[0];
  }

  //   add and init method
  init() {
    document.addEventListener("keydown", (e) => {
      //   console.log(e.code);
      // if the key is in the map, add the direction to the array
      // if it is not, dir will return undefined
      const dir = this.map[e.code];
      // if we find a valid direction, and it does not exist in the array yet, then add it
      //   indexOf will return -1 if the direction is not in the array
      // we are always looking at the beginning of the array to see the most recent key press
      if (dir && this.heldDirections.indexOf(dir) === -1) {
        this.heldDirections.unshift(dir);
        console.log(this.heldDirections);
      }
    });

    document.addEventListener("keyup", (e) => {
      const dir = this.map[e.code];
      const index = this.heldDirections.indexOf(dir);
      if (index > -1) {
        this.heldDirections.splice(index, 1);
        console.log(this.heldDirections);
      }
    });
  }
}
