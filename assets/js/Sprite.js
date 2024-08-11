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
      // current animations by name value and currenetAnimationFrames - frames are arrays of arrays with x and y coordinates
      "idle-down": [[0, 0]],
      "walk-down": [
        [1, 0],
        [0, 0],
        [3, 0],
        [0, 0],
      ],
    };
    // sets the current animation to the default of idle if no animation is passed in
    // this.currentAnimation = config.currentAnimation || "idle-down";
    this.currentAnimation = "walk-down";
    // sets the current frame to 0 - ie which array within the array of frames is showing => [0,0] is the first frame
    this.currentAnimationFrame = 0;

    // to acccount for the element of time we will create a frame limit - cadence of the animation
    this.animationFrameLimit = config.animationFrameLimit || 16;
    //  we need a way to track progress through the frames still - progress will start high and count down, just like our walking progress
    // this can start at the limit established above and then in the loop, we will decrement it
    this.animationFrameProgress = this.animationFrameLimit;

    // REFERENCING THE GAME OBJECT
    this.gameObject = config.gameObject;
  }

  //   in order to change the sprite sheet position(ie animate the sprite) we will need to GET the values needed to draw the sprite
  //  we need to know which animation we are on, and which frame of the animation we are on - so we can pass the correct values to drawImage
  //  we will create a method to get the current frame
  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame];
  }

  // in order to actually change the frame when the user is moving and not just draw the same frame over and over, we will need to update the frame
  // we will create a method to update the frame - this can be called every frame after we draw the sprite
  updateAnimationProgress() {
    // downtick any progress that has been made
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1;
      return;
    }
    // if the progress is at 0, reset the progress to the limit
    this.animationFrameProgress = this.animationFrameLimit;
    // advance the frame to the next frame in the animation
    this.currentAnimationFrame += 1;

    // when we reach the last frame in the animation, reset the frame to the first frame
    if (this.frame === undefined) {
      this.currentAnimationFrame = 0;
    }
  }

  // FUNCTION TO DRAW THE SPRITE
  draw(ctx) {
    const x = this.gameObject.x - 8;
    const y = this.gameObject.y - 18;

    // isLoaded and isShadowLoaded are flags to check if the image has been loaded
    // when we try to draw - make sure we've loaded the image first
    // DRAW THE SHADOW
    this.useShadow && this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);

    //   GETTER for the sprite animation frame [x,y] spritesheet coordinates
    // this.frame will be an array with the x and y coordinates of the frame
    const [frameX, frameY] = this.frame;

    // DRAW THE CHARACTER
    this.isLoaded &&
      ctx.drawImage(
        this.image, // the image to draw
        frameX * 32,
        frameY * 32,
        32,
        32,
        x,
        y,
        32,
        32
      );
    //   this MUST be called inside the draw method to update the frame
    this.updateAnimationProgress();
  }
}
