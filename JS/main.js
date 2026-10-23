"use strict";

// MOBILMENY

const menuButton = document.querySelector("#menu");
const nav = document.querySelector("#nav");

function showNav() {
  if (nav.style.display === "block") {
    nav.style.display = "none";
  } else {
    nav.style.display = "block";
  }
}

menuButton.addEventListener("click", showNav);
