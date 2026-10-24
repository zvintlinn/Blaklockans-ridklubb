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
// Skapar variabel till arrayen
let allHorseCards = [];

// Hämtar data om hästar från json-fil
async function getHorseCard() {
  try {
    const resp = await fetch("hastar.json");

    allHorseCards = await resp.json();

    filterHorses(allHorseCards);
    displayHorseCard(allHorseCards);
  } catch (error) {
    console.error(error.message);
  }
}

function filterHorses(data) {
  const filter = document.querySelector("#filter");
  if (filter.value === "gelding") {
    data.filter((horse) => {
      return horse.gender === "gelding";
    });
  }
}

function displayHorseCard(data) {
  console.log(allHorseCards);

  data.forEach((horse) => {
    const horseDivEl = document.createElement("div");
    const horseImgEl = document.createElement("img");
    const horseNameEl = document.createElement("p");

    horseImgEl.src = horse.img.src;
    horseImgEl.alt = horse.img.alt;

    horseNameEl.textContent = horse.name;

    horseDivEl.appendChild(horseImgEl);
    horseDivEl.appendChild(horseNameEl);
    horses.appendChild(horseDivEl);
  });
}

getHorseCard();

filter.addEventListener("input", getHorseCard);
