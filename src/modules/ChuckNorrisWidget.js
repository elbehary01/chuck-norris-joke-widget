// import {alias} from {file}
import ChuckNorrisApi from "./ChuckNorrisApi";

class ChuckNorrisWidget {
  constructor(options = {}) {
    // Setup all options
    this.options = {
      container: "#chuck-norris-widget",
      name: "Chuck Norris"
    };

    Object.assign(this.options, options);

    this.init();
  }

  init() {
    // Initialize the API
    this.api = new ChuckNorrisApi();
    this.api.setName(this.options.name);

    // Render the initial template
    this.elements = {
      container: document.querySelector(this.options.container)
    };

    this.elements.container.innerHTML = this.renderInitialTemplate();

    // Collect the elements, needed from the generated HTML
    Object.assign(this.elements, {
      joke: this.getElement(".joke"),
      nav: {
        buttonRandom: this.getElement(".nav-random-joke"),
        formById: this.getElement(".nav-joke-by-id"),
        inputJokeId: this.getElement(".nav-joke-id"),
        inputJokeName: this.getElement(".nav-joke-name"),
        buttonById: this.getElement(".nav-btn-by-id"),
        error: this.getElement(".joke-nav-error")
      }
    });

    // Register all events
    this.registerEvents();

    // Get a random joke by default
    this.api
      .getRandomJokes(1)
      .then(data => {
        this.updateDisplay(data.value[0].joke);
      })
      .catch(error => {
        this.showError(error.message);
      });
  }

  registerEvents() {
    // Button: Random joke
    this.elements.nav.buttonRandom.addEventListener("click", e => {
      e.target.setAttribute("disabled", "disabled");

      this.api.getRandomJokes(1).then(data => {
        this.updateDisplay(data.value[0].joke);
        e.target.removeAttribute("disabled");
      });
    });

    // Form: Get a single joke
    this.elements.nav.formById.addEventListener("submit", e => {
      e.preventDefault();
      // Disable the form input and button, until the data is loaded
      this.toggleFormByIdEnabled();

      // Reset (= hide) the error box (.alert-danger), until we get another
      // error from the API
      this.hideError();

      const id = Number(this.elements.nav.inputJokeId.value.trim());

      this.api.getJokeById(id).then(data => {
        if (data.type === "success") {
          this.updateDisplay(data.value.joke);
        } else {
          switch (data.type) {
            case "NoSuchQuoteException":
              this.showError(`Could not find any quote with the ID ${id}!`);
              break;

            default:
              this.showError(`Error: ${data.value}`);
              break;
          }
        }

        // Enable the form input and button again
        this.toggleFormByIdEnabled();
      });
    });

    // Form: Name for the joke
    this.elements.nav.inputJokeName.addEventListener("keyup", e => {
      const name = this.elements.nav.inputJokeName.value.trim();

      if (name.length > 1) {
        this.api.setName(name);
      }
    });
  }

  toggleFormByIdEnabled() {
    if (this.elements.nav.inputJokeId.getAttribute("disabled")) {
      this.elements.nav.inputJokeId.removeAttribute("disabled");
      this.elements.nav.buttonById.removeAttribute("disabled");
    } else {
      this.elements.nav.inputJokeId.setAttribute("disabled", "disabled");
      this.elements.nav.buttonById.setAttribute("disabled", "disabled");
    }
  }

  showError(message) {
    this.elements.nav.error.innerHTML = message;
    this.elements.nav.error.classList.remove("hidden");
  }

  hideError() {
    this.elements.nav.error.classList.add("hidden");
  }

  updateDisplay(joke) {
    this.elements.joke.innerHTML = joke;
  }

  // Get an element by its selector, which is inside of our generated HTML
  // from the rendered templates.
  getElement(selector) {
    return this.elements.container.querySelector(selector);
  }

  // Render the initial template
  renderInitialTemplate() {
    return `
      ${this.renderNavigationTemplate()}
      <div class="joke"></div>
    `;
  }

  // Render the navigation part with the forms and buttons
  renderNavigationTemplate() {
    return `
      <nav class="joke-nav">
        <div class="alert alert-danger joke-nav-error hidden"></div>
        <form class="form-inline nav-joke-by-id">
          <input type="text" class="form-control mb-2 mb-md-0 nav-joke-id"  placeholder="Joke ID">
          <button class="btn btn-secondary ml-md-2 nav-btn-by-id">Get Joke</button>
        </form>
        <button class="btn btn-secondary nav-random-joke ml-2">Random Joke</button>

        <div class="float-right">
          <input type="text" class="form-control mb-2 mb-md-0 nav-joke-name" placeholder="Joke Name" value="${
            this.options.name
          }">
        </form>
      </nav>
    `;
  }
}

export default ChuckNorrisWidget;
