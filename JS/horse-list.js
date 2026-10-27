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
    horseImgEl.style.cursor = "pointer";

    horseNameEl.textContent = horse.name;

    horseDivEl.appendChild(horseImgEl);
    horseDivEl.appendChild(horseNameEl);
    horses.appendChild(horseDivEl);

    horseImgEl.addEventListener("click", () => {
      displayHorseInfo(horse);
    });
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

// -----------------------------DIALOG HÄSTINFO------------------------

const dialog = document.querySelector("#dialog");

function displayHorseInfo(horse) {
  const div1El = document.querySelector("#div1El");

  // Hästens namn
  const horseName = div1El.querySelector("h2");
  horseName.textContent = horse.name;

  // Hästens bild
  const image = dialog.querySelector("img");

  image.src = horse.img.src;
  image.alt = horse.img.alt;

  //   Hästens kön, ålder och ras
  const genderDiv = document.querySelector("#gender");
  const ageDiv = document.querySelector("#horse-age");
  const breedDiv = document.querySelector("#breed");

  const genderEl = document.createElement("p");
  const ageEl = document.createElement("p");
  const breedEl = document.createElement("p");

  genderEl.textContent = horse.gender;
  ageEl.textContent = `${horse.age} år`;
  breedEl.textContent = horse.breed;

  genderDiv.appendChild(genderEl);
  ageDiv.appendChild(ageEl);
  breedDiv.appendChild(breedEl);

  //   Bra att veta om hästen
  const aboutDiv = document.querySelector("#about");

  const aboutEl = document.createElement("p");

  aboutEl.textContent = horse.about;

  aboutDiv.appendChild(aboutEl);

  //   Tabell för foder
  const morningTr = document.querySelector("#morning");
  const nightTr = document.querySelector("#night");

  const moHayEl = document.createElement("td");
  const niHayEl = document.createElement("td");
  const moOatEl = document.createElement("td");
  const niOatEl = document.createElement("td");
  const moGrainEl = document.createElement("td");
  const niGrainEl = document.createElement("td");

  //   Hö
  moHayEl.textContent = `${horse.hay.morning} kg`;
  niHayEl.textContent = `${horse.hay.night} kg`;

  //   Havre
  if (horse.oats.morning === true) {
    moOatEl.textContent = "Ja";
  } else {
    moOatEl.textContent = "Nej";
  }

  if (horse.oats.night === true) {
    niOatEl.textContent = "Ja";
  } else {
    niOatEl.textContent = "Nej";
  }

  //   Korn
  if (horse.grain.morning === true) {
    moGrainEl.textContent = "Ja";
  } else {
    moGrainEl.textContent = "Nej";
  }
  if (horse.grain.night === true) {
    niGrainEl.textContent = "Ja";
  } else {
    niGrainEl.textContent = "Nej";
  }

  morningTr.append(moHayEl, moOatEl, moGrainEl);
  nightTr.append(niHayEl, niOatEl, niGrainEl);

  dialog.show();
  console.log(horse);
}
