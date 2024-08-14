class KeyPressListener {
  // take in a keyCode and a callback function to be called when the key is pressed
  constructor(keyCode, callback) {
    // flag to stop the key from being pressed multiple times
    this.keySafe = true;

    //  each of these functions will be bound to the keyCode that we listen to
    // this allows us to set keySafe to false once the key is pressed, and then set it back to true once the key is released
    this.keydownFunction = function (event) {
      if (event.code === keyCode) {
        if (this.keySafe) {
          this.keySafe = false;
          callback();
        }
      }
    };

    this.keyupFunction = function (event) {
      if (event.code === keyCode) {
        this.keySafe = true;
      }
    };

    // now we need to bind thesee functions to the window object so they can be called
    document.addEventListener("keydown", this.keydownFunction);
    document.addEventListener("keyup", this.keyupFunction);
  }

  // the reason we created the listeners with a this.function is so we can unbind them
  // the unbind method will remove the event listeners from the window object
  unbind() {
    document.removeEventListener("keydown", this.keydownFunction);
    document.removeEventListener("keyup", this.keyupFunction);
  }
  // Now when we finish showing a text message, we can unbind the key listener with the unbind method
}
