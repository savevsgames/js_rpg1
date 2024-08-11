class GameObject {
  // we create the game object with a config parameter that will let us change the parameters of the object as needed
  constructor(config) {
    // config can pass in a position for the object, if not, it will default to 0,0
    this.x = config.x || 0;
    this.y = config.y || 0;
    // create the concept of a sprite for the object
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || "/assets/images/characters/people/hero.png",
    });
  }
}
