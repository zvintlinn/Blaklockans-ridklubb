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

// Cirkel-div som ska visa väder
let whiteCircleEl = document.querySelector("#temp");

// Hämtar väder från API
async function getWeather() {
  try {
    const resp = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=63.1792&longitude=14.6357&daily=weather_code,temperature_2m_max,temperature_2m_min&current=temperature_2m,weather_code&timezone=Europe%2FBerlin&forecast_days=1",
    );

    if (!resp.ok) {
      throw new Error("Kunde inte ladda väderdata");
    }

    const data = await resp.json();

    // skriver ut väder till vit div
    displayWeather(data);

    // skriver ut vilka hästar som ska ha täcke
    displayBlankets(data);
  } catch (error) {
    console.error(error.message);
  }
}

// räknar ut median av dagens max och min-temp
function medianTemp(data) {
  let sum = data.daily.temperature_2m_min[0] + data.daily.temperature_2m_max[0];
  let median = sum / 2;

  return median.toFixed(1);
}

// hämtar rätt ikon beroende på vädertyp
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

// skriver ut väderdata till dom
function displayWeather(data) {
  // hämtar temp som kommer visas
  const temp = medianTemp(data);

  //   hämtar ikon som kommer visas
  const weather = weatherType(data);

  // raderar tidigare värde
  whiteCircleEl.innerHTML = "";

  let iconEl = document.createElement("img");
  iconEl.src = weather;
  iconEl.style.width = "clamp(15px, 5vw, 80px)";
  iconEl.style.marginTop = "1vw";

  let tempEl = document.createElement("p");
  tempEl.style.fontWeight = "700";
  tempEl.style.fontSize = "clamp(0.4rem, 1.5vw, 2rem";
  tempEl.style.color = "var(--darktext)";
  tempEl.style.marginTop = "0.5vw";
  tempEl.innerHTML = `${temp} ${data.current_units.temperature_2m}`;

  whiteCircleEl.appendChild(iconEl);
  whiteCircleEl.appendChild(tempEl);
}

getWeather();

// --------------------------------------------INFO OM TÄCKEN-------------------------------------------

// väljer div där namn ska skrivas
const blankets = document.querySelector("#blankets");

// funktion som kontrollerar vilka som ska ha täcke
function blanketsController(data) {
  // hämtar in dagens temperatur
  let median = medianTemp(data);

  //   de tre filtreringarna som kan användas
  let plusRain = allHorseCards.filter((horses) => {
    return horses.blanket.plusrain === true;
  });

  let minus = allHorseCards.filter((horses) => {
    return horses.blanket.minus === true;
  });

  let minusSnow = allHorseCards.filter((horses) => {
    return horses.blanket.minussnow === true;
  });

  //   If-sats som avgör vilken filtrering som ska användas
  if (data.daily.weather_code > 50) {
    return plusRain;
  }

  if (median < 0) {
    return minus;
  }

  if (median < 0 && data.daily.weather_code > 50) {
    return minusSnow;
  }
}

// Skriver ut namn till DOM från filtrerad array
function displayBlankets(data) {
  // lagrar filtrerad array i variabel
  let blanketsYes = blanketsController(data);

  //   återställer så det inte blir dubletter
  blankets.innerHTML = "";

  //   två if som sker om arrayen är tom eller om alla hästar är med
  if (blanketsYes == 0) {
    let horsePEl = document.createElement("p");

    horsePEl.textContent = "Ingen";

    blankets.appendChild(horsePEl);
  }

  if (blanketsYes == 16) {
    let horsePEl = document.createElement("p");

    horsePEl.textContent = "Alla";

    blankets.appendChild(horsePEl);
  }

  //   skriver ut array om antal är mellan 0 och 16
  blanketsYes.forEach((horse) => {
    let horsePEl = document.createElement("p");

    horsePEl.textContent = horse.name;

    blankets.appendChild(horsePEl);
  });
}

// ---------------------------------------------ATT GÖRA--------------------------------------------

const undoneEl = document.querySelector("#undone");
const doneEl = document.querySelector("#done");
const startOverBtn = document.querySelector("#start-over");

let choreArray = [
  "Släppa ut hästarna",
  "Fodra hästarna",
  "Mocka boxarna",
  "Fylla vattenkar",
  "Sopa stallgången",
  "Packa höpåsar",
  "Ta in hästarna",
];

let doneArray = [];

function toDo(array) {
  undoneEl.innerHTML = "";
  array.forEach((chore) => {
    let choreEl = document.createElement("button");

    choreEl.style.backgroundColor = "#ccc";
    choreEl.style.color = "var(--darktext)";
    choreEl.style.width = "10vw";
    choreEl.style.fontSize = "clamp(0.5rem, 1vw, 1.5rem";
    choreEl.style.display = "block";
    choreEl.innerHTML = chore;

    undoneEl.appendChild(choreEl);

    choreEl.addEventListener("click", () => {
      doneChores(chore);
    });
  });
}

function doneChores(chore) {
  doneArray.push(chore);
  choreArray = choreArray.filter((input) => {
    return input !== chore;
  });

  toDo(choreArray);
  displayDone(doneArray);
}

function displayDone(array) {
  doneEl.innerHTML = "";

  array.forEach((chore) => {
    let choreEl = document.createElement("button");
    choreEl.style.backgroundColor = "#487f37";
    choreEl.style.color = "#ffffff";
    choreEl.style.width = "10vw";
    choreEl.style.fontSize = "clamp(0.5rem, 1vw, 1.5rem";
    choreEl.style.display = "block";
    choreEl.innerHTML = chore;

    doneEl.appendChild(choreEl);
  });
}

function restoreArray() {
  choreArray = [
    "Släppa ut hästarna",
    "Fodra hästarna",
    "Mocka boxarna",
    "Fylla vattenkar",
    "Sopa stallgången",
    "Packa höpåsar",
    "Ta in hästarna",
  ];

  doneArray = [];

  doneEl.innerHTML = "";
  toDo(choreArray);
}

toDo(choreArray);

startOverBtn.addEventListener("click", restoreArray);
