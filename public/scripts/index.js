/* eslint-disable no-undef */

import { login } from "./login.js";
import { displayMap } from "./map.js";

const mapEl = document.getElementById("map");
const loginForm = document.querySelector(".login-form");

if (mapEl) {
  const locations = JSON.parse(mapEl.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login({ email, password });
  });
}
