class TextMessage {
  // this constructor takes 1 OBJECT, with 2 properties as a parameter!!!!
  constructor({ text, onComplete }) {
    this.text = text;
    this.onComplete = onComplete;
    this.element = null;
  }

  createElement() {
    console.log("This.text: ", `${this.text}`);
    this.element = document.createElement("div");
    this.element.classList.add("TextMessage");
    this.element.innerHTML = `<p class="TextMessage_p">${this.text}</p>
        <button class="TextMessage_button">NEXT</button>`;
    // add an event listener to the button to close the text message
    this.element
      .querySelector(".TextMessage_button")
      .addEventListener("click", () => {
        // close the text message
        this.done();
      });

    // Now that we have created a KeyPressListener class, we can use it to listen for keys to close the text message
    this.actionListener = new KeyPressListener("Enter", () => {
      // unbind the key listener - this is because the element is being removed from the DOM so we don't want to keep listening
      this.actionListener.unbind();
      console.log("Enter key pressed!!!!");
      this.done();
    });
  }

  done() {
    // remove the element from the DOM
    this.element.remove();
    // call the onComplete
    this.onComplete();
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
  }
}
