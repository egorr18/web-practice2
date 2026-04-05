"use strict";

const STORAGE_KEYS = {
  username: "username",
  userProfile: "userProfile",
  tasks: "tasks"
};

const loadDataButton = document.getElementById("loadData");
const output = document.getElementById("output");
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const taskStats = document.getElementById("taskStats");
const testJsonErrorButton = document.getElementById("testJsonError");
const errorOutput = document.getElementById("errorOutput");

function setStatus(message, isError = false) {
  errorOutput.textContent = message;

  if (isError) {
    errorOutput.dataset.state = "error";
    return;
  }

  errorOutput.dataset.state = "success";
}

function clearStatus() {
  errorOutput.textContent = "";
  errorOutput.dataset.state = "";
}

function formatBlock(title, value) {
  const text = typeof value === "string" ? value : JSON.stringify(value, null, 2);
  return `${title}\n${text}`;
}

function safeParseJson(jsonText, fallbackValue, errorMessage = "Помилка парсингу JSON.") {
  try {
    return JSON.parse(jsonText);
  } catch (error) {
    console.error(errorMessage, error);
    setStatus(`${errorMessage} ${error.message}`, true);
    return fallbackValue;
  }
}

function runDataDemo() {
  clearStatus();

  const jsonString = '{"name":"Іван","age":30}';
  const user = safeParseJson(
    jsonString,
    { name: "Невідомо", age: 0 },
    "Не вдалося розпарсити demo JSON."
  );
  const formattedJson = JSON.stringify(user, null, 2);

  try {
    localStorage.setItem(STORAGE_KEYS.username, user.name);
    localStorage.setItem(STORAGE_KEYS.userProfile, JSON.stringify(user));
  } catch (error) {
    console.error("Не вдалося записати demo-дані в localStorage:", error);
    setStatus(`Не вдалося записати demo-дані в localStorage: ${error.message}`, true);
    return;
  }

  const savedUsername = localStorage.getItem(STORAGE_KEYS.username);
  const savedProfile = safeParseJson(
    localStorage.getItem(STORAGE_KEYS.userProfile) ?? "{}",
    {},
    "Не вдалося прочитати userProfile з localStorage."
  );

  const numbers = [1, 2, 3, 4, 5];
  const squares = numbers.map((number) => number * number);
  const evenNumbers = numbers.filter((number) => number % 2 === 0);
  const sum = numbers.reduce((accumulator, number) => accumulator + number, 0);

  output.textContent = [
    formatBlock("1. Розпарсені дані:", user),
    formatBlock("2. Відформатований JSON:", formattedJson),
    formatBlock("3. Username з localStorage:", savedUsername ?? "Немає значення"),
    formatBlock("4. Об'єкт з localStorage:", savedProfile),
    formatBlock("5. Квадрати чисел:", squares),
    formatBlock("6. Парні числа:", evenNumbers),
    formatBlock("7. Сума чисел:", sum)
  ].join("\n\n");

  setStatus("Дані успішно завантажено та оброблено.");
}

function isValidTaskList(value) {
  return Array.isArray(value) && value.every((task) => typeof task === "string");
}

function loadTasks() {
  const tasksJson = localStorage.getItem(STORAGE_KEYS.tasks);

  if (!tasksJson) {
    return [];
  }

  try {
    const tasks = JSON.parse(tasksJson);

    if (!isValidTaskList(tasks)) {
      throw new Error("Очікувався масив рядків.");
    }

    return tasks;
  } catch (error) {
    console.error("Не вдалося прочитати список завдань:", error);
    localStorage.removeItem(STORAGE_KEYS.tasks);
    setStatus(
      "Було знайдено пошкоджені дані tasks у localStorage. Дані скинуто до порожнього списку.",
      true
    );
    return [];
  }
}

function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error("Не вдалося зберегти список завдань:", error);
    setStatus(`Не вдалося зберегти список завдань: ${error.message}`, true);
    return false;
  }
}

function renderTaskStats(tasks) {
  const total = tasks.length;
  const totalSymbols = tasks.reduce((sum, task) => sum + task.length, 0);
  taskStats.textContent = `Усього завдань: ${total}. Загальна кількість символів: ${totalSymbols}.`;
}

function renderTasks() {
  const tasks = loadTasks();
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "empty-state";
    emptyItem.textContent = "Список завдань порожній.";
    taskList.appendChild(emptyItem);
    renderTaskStats(tasks);
    return;
  }

  tasks.forEach((task, index) => {
    const item = document.createElement("li");
    item.className = "task-item";

    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-task";
    deleteButton.textContent = "Видалити";
    deleteButton.dataset.index = String(index);

    item.append(taskText, deleteButton);
    taskList.appendChild(item);
  });

  renderTaskStats(tasks);
}

function addTask() {
  clearStatus();

  const taskText = taskInput.value.trim();

  if (!taskText) {
    setStatus("Не можна додати порожнє завдання.", true);
    taskInput.focus();
    return;
  }

  const tasks = loadTasks();
  tasks.push(taskText);

  if (!saveTasks(tasks)) {
    return;
  }

  renderTasks();
  taskInput.value = "";
  taskInput.focus();
  setStatus("Завдання успішно додано.");
}

function handleTaskListClick(event) {
  const deleteButton = event.target.closest(".delete-task");

  if (!deleteButton) {
    return;
  }

  clearStatus();

  const index = Number(deleteButton.dataset.index);

  if (Number.isNaN(index)) {
    setStatus("Не вдалося визначити індекс завдання.", true);
    return;
  }

  const tasks = loadTasks();

  if (index < 0 || index >= tasks.length) {
    setStatus("Індекс завдання поза межами списку.", true);
    return;
  }

  tasks.splice(index, 1);

  if (!saveTasks(tasks)) {
    return;
  }

  renderTasks();
  setStatus("Завдання видалено.");
}

function demonstrateJsonError() {
  const brokenJson = "{ name: Іван }";

  try {
    JSON.parse(brokenJson);
    setStatus("Помилку не знайдено.");
  } catch (error) {
    console.error("Помилка парсингу JSON:", error);
    setStatus(`Помилка парсингу JSON: ${error.message}`, true);
  }
}

loadDataButton.addEventListener("click", runDataDemo);
addTaskButton.addEventListener("click", addTask);
taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});
taskList.addEventListener("click", handleTaskListClick);
testJsonErrorButton.addEventListener("click", demonstrateJsonError);

renderTasks();
console.log("Підключено JavaScript для Практичної роботи №7");