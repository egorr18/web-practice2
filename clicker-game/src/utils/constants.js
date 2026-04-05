export const GAME_DB_NAME = "duikt-clicker-db";
export const GAME_STORE_NAME = "gameState";
export const GAME_STORAGE_KEY = "main";

export const MAX_OFFLINE_SECONDS = 8 * 60 * 60;
export const COMBO_WINDOW_MS = 1500;
export const BOOSTER_DURATION_MS = 30_000;

export const UPGRADE_CONFIG = {
  clickPower: {
    id: "clickPower",
    label: "Click Power",
    description: "Збільшує базовий дохід за ручний клік.",
    baseCost: 25,
    growth: 1.55
  },
  autoClicker: {
    id: "autoClicker",
    label: "Auto Clicker",
    description: "Дає автоматичні кліки щосекунди.",
    baseCost: 75,
    growth: 1.65
  },
  passiveIncome: {
    id: "passiveIncome",
    label: "Passive Income",
    description: "Нараховує кредити щосекунди навіть без кліку.",
    baseCost: 110,
    growth: 1.7
  },
  combo: {
    id: "combo",
    label: "Combo Engine",
    description: "Підсилює серію швидких кліків.",
    baseCost: 140,
    growth: 1.75
  },
  criticalClick: {
    id: "criticalClick",
    label: "Critical Click",
    description: "Дає шанс на критичний клік із множником.",
    baseCost: 160,
    growth: 1.8
  }
};

export const ANTI_BONUSES = {
  virus: {
    id: "virus",
    label: "Virus",
    description: "Тимчасово блокує магазин і скіни.",
    durationMs: 20_000
  },
  ddos: {
    id: "ddos",
    label: "DDoS",
    description: "Тимчасово блокує ручні кліки.",
    durationMs: 12_000
  },
  glitch: {
    id: "glitch",
    label: "Glitch",
    description: "Зменшує пасивний дохід удвічі.",
    durationMs: 25_000
  }
};

export const CASE_COST = 120;
export const WHEEL_COST = 220;

export const SKINS = {
  classic: {
    id: "classic",
    label: "Classic",
    description: "Базова тема гри.",
    unlock: { type: "default" }
  },
  neon: {
    id: "neon",
    label: "Neon Grid",
    description: "Купується за кредити.",
    unlock: { type: "credits", value: 700 }
  },
  sunset: {
    id: "sunset",
    label: "Sunset",
    description: "Відкривається після 120 кліків.",
    unlock: { type: "clicks", value: 120 }
  },
  cyber: {
    id: "cyber",
    label: "Cyber Mint",
    description: "Відкривається після 4 Duiktcoins.",
    unlock: { type: "duiktcoins", value: 4 }
  }
};

export const CASE_REWARDS = [
  { id: "smallCredits", weight: 38, type: "credits", value: 140, message: "Кейс дав +140 кредитів." },
  { id: "bigCredits", weight: 18, type: "credits", value: 340, message: "Кейс дав +340 кредитів." },
  { id: "booster", weight: 14, type: "booster", value: 1, message: "Кейс дав 1 бустер." },
  { id: "duiktcoin", weight: 8, type: "duiktcoins", value: 1, message: "Кейс дав 1 Duiktcoin." },
  { id: "skin", weight: 10, type: "unlockSkin", value: "neon", message: "Кейс відкрив скин Neon Grid." },
  { id: "antiBonus", weight: 12, type: "antiBonus", value: "random", message: "Кейс запустив антибонус." }
];

export const WHEEL_REWARDS = [
  { id: "jackpot", weight: 10, type: "credits", value: 900, message: "Колесо дало джекпот +900 кредитів." },
  { id: "mediumCredits", weight: 28, type: "credits", value: 320, message: "Колесо дало +320 кредитів." },
  { id: "doubleBooster", weight: 14, type: "booster", value: 2, message: "Колесо дало 2 бустери." },
  { id: "clearAnti", weight: 12, type: "clearAntiBonus", value: true, message: "Колесо зняло активний антибонус." },
  { id: "cyberSkin", weight: 10, type: "unlockSkin", value: "cyber", message: "Колесо відкрило скин Cyber Mint." },
  { id: "antiBonus", weight: 16, type: "antiBonus", value: "random", message: "Колесо активувало антибонус." },
  { id: "duiktcoin", weight: 10, type: "duiktcoins", value: 1, message: "Колесо дало 1 Duiktcoin." }
];
