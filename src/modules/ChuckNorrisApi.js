class ChuckNorrisApi {
  constructor() {
    // Define the API basics
    this.baseUrl = "https://api.icndb.com";
    this.endpoints = {
      single: "/jokes/:id",
      random: "/jokes/random/:amount",
      count: "/jokes/count",
      categories: "/categories"
    };
    this.name = "Chuck Norris";
  }

  // Get any random joke
  getRandomJokes(amount, callback) {
    // old version, if you don't have an extra method for creating the URLs
    // const url = `${this.baseUrl}${this.endpoints.random}`.replace("{amount}", "");

    // { amount }  is equal to  { amount: amount }  because it sets the value for a property with
    // the name "amount" to the value of the variable with that same name "amount".
    const url = this.buildUrl(this.endpoints.random, { amount });
    this.call(url, callback);
  }

  // Get a single joke, by its ID
  getJokeById(id, callback) {
    const url = this.buildUrl(this.endpoints.single, { id });
    this.call(url, callback);
  }

  // Get the total amount of jokes
  getJokeCount(callback) {
    const url = this.buildUrl(this.endpoints.count);
    this.call(url, callback);
  }

  // Get the categories for jokes
  getCategories(callback) {
    const url = this.buildUrl(this.endpoints.categories);
    this.call(url, callback);
  }

  // Call a URL, using jQuery and call the given callback, when the asynchronous
  // request is successfull.
  call(url, callback) {
    $.getJSON(url).done(response => {
      callback(response);
    });
  }

  // Create the URL needed to call for an API endpoint and replace all variables, that are passed
  // as an object (optional second parameter).
  buildUrl(endpoint, variables = {}) {
    let url = `${this.baseUrl}${endpoint}`;

    // Replace variables with values (we use the syntax: :variableName)
    for (let key in variables) {
      const value = variables[key];
      url = url.replace(`:${key}`, value !== null ? value : "");
    }

    // Set the parameter for changing the name
    if (
      [this.endpoints.single, this.endpoints.random].includes(endpoint) &&
      // equivalent of the Array-version above, that's "a tiny bit" shorter
      // (endpoint === this.endpoints.single || endpoint === this.endpoints.random)

      this.name !== "Chuck Norris"
    ) {
      const parts = this.name.split(" ");

      if (parts.length > 0) {
        url += "?firstName=" + parts[0];
      }

      if (parts.length > 1) {
        url += "&lastName=" + parts[1];
      }
    }

    return url;
  }

  setName(name) {
    this.name = name.trim();
  }
}

// This is retrieved, when using import
export default ChuckNorrisApi;
