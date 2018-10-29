import Popper from "popper.js";
window.jQuery = $;
window.$ = $;

require("bootstrap");

import ChuckNorrisWidget from "./modules/ChuckNorrisWidget";

const widget = new ChuckNorrisWidget({
  container: "#chuck-norris-widget"
});

const widget2 = new ChuckNorrisWidget({
  container: "#chuck-norris-widget-2",
  name: "Peter Parker"
});

/*
import ChuckNorrisApi from "./modules/ChuckNorrisApi";
const chuck = new ChuckNorrisApi();

chuck.setName("Peter Parker");
chuck.getRandomJokes(1, response => {
  console.log(response);
});

chuck.getJokeById(1, response => {
  console.log(response);
});

chuck.getJokeById(7, response => {
  console.log(response);
});

chuck.getJokeCount(response => {
  console.log(response);
});

chuck.getCategories(response => {
  console.log(response);
});
*/
