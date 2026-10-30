"use strict";

let allHorseCards = [];

async function getHorseCard() {
  try {
    const resp = await fetch("hastar.json");
    if (!resp.ok) throw new Error("Hästar kunde inte hämtas");

    // sparar array från fil i globala variabeln
    allHorseCards = await resp.json();

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
getHorseCard();

// --------------------------------------------KARTA----------------------------------------------------
const pastureDi = document.querySelector("#pasture-dialog");

const pasture1 = document.querySelector("#hage1");
const pasture2 = document.querySelector("#hage2");
const pasture3 = document.querySelector("#hage3");
const pasture4 = document.querySelector("#hage4");
const pasture5 = document.querySelector("#hage5");
const pasture6 = document.querySelector("#hage6");

const pastureArray = [
  pasture1,
  pasture2,
  pasture3,
  pasture4,
  pasture5,
  pasture6,
];

pastureArray.forEach((pasture) => {
  pasture.addEventListener("click", (event) => {
    event.preventDefault();
    pastureOpen(pasture);
  });
});

function pastureOpen(data) {
  const horsesDiv = document.querySelector("#pasture-horses");
  const foodDiv = document.querySelector("#pasture-food");

  horsesDiv.innerHTML = "";
  foodDiv.innerHTML = "";

  const horsesTitle = document.createElement("h2");
  const foodTitle = document.createElement("h2");

  horsesTitle.textContent = "I denna hage går:";
  foodTitle.textContent = "Total mängd hö morgonfodring:";

  horsesDiv.appendChild(horsesTitle);
  foodDiv.appendChild(foodTitle);

  allHorseCards.forEach((horse) => {
    if (data.id.includes(horse.pasture)) {
      const nameP = document.createElement("p");
      nameP.textContent = horse.name;
      horsesDiv.appendChild(nameP);
    }
  });
  let sum = 0;
  allHorseCards.forEach((horse) => {
    if (data.id.includes(horse.pasture)) {
      sum = sum + horse.hay.morning;
    }
  });
  const foodP = document.createElement("p");

  foodP.textContent = `${sum} kg`;

  foodDiv.appendChild(foodP);

  pastureDi.showModal();
  pastureDi.focus();
}

const closeBtn = document.querySelector("#close");

closeBtn.addEventListener("click", () => {
  pastureDi.close();
});
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
  } else {
    return 0;
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

  //   skriver ut array om antal är mellan 1 och 15
  if (blanketsYes > 0 && blanketsYes < 16) {
    blanketsYes.forEach((horse) => {
      let horsePEl = document.createElement("p");

      horsePEl.textContent = horse.name;

      blankets.appendChild(horsePEl);
    });
  }
}

// ---------------------------------------------ATT GÖRA--------------------------------------------

const undoneEl = document.querySelector("#undone");
const doneEl = document.querySelector("#done");
const startOverBtn = document.querySelector("#start-over");

// Array med alla uppgifter
let choreArray = [
  "Släppa ut hästarna",
  "Fodra hästarna",
  "Mocka boxarna",
  "Fylla vattenkar",
  "Sopa stallgången",
  "Packa höpåsar",
  "Ta in hästarna",
];

// ny array där utförda uppgifter hamnar
let doneArray = [];

// Skriver ut array till dom
function toDo(array) {
  undoneEl.innerHTML = "";
  array.forEach((chore) => {
    let choreEl = document.createElement("button");

    choreEl.classList.add("todo-knapp");
    choreEl.innerHTML = chore;

    undoneEl.appendChild(choreEl);

    // lyssnare för klick på varje knapp
    choreEl.addEventListener("click", () => {
      doneChores(chore);
    });
  });
}

// lägger utförda uppgifter i ny array och filtrerar den gamla
function doneChores(chore) {
  doneArray.push(chore);
  choreArray = choreArray.filter((input) => {
    return input !== chore;
  });
  console.log(choreArray);
  console.log(doneArray);
  saveProgress();

  toDo(choreArray);
  displayDone(doneArray);
}

// sparar arrayer i local storage
function saveProgress() {
  const undoneJson = JSON.stringify(choreArray);
  const doneJson = JSON.stringify(doneArray);

  localStorage.setItem("undone", undoneJson);
  localStorage.setItem("done", doneJson);
}

// laddar tidigare utförda uppgifter
function loadProgress() {
  const undoneData = localStorage.getItem("undone");
  const doneData = localStorage.getItem("done");

  const undone = JSON.parse(undoneData);
  const done = JSON.parse(doneData);

  if (undone === null) {
    restoreArray();
  }
  if (done !== null) {
    choreArray = undone;
    doneArray = done;
    toDo(undone);
    displayDone(done);
  }
}

// skriver ut utförda till dom
function displayDone(array) {
  doneEl.innerHTML = "";

  array.forEach((chore) => {
    let choreEl = document.createElement("button");

    choreEl.classList.add("todo-knapp-klar");
    choreEl.innerHTML = chore;

    doneEl.appendChild(choreEl);
  });
}

// återställer arrayer
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
  localStorage.removeItem("undone");
  localStorage.removeItem("done");
  toDo(choreArray);
}

toDo(choreArray);

// lyssnare för knapp börja om
startOverBtn.addEventListener("click", restoreArray);

document.addEventListener("DOMContentLoaded", loadProgress);
