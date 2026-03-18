export const greet = (name = "Гість") => `Привіт, ${name}! 😊`;

export const add = (a, b) => a + b;

export const multiply = (a, b = 1) => a * b;

export const sumAll = (...numbers) => numbers.reduce((sum, n) => sum + n, 0);

export const createUserMessage = ({ name, age, city = "Невідомо" }) => ({
  greeting: `Вітаю, ${name}!`,
  info: `Тобі ${age} років, живеш у ${city}`
});