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
    horseImgEl.tabIndex = "0";
    horseImgEl.role = "button";
    horseImgEl.style.cursor = "pointer";

    horseNameEl.textContent = horse.name;

    horseDivEl.appendChild(horseImgEl);
    horseDivEl.appendChild(horseNameEl);
    horses.appendChild(horseDivEl);

    horseImgEl.addEventListener("click", () => {
      displayHorseInfo(horse);
    });
    horseImgEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        displayHorseInfo(horse);
      }
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

  const genderP = genderDiv.querySelector("p");
  const ageP = ageDiv.querySelector("p");
  const breedP = breedDiv.querySelector("p");

  genderP.textContent = horse.gender;
  ageP.textContent = `${horse.age} år`;
  breedP.textContent = horse.breed;

  //   Bra att veta om hästen
  const aboutDiv = document.querySelector("#about");

  const aboutP = aboutDiv.querySelector("p");

  aboutP.textContent = horse.about;

  //   Tabell för foder
  const morningTr = document.querySelector("#morning");
  const nightTr = document.querySelector("#night");

  const moHayTd = morningTr.querySelector(".hay");
  const niHayTd = nightTr.querySelector(".hay");

  const moOatsTd = morningTr.querySelector(".oats");
  const niOatsTd = nightTr.querySelector(".oats");

  const moGrainTd = morningTr.querySelector(".grain");
  const niGrainTd = nightTr.querySelector(".grain");

  //   Hö
  moHayTd.textContent = `${horse.hay.morning} kg`;
  niHayTd.textContent = `${horse.hay.night} kg`;

  //   Havre
  if (horse.oats.morning === true) {
    moOatsTd.textContent = "Ja";
  } else {
    moOatsTd.textContent = "Nej";
  }

  if (horse.oats.night === true) {
    niOatsTd.textContent = "Ja";
  } else {
    niOatsTd.textContent = "Nej";
  }

  //   Korn
  if (horse.grain.morning === true) {
    moGrainTd.textContent = "Ja";
  } else {
    moGrainTd.textContent = "Nej";
  }
  if (horse.grain.night === true) {
    niGrainTd.textContent = "Ja";
  } else {
    niGrainTd.textContent = "Nej";
  }

  //   Tabell för täcken

  const rain = document.querySelector("#rain");
  const minus = document.querySelector("#minus");
  const minusSnow = document.querySelector("#minus-snow");

  if (horse.blanket.plusrain === true) {
    rain.textContent = "Ja";
    minus.textContent = "Ja";
    minusSnow.textContent = "Ja";
  } else if (horse.blanket.minus === true) {
    rain.textContent = "";
    minus.textContent = "Ja";
    minusSnow.textContent = "Ja";
  } else {
    rain.textContent = "";
    minus.textContent = "";
    minusSnow.textContent = "Ja";
  }

  //   Hage

  const pasture = document.querySelector("#pasture");
  const pastureP = pasture.querySelector("p");

  if (horse.pasture === 1) {
    pastureP.textContent = "Gräshagen";
  } else if (horse.pasture === 2) {
    pastureP.textContent = "Kullen";
  } else if (horse.pasture === 3) {
    pastureP.textContent = "Sandhagen";
  } else if (horse.pasture === 4) {
    pastureP.textContent = "Skogshagen";
  } else if (horse.pasture === 5) {
    pastureP.textContent = "Ängen";
  } else {
    pastureP.textContent = "Grindhagen";
  }
  dialog.showModal();
}

const closeBtn = document.querySelector("#close");

closeBtn.addEventListener("click", () => {
  dialog.close();
});

closeBtn.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    dialog.close();
  }
});
