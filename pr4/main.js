"use strict";

console.log("Підключено JavaScript для Практичної роботи №4");

// ========== 1. Вибір елементів DOM ==========
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.querySelector("#addTask");
const taskList = document.getElementById("taskList");

// Перевірка, чи все знайдено
console.log("Елементи DOM знайдено:", { taskInput, addTaskButton, taskList });

// ========== 2. Делегування подій + видалення завдань ==========
taskList.addEventListener("click", function (event) {
    // Делегування: перевіряємо, чи клікнули саме по <li>
    if (event.target.tagName === "LI") {
        console.log(`Видалення завдання: "${event.target.textContent}"`);
        event.target.remove(); // видаляємо елемент
    }
}, false); // false = фаза спливання (bubbling)

// ========== 3. Демонстрація фаз подій (захоплення та спливання) ==========
taskList.addEventListener("click", function (event) {
    if (event.target.tagName === "LI") {
        console.log("🔵 ФАЗА ЗАХОПЛЕННЯ (capturing): клік по завданню");
    }
}, true); // true = фаза захоплення

// ========== 4. Додавання нового завдання ==========
addTaskButton.addEventListener("click", function () {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Введіть текст завдання!");
        console.warn("Спроба додати порожнє завдання");
        return;
    }

    // Створюємо новий <li>
    const li = document.createElement("li");
    li.textContent = taskText;
    li.style.cursor = "pointer";           // показуємо, що можна клікнути
    li.style.padding = "8px";
    li.style.margin = "4px 0";
    li.style.backgroundColor = "#f0f0f0";
    li.style.borderRadius = "4px";

    // Додаємо до списку
    taskList.appendChild(li);

    console.log(`Додано нове завдання: "${taskText}"`);

    // Очищаємо поле введення
    taskInput.value = "";
});

// Додаткова зручність: додавання по Enter
taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTaskButton.click(); // імітуємо клік по кнопці
    }
});

console.log("✅ To-do list повністю готовий і працює!");