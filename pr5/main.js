"use strict";

console.log("Підключено JavaScript для Практичної роботи №5");

const loadPokemonBtn = document.getElementById("loadPokemon");
const output = document.getElementById("pokemonOutput");

loadPokemonBtn.addEventListener("click", async () => {
    const pokemonInput = prompt("Введіть ім'я або ID покемона (наприклад: pikachu або 25):");
    
    if (!pokemonInput || pokemonInput.trim() === "") {
        output.textContent = "Ви не ввели ім'я або ID!";
        return;
    }

    const query = pokemonInput.trim().toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${query}`;

    output.textContent = "⏳ Завантаження даних...";

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Покемона не знайдено! (HTTP ${response.status})`);
        }

        const data = await response.json();

        const displayInfo = `ПІДІБРАНО ПОКЕМОНА!

Ім'я:          ${data.name.toUpperCase()}
ID:            #${data.id}
Вага:          ${data.weight / 10} кг
Зріст:         ${data.height / 10} м
Типи:          ${data.types.map(t => t.type.name).join(", ")}
Здатності:     ${data.abilities.map(a => a.ability.name).join(", ")}

Зображення:    ${data.sprites.front_default || "Немає"}
URL API:       ${url}
`.trim();

        output.textContent = displayInfo;

        console.log("Дані покемона:", data);

    } catch (error) {
        console.error("Помилка:", error);
        output.textContent = `ПОМИЛКА: ${error.message}\n\nСпробуйте інше ім'я (pikachu, bulbasaur, 25 тощо).`;
    }
});

function exampleCallback(callback) {
    setTimeout(() => {
        callback("Дані від callback");
    }, 1000);
}
exampleCallback(result => console.log("Callback результат:", result));

const examplePromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        Math.random() > 0.3 ? resolve("Успіх!") : reject("Помилка в промісі");
    }, 500);
});
examplePromise
    .then(data => console.log("Promise then:", data))
    .catch(err => console.error("Promise catch:", err));

async function examplePromiseAll() {
    try {
        const [p1, p2] = await Promise.all([
            fetch("https://jsonplaceholder.typicode.com/todos/1").then(r => r.json()),
            fetch("https://jsonplaceholder.typicode.com/todos/2").then(r => r.json())
        ]);
        console.log("Promise.all результат:", [p1, p2]);
    } catch (e) {
        console.error("Promise.all помилка:", e);
    }
}
examplePromiseAll();

Promise.race([
    fetch("https://jsonplaceholder.typicode.com/todos/3").then(r => r.json()),
    new Promise((_, reject) => setTimeout(() => reject("Таймаут"), 200))
]).then(data => console.log("Promise.race переміг:", data))
 .catch(err => console.error("Race помилка:", err));

async function loadUsersExample() {
    try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!res.ok) throw new Error("HTTP " + res.status);
        const users = await res.json();
        console.log("Приклад користувачів (jsonplaceholder):", users.slice(0, 3));
    } catch (e) {
        console.error("Помилка приклад:", e);
    }
}
loadUsersExample();