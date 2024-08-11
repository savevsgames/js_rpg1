class Sprite {
  constructor(config) {
    // SET UP THE IMAGE
    this.image = new Image();
    // the src will be a mandatory parameter for the sprite
    this.image.src = config.src;
    this.image.onload = () => {
      // create a flag to indicate that the image has been loaded - this will prevent drawing the image before it is loaded
      this.isLoaded = true;
    };

    // SET UP THE SHADOW
    this.shadow = new Image();
    this.useShadow = true; // config.useShadow || false;
    if (this.useShadow) {
      this.shadow.src = "/assets/images/characters/shadow.png";
    }
    this.shadow.onload = () => {
      this.isShadowLoaded = true;
    };

    // CONFIGURE ANIMATION & INITIAL STATE
    // the default sprite animation is an object with a set of properties and values
    // each animation will have a key for a name and a series of frames
    // ie. idleDown is for the character facing down and not moving
    this.animations = config.animations || {
      idleDown: [[0, 0]],
    };
    // sets the current animation to the default of idle if no animation is passed in
    this.currentAnimation = config.currentAnimation || "idleDown";
    // sets the current frame to 0 - ie which array within the array of frames is showing => [0,0] is the first frame
    this.currentAnimationFrame = 0;

    // REFERENCING THE GAME OBJECT
    this.gameObject = config.gameObject;
  }

  // FUNCTION TO DRAW THE SPRITE
  draw(ctx) {
    const x = this.gameObject.x * 16 - 8;
    const y = this.gameObject.y * 16 - 18;

    // isLoaded and isShadowLoaded are flags to check if the image has been loaded
    // when we try to draw - make sure we've loaded the image first
    // DRAW THE SHADOW
    this.useShadow &&
      this.isShadowLoaded &&
      ctx.drawImage(this.shadow, 0, 0, 32, 32, x, y, 32, 32);

    // DRAW THE CHARACTER
    this.isLoaded &&
      ctx.drawImage(
        this.image, // the image to draw
        0,
        0,
        32,
        32,
        x,
        y,
        32,
        32
      );
  }
}
