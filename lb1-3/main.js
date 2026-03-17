"use strict";

class ResumeSection {
    constructor(title) {
        this._title = title;
    }
    get title() { return this._title; }
}

class PersonalInfo extends ResumeSection {
    constructor(name, age, email) {
        super("Особиста інформація");
        this.name = name;
        this.age = age;
        this.email = email;
    }
}

class Entry extends ResumeSection {
    constructor(type, organization, period) {
        super(type);
        this.organization = organization;
        this.period = period;
    }
}


class Resume {
    constructor() {
        this.personal = null;
        this.experience = [];
    }

    setPersonal(data) { this.personal = data; }
    addExperience(exp) { this.experience.push(exp); }

    render(containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = "";

        const card = document.createElement('div');
        card.className = 'resume-card';

        card.innerHTML = `
            <h2>${this.personal.name}</h2>
            <p><strong>Email:</strong> ${this.personal.email} | <strong>Вік:</strong> ${this.personal.age}</p>
            <h3>Досвід роботи</h3>
            <ul>
                ${this.experience.map(e => `<li>${e.organization} (${e.period})</li>`).join('')}
            </ul>
        `;
        container.appendChild(card);
    }
}

const validateAge = (age) => !isNaN(age) && age > 0;

function startSurvey() {
    const name = prompt("Введіть ваше ПІБ:");
    let ageInput = prompt("Введіть ваш вік:");
    const age = Number(ageInput);

    if (!validateAge(age)) {
        alert("Помилка: Некоректний вік!");
        return;
    }

    const email = prompt("Введіть ваш Email:");
    const job = prompt("Остання компанія:");
    const period = prompt("Період роботи (наприклад, 2020-2024):");

    const myResume = new Resume();
    myResume.setPersonal(new PersonalInfo(name, age, email));
    myResume.addExperience(new Entry("Робота", job, period));

    myResume.render("resumeOutput");
    console.log("Резюме успішно створено!", myResume);
}

document.getElementById("startBtn").addEventListener("click", startSurvey);