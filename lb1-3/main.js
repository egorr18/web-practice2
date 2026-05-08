"use strict";

const STORAGE_KEY = "resumeBuilderData";

class ResumeSection {
  constructor(title) {
    this._title = title;
  }

  get title() {
    return this._title;
  }
}

class PersonalInfo extends ResumeSection {
  constructor(name, age, email, phone, city) {
    super("Особиста інформація");
    this.name = name;
    this.age = age;
    this.email = email;
    this.phone = phone;
    this.city = city;
  }

  get summary() {
    return `${this.name}, ${this.age} років, ${this.city}`;
  }

  set age(value) {
    const normalizedAge = Number(value);

    if (!Number.isFinite(normalizedAge) || normalizedAge <= 0) {
      throw new Error("Вік має бути числом більше 0.");
    }

    this._age = normalizedAge;
  }

  get age() {
    return this._age;
  }
}

class Experience extends ResumeSection {
  constructor(company, position, period) {
    super("Досвід роботи");
    this.company = company;
    this.position = position;
    this.period = period;
  }
}

class Education extends ResumeSection {
  constructor(institution, specialty, period) {
    super("Освіта");
    this.institution = institution;
    this.specialty = specialty;
    this.period = period;
  }
}

class Skills extends ResumeSection {
  constructor(values) {
    super("Навички");
    this.values = values;
  }
}

class Resume {
  constructor(personal, experience, education, skills) {
    this.personal = personal;
    this.experience = experience;
    this.education = education;
    this.skills = skills;
  }

  toJSON() {
    return {
      personal: this.personal,
      experience: this.experience,
      education: this.education,
      skills: this.skills.values,
    };
  }

  render(containerId) {
    const container = document.getElementById(containerId);
    container.replaceChildren();

    const card = document.createElement("article");
    card.className = "resume-card";

    const title = document.createElement("h2");
    title.textContent = this.personal.name;

    const meta = document.createElement("p");
    meta.className = "meta";
    meta.textContent = `${this.personal.email} | ${this.personal.phone} | ${this.personal.city} | ${this.personal.age} років`;

    card.append(title, meta);
    card.append(
      createSection(this.experience.title, [
        `${this.experience.position} - ${this.experience.company} (${this.experience.period})`,
      ]),
      createSection(this.education.title, [
        `${this.education.specialty} - ${this.education.institution} (${this.education.period})`,
      ]),
      createSkillsSection(this.skills.title, this.skills.values),
    );

    container.appendChild(card);
  }
}

function createRequiredPrompt(label, defaultValue = "") {
  const value = prompt(label, defaultValue);

  if (value === null) {
    throw new Error("Введення скасовано.");
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    throw new Error(`Поле "${label}" не може бути порожнім.`);
  }

  return trimmedValue;
}

function splitSkills(text) {
  return text
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function createSection(titleText, rows) {
  const section = document.createElement("section");
  section.className = "section";

  const title = document.createElement("h3");
  title.textContent = titleText;
  section.appendChild(title);

  rows.forEach((row) => {
    const item = document.createElement("p");
    item.className = "item";
    item.textContent = row;
    section.appendChild(item);
  });

  return section;
}

function createSkillsSection(titleText, skills) {
  const section = document.createElement("section");
  section.className = "section";

  const title = document.createElement("h3");
  title.textContent = titleText;

  const list = document.createElement("ul");
  list.className = "skills";

  skills.forEach((skill) => {
    const item = document.createElement("li");
    item.textContent = skill;
    list.appendChild(item);
  });

  section.append(title, list);
  return section;
}

function getSavedData() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return null;
  }

  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error("Не вдалося прочитати збережене резюме:", error);
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function buildResumeFromData(data) {
  return new Resume(
    new PersonalInfo(
      data.personal.name,
      data.personal.age,
      data.personal.email,
      data.personal.phone,
      data.personal.city,
    ),
    new Experience(data.experience.company, data.experience.position, data.experience.period),
    new Education(data.education.institution, data.education.specialty, data.education.period),
    new Skills(data.skills),
  );
}

function collectResumeData(defaults = {}) {
  const personalDefaults = defaults.personal ?? {};
  const experienceDefaults = defaults.experience ?? {};
  const educationDefaults = defaults.education ?? {};

  const personal = new PersonalInfo(
    createRequiredPrompt("Введіть ваше ПІБ:", personalDefaults.name),
    createRequiredPrompt("Введіть ваш вік:", String(personalDefaults.age ?? "")),
    createRequiredPrompt("Введіть ваш email:", personalDefaults.email),
    createRequiredPrompt("Введіть ваш телефон:", personalDefaults.phone),
    createRequiredPrompt("Введіть ваше місто:", personalDefaults.city),
  );

  const experience = new Experience(
    createRequiredPrompt("Остання компанія:", experienceDefaults.company),
    createRequiredPrompt("Посада:", experienceDefaults.position),
    createRequiredPrompt("Період роботи:", experienceDefaults.period),
  );

  const education = new Education(
    createRequiredPrompt("Навчальний заклад:", educationDefaults.institution),
    createRequiredPrompt("Спеціальність:", educationDefaults.specialty),
    createRequiredPrompt("Період навчання:", educationDefaults.period),
  );

  const skills = new Skills(
    splitSkills(
      createRequiredPrompt(
        "Навички через кому:",
        Array.isArray(defaults.skills) ? defaults.skills.join(", ") : "",
      ),
    ),
  );

  if (skills.values.length === 0) {
    throw new Error("Потрібно ввести хоча б одну навичку.");
  }

  return new Resume(personal, experience, education, skills);
}

function saveAndRender(resume, message) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resume.toJSON()));
  resume.render("resumeOutput");
  setStatus(message);
  console.log(message, resume);
}

function setStatus(message, isError = false) {
  const status = document.getElementById("status");
  status.textContent = message;
  status.classList.toggle("error", isError);
}

function startSurvey() {
  try {
    const resume = collectResumeData(getSavedData() ?? {});
    saveAndRender(resume, "Резюме створено та збережено в localStorage.");
  } catch (error) {
    setStatus(error.message, true);
  }
}

function fillDemoResume() {
  const demoResume = buildResumeFromData({
    personal: {
      name: "Егор Король",
      age: 19,
      email: "egorkakorol2006@gmail.com",
      phone: "+380 00 000 00 00",
      city: "Київ",
    },
    experience: {
      company: "Web Practice Studio",
      position: "Junior Frontend Developer",
      period: "2024-2026",
    },
    education: {
      institution: "Фаховий коледж",
      specialty: "Комп'ютерні науки",
      period: "2023-2026",
    },
    skills: ["JavaScript", "HTML", "CSS", "DOM", "OOP"],
  });

  saveAndRender(demoResume, "Демонстраційне резюме заповнено.");
}

function clearSavedResume() {
  localStorage.removeItem(STORAGE_KEY);
  document.getElementById("resumeOutput").replaceChildren();
  setStatus("Збережене резюме очищено.");
}

document.getElementById("startBtn").addEventListener("click", startSurvey);
document.getElementById("demoBtn").addEventListener("click", fillDemoResume);
document.getElementById("clearBtn").addEventListener("click", clearSavedResume);

const savedData = getSavedData();

if (savedData) {
  try {
    buildResumeFromData(savedData).render("resumeOutput");
    setStatus("Завантажено збережене резюме з localStorage.");
  } catch (error) {
    setStatus(`Не вдалося відновити резюме: ${error.message}`, true);
  }
}
