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

//FREQUENTLY ASKED QUESTIONS

const question = document.querySelectorAll(".question");

for (let i = 0; i < question.length; i++) {
  question[i].addEventListener("click", function () {
    this.classList.toggle("active");
    let active = this.nextElementSibling;
    if (active.style.display === "block") {
      active.style.display = "none";
    } else {
      active.style.display = "block";
    }
  });
}

// LISTA MED HÄSTAR

const horses = document.querySelector("#horses");

async function horseCard() {
  try {
    const resp = await fetch("hastar.json");

    const data = await resp.json();
  } catch (error) {}
}

// horseCard();
