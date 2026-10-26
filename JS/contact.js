"use strict";

// -----------------------------------KONTAKTFORMULÄR-----------------------------------------

const contactForm = document.querySelector("#contact-form");
const submitForm = document.querySelector("#submit");
const errorList = document.querySelector("#error-list");

const fName = document.querySelector("#first-name");
const surName = document.querySelector("#surname");
const age = document.querySelector("#age");
const email = document.querySelector("#email");
const phone = document.querySelector("#phone");
const message = document.querySelector("#message");

let errors = [];

errorList.innerHTML = "";

function validateForm() {
  errors = [];
  if (fName.value.trim() === "") {
    errors.push("Du måste fylla i ett förnamn.");
  }
  if (surName.value.trim() === "") {
    errors.push("Du måste fylla i ett efternamn.");
  }
  if (age.value === "") {
    errors.push("Du måste fylla i en ålder.");
  }
  if (age.value < 5) {
    errors.push(
      "Ditt barn är tyvärr för ungt för att börja på ridskolan, åldersgränsen är 5 år.",
    );
  }
  if (email.value.trim() === "") {
    errors.push("Du måste fylla i en giltig e-postadress.");
  }
  if (phone.value.length < 10) {
    errors.push("Du måste fylla i ett giltigt mobilnummer.");
  }

  displayErrors(errors);

  if (errors.length === 0) {
    return true;
  }
}

function displayErrors(array) {
  errorList.innerHTML = "";
  array.forEach((element) => {
    const liEl = document.createElement("li");

    liEl.textContent = element;
    liEl.style.color = "#d22424";

    errorList.appendChild(liEl);
  });
}

function displayThankYou() {
  const liEl = document.createElement("li");

  liEl.textContent =
    "Tack för ditt meddelande, vi kommer kontakta er så snart vi kan.";

  errorList.appendChild(liEl);
}

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (validateForm() === true) {
    displayThankYou();
  }
});
