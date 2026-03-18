import { greet, add, multiply, sumAll, createUserMessage } from './utils.js';
import { user, scores } from './data.js';

console.log("Практична №6 — ES6+ та модулі запущено!");

console.log(greet("Аліна"));
console.log(greet());

console.log(`10 + 7 = ${add(10, 7)}`);
console.log(`5 × (default 1) = ${multiply(5)}`);

const moreScores = [100, 65];
const allScores = [...scores, ...moreScores, 99];
console.log("Усі оцінки:", allScores);
console.log("Сума всіх:", sumAll(...allScores));

const { name, age, hobbies } = user;
const [firstHobby, secondHobby] = hobbies;

const userInfo = {
  name,
  age,
  favoriteHobby: secondHobby,
  message: `Любить ${firstHobby} та ${secondHobby}`
};

console.log("Інформація про користувача:", userInfo);

const msg = createUserMessage(user);
console.log(msg.greeting);
console.log(msg.info);

const app = document.getElementById("app");

app.innerHTML = `
  <h2>Бібліотека утиліт — результат</h2>
  
  <p><strong>Привітання:</strong> ${greet("Студент")}</p>
  
  <p><strong>Обчислення:</strong><br>
    12 + 8 = ${add(12, 8)}<br>
    7 × 3 = ${multiply(7, 3)}</p>
  
  <p><strong>Користувач (деструктуризація):</strong><br>
    Ім'я: ${name}<br>
    Вік: ${age}<br>
    Хобі: ${hobbies.join(", ")}</p>
  
  <p><strong>Усі оцінки (spread):</strong> ${allScores.join(" | ")}</p>
  
  <p><strong>Сума всіх оцінок (rest):</strong> ${sumAll(...allScores)}</p>
  
  <pre>${JSON.stringify(userInfo, null, 2)}</pre>
  
  <hr>
  <small>Демонстрація модулів, стрілочних функцій, шаблонних рядків, spread/rest, деструктуризації</small>
`;