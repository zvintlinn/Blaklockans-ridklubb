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

const filterSelect = document.querySelector("#filter");

// Hämtar data om hästar från json-fil
async function getHorseCard() {
  try {
    const resp = await fetch("hastar.json");

    // sparar array från fil i globala variabeln
    allHorseCards = await resp.json();

    filterHorses();
  } catch (error) {
    console.error(error.message);
  }
}
function filterHorses() {
  let filteredArray = allHorseCards;

  //   om value = valack
  if (filterSelect.value === "gelding") {
    filteredArray = allHorseCards.filter((horse) => {
      return horse.gender === "Valack";
    });
  }
  console.log(filteredArray);
  displayHorseCard(filteredArray);
}

function displayHorseCard(data) {
  horses.innerHTML = "";
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

filterSelect.addEventListener("input", () => {
  filterHorses();
});
