// This function will call itself when loaded

(function () {
  const overworld = new Overworld({
    element: document.querySelector(".game-container"),
  });
  // Now that we have created the overworld object, we can call the init method
  overworld.init();
})();
