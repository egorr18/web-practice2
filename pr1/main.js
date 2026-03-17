"use strict";

console.log("JavaScript запущено");

function startSurvey() {

alert("Ласкаво просимо до анкети!");

let name = prompt("Введіть ваше ім'я:");
let age = Number(prompt("Введіть ваш вік:"));
let city = prompt("З якого ви міста?");
let color = prompt("Ваш улюблений колір?");
let works = confirm("Чи працюєте ви?");

console.log("Тип змінної name:", typeof name);
console.log("Тип змінної age:", typeof age);
console.log("Тип змінної city:", typeof city);
console.log("Тип змінної color:", typeof color);
console.log("Тип змінної works:", typeof works);

let isAdult = age >= 18;

alert(
"Ім'я: " + name +
"\nВік: " + age +
"\nМісто: " + city +
"\nУлюблений колір: " + color +
"\nПрацює: " + works +
"\nПовнолітній: " + isAdult
);

console.log("Анкета завершена");

}