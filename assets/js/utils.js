//  utils is an object that contains utility functions that can be used throughout the application.
const utils = {
  // withGrid is a function that takes a number and multiplies it by 16.
  withGrid(n) {
    return n * 16;
  },
  // asGridCoord is a function that takes an x and y coordinate and returns a string that represents the x and y coordinate in the grid.
  // we need it to create a key for the walls object in the OverworldMap.js file.
  asGridCoord(x, y) {
    return `${x * 16}, ${y * 16}`;
  },
  // nextPosition is a function that takes an initial x and y coordinate and a direction and returns the next x and y coordinate based on the direction.
  nextPosition(initialX, initialY, direction) {
    let x = initialX;
    let y = initialY;
    const size = 16;
    if (direction === "left") {
      x -= size;
    } else if (direction === "right") {
      x += size;
    } else if (direction === "up") {
      y -= size;
    } else if (direction === "down") {
      y += size;
    }
    // return an object with the next x and y coordinates
    return { x, y };
  },

  // a CustomEvent utility function that will emit an event for browser handling with a name and detail
  emitEvent(name, detail) {
    // ex. we have finished moving so we can fire off a signal that other objects can listen to
    // to do this we will use a NATIVE BROWSER API called the CustomEvent API
    const event = new CustomEvent(name, {
      // "detail" is a more detailed configuration object that tells us more about the event - ex. whoId in a walking method (who is walking)
      detail,
    });
    // "dispatch" the event on the document
    document.dispatchEvent(event);
  },
};
