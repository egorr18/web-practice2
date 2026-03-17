"use strict";

console.log("Підключено JavaScript для Практичної роботи №3");

class User {

constructor(name, age, profession) {

this.name = name;
this.age = age;
this.profession = profession;

}

display(){

const info = `Користувач: ${this.name}
Вік: ${this.age}
Професія: ${this.profession}`;

console.log(info);
alert(info);

}

}

class Admin extends User {

constructor(name, age, profession, role){

super(name, age, profession);

this.role = role;

}

display(){

const info = `Адміністратор: ${this.name}
Вік: ${this.age}
Професія: ${this.profession}
Роль: ${this.role}`;

console.log(info);
alert(info);

}

}


let type = prompt("Кого створити? user / admin");

let name = prompt("Введіть ім'я:");
let age = Number(prompt("Введіть вік:"));
let profession = prompt("Введіть професію:");


if(isNaN(age) || age <= 0){

alert("Помилка! Вік має бути числом більше 0");

}else{

if(type === "admin"){

let role = prompt("Введіть роль адміністратора:");

let admin = new Admin(name, age, profession, role);

admin.display();

}else{

let user = new User(name, age, profession);

user.display();

}

}




class Animal {

constructor(name){

this.name = name;

}

speak(){

console.log(`${this.name} видає звук`);
alert(`${this.name} видає звук`);

}

}


class Dog extends Animal {

speak(){

console.log(`${this.name} каже: Гав!`);
alert(`${this.name} каже: Гав!`);

}

}

let animalName = prompt("Введіть ім'я собаки:");

let dog = new Dog(animalName);

dog.speak();