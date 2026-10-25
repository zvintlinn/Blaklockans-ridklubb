"use strict";

// ----------------------------------------------MOBILMENY----------------------------------------------------

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

// ---------------------------------------------VÄDERINFO---------------------------------------------------

let whiteCircleEl = document.querySelector("#temp");

async function getWeather() {
  try {
    const resp = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=63.1792&longitude=14.6357&daily=weather_code,temperature_2m_max,temperature_2m_min&current=temperature_2m,weather_code&timezone=Europe%2FBerlin&forecast_days=1",
    );

    if (!resp.ok) {
      throw new Error("Kunde inte ladda väderdata");
    }

    const data = await resp.json();
    displayWeather(data);
  } catch (error) {
    console.error(error.message);
  }
}

function medianTemp(data) {
  let sum = data.daily.temperature_2m_min[0] + data.daily.temperature_2m_max[0];
  let median = sum / 2;

  return median;
}

function weatherType(data) {
  if (data.daily.weather_code < 2) {
    return "images/svg/sol.svg";
  } else if (data.daily.weather_code < 4) {
    return "images/svg/solmoln.svg";
  } else if (data.daily.weather_code < 63) {
    return "images/svg/solregn.svg";
  } else if (data.daily.weather_code < 68) {
    return "images/svg/regn.svg";
  } else if (data.daily.weather_code < 95) {
    return "images/svg/snow.svg";
  } else if (data.daily.weather_code < 100) {
    return "images/svg/thunder.svg";
  }
}

function displayWeather(data) {
  const temp = medianTemp(data);
  const weather = weatherType(data);

  // raderar tidigare värde
  whiteCircleEl.innerHTML = "";

  let iconEl = document.createElement("img");
  let tempEl = document.createElement("p");

  iconEl.src = weather;
  iconEl.style.width = "clamp(15px, 7vw, 100px)";
  iconEl.style.marginTop = "1vw";

  tempEl.style.fontWeight = "700";
  tempEl.style.fontSize = "clamp(0.4rem, 2vw, 2rem";
  tempEl.style.color = "var(--darktext)";
  tempEl.style.marginTop = "0.5vw";

  tempEl.innerHTML = `${temp} ${data.current_units.temperature_2m}`;

  whiteCircleEl.appendChild(iconEl);
  whiteCircleEl.appendChild(tempEl);
}

getWeather();
