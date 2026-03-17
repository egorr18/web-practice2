"use strict";

console.log("Підключено JavaScript для Практичної роботи №2");

function greet() {
    console.log("Привіт, світ!");
}
greet();
greet();

const multiply = function(a, b) {
    return a * b;
};
console.log(multiply(4, 5));

const divide = (a, b) => a / b;
console.log(divide(20, 4));

function square(x) {
    return x * x;
}
console.log(square(6));

if (true) {
    let localVar = "Я в блоці";
    console.log(localVar);
}

function createCounter() {
    let count = 0;
    return function() {
        count++;
        return count;
    };
}

const counter = createCounter();
console.log(counter());
console.log(counter());

const person = {
    name: "Олена",
    sayHello() {
        console.log(`Привіт, мене звуть ${this.name}`);
    }
};
person.sayHello();

function add(a) {
    return function(b) {
        return a + b;
    };
}

const addTen = add(10);
console.log(addTen(5));

function createSurvey() {
    const name = prompt("Введіть ваше ім'я:");
    let age = Number(prompt("Введіть ваш вік:"));
    const city = prompt("Введіть ваше місто:");

    if (isNaN(age)) {
        alert("Вік введено некоректно!");
        return null;
    }

    const isAdult = age >= 18;

    return {
        name,
        age,
        city,
        isAdult
    };
}

function displaySurvey(surveyData) {
    if (!surveyData) return;

    const message = `Ім'я: ${surveyData.name}
Вік: ${surveyData.age}
Місто: ${surveyData.city}
Повнолітній: ${surveyData.isAdult ? "Так" : "Ні"}`;

    console.log(message);
    alert(message);
}

const surveyResult = createSurvey();
displaySurvey(surveyResult);


function createConverter(factor) {
    return function(offset) {
        return function(temp) {
            return temp * factor + offset;
        };
    };
}

const cToF = createConverter(9/5)(32);
const fToC = createConverter(5/9)(-32 * 5/9);

let temp = Number(prompt("Введіть температуру:"));
let direction = prompt("Напрямок конвертації (C to F / F to C):");

let result;

if (direction === "C to F") {
    result = cToF(temp);
} 
else if (direction === "F to C") {
    result = fToC(temp);
} 
else {
    alert("Неправильний напрямок конвертації!");
}

if (result !== undefined) {
    console.log(`Результат конвертації: ${result.toFixed(2)}`);
    alert(`Результат конвертації: ${result.toFixed(2)}`);
}