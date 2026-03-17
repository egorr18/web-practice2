"use strict";

console.log("Підключено JavaScript для Практичної роботи №4");

const taskInput = document.getElementById("taskInput");
const addTaskButton = document.querySelector("#addTask");
const taskList = document.getElementById("taskList");

console.log("Елементи DOM знайдено:", { taskInput, addTaskButton, taskList });

taskList.addEventListener("click", function (event) {
    if (event.target.tagName === "LI") {
        console.log(`Видалення завдання: "${event.target.textContent}"`);
        event.target.remove();
    }
}, false);

taskList.addEventListener("click", function (event) {
    if (event.target.tagName === "LI") {
        console.log("клік по завданню");
    }
}, true);

addTaskButton.addEventListener("click", function () {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Введіть текст завдання!");
        console.warn("Спроба додати порожнє завдання");
        return;
    }

    const li = document.createElement("li");
    li.textContent = taskText;
    li.style.cursor = "pointer";
    li.style.padding = "8px";
    li.style.margin = "4px 0";
    li.style.backgroundColor = "#f0f0f0";
    li.style.borderRadius = "4px";

    taskList.appendChild(li);

    console.log(`Додано нове завдання: "${taskText}"`);

    taskInput.value = "";
});

taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTaskButton.click(); // імітуємо клік по кнопці
    }
});

console.log("✅ To-do list повністю готовий і працює!");
