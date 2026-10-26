"use strict";

// --------------------------------------------LISTA MED HÄSTAR------------------------------------------------

// Skapar variabel till array i json-fil
let allHorseCards = [];

//Globala variabler
const horses = document.querySelector("#horses");
const filterSelect = document.querySelector("#filter");

// Hämtar data om hästar från json-fil
async function getHorseCard() {
  try {
    const resp = await fetch("hastar.json");
    if (!resp.ok) throw new Error("Hästar kunde inte hämtas");

    // sparar array från fil i globala variabeln
    allHorseCards = await resp.json();

    // kör filterhorses när json laddats in
    filterHorses();

    // Skriver ut ev error med röd text
  } catch (error) {
    if (horses) {
      horses.innerHTML = error;
      horses.style.color = "red";
      horses.style.fontWeight = "600";
      horses.style.fontSize = "1.3vw";
    }
  }
}

function filterHorses() {
  // ny variabel för filtrerad array
  let filteredArray = allHorseCards;

  // filtrerar array beroende på value i selektorbox
  if (filterSelect.value === "gelding") {
    filteredArray = allHorseCards.filter((horse) => {
      return horse.gender === "Valack";
    });
  }

  if (filterSelect.value === "mare") {
    filteredArray = allHorseCards.filter((horse) => {
      return horse.gender === "Sto";
    });
  }

  if (filterSelect.value === "pony") {
    filteredArray = allHorseCards.filter((horse) => {
      return horse.breed.includes("ponny");
    });
  }

  if (filterSelect.value === "horse") {
    filteredArray = allHorseCards.filter((horse) => {
      return !horse.breed.includes("ponny");
    });
  }

  // skickar filtrerad array till display horsecard
  displayHorseCard(filteredArray);
}

// skriver ut de hästar som fn. finns i array till DOM
function displayHorseCard(array) {
  horses.innerHTML = "";

  array.forEach((horse) => {
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

// anropar funktion och hämtar hastar.json när sidan laddas in
getHorseCard();

// eventlyssnare för när input på filtrering får nytt värde
if (filterSelect) {
  filterSelect.addEventListener("input", () => {
    filterHorses();
  });
}
