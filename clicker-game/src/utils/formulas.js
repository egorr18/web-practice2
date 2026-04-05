import {
  ANTI_BONUSES,
  BOOSTER_DURATION_MS,
  CASE_REWARDS,
  COMBO_WINDOW_MS,
  MAX_OFFLINE_SECONDS,
  UPGRADE_CONFIG,
  WHEEL_REWARDS
} from "./constants.js";

export function roundNumber(value) {
  return Math.max(0, Math.round(value));
}

export function clampSeconds(seconds) {
  return Math.max(0, Math.min(seconds, MAX_OFFLINE_SECONDS));
}

export function getUpgradeCost(upgradeId, level) {
  const config = UPGRADE_CONFIG[upgradeId];
  return roundNumber(config.baseCost * config.growth ** level);
}

export function getManualBaseClickValue(upgrades) {
  return 1 + upgrades.clickPower;
}

export function getAutoClicksPerSecond(upgrades) {
  return upgrades.autoClicker;
}

export function getAutoClickIncome(state, now = Date.now()) {
  const multiplier = getGlobalIncomeMultiplier(state, now);
  const autoClicks = getAutoClicksPerSecond(state.upgrades);
  const manualBase = getManualBaseClickValue(state.upgrades);
  return roundNumber(autoClicks * manualBase * multiplier);
}

export function getPassiveIncome(state, now = Date.now()) {
  const multiplier = getGlobalIncomeMultiplier(state, now);
  const glitchPenalty = isAntiBonusActive(state, "glitch", now) ? 0.5 : 1;
  const passiveBase = state.upgrades.passiveIncome * 2;
  return roundNumber(passiveBase * multiplier * glitchPenalty);
}

export function getPassiveTickBreakdown(state, now = Date.now()) {
  const autoIncome = getAutoClickIncome(state, now);
  const passiveIncome = getPassiveIncome(state, now);
  return {
    autoClicks: getAutoClicksPerSecond(state.upgrades),
    autoIncome,
    passiveIncome,
    totalIncome: autoIncome + passiveIncome
  };
}

export function getPassiveTickIncome(state, now = Date.now()) {
  return getPassiveTickBreakdown(state, now).totalIncome;
}

export function getComboMultiplier(comboLevel, comboStreak) {
  if (comboLevel === 0) {
    return 1;
  }

  const cappedStreak = Math.min(comboStreak, 10);
  return 1 + cappedStreak * comboLevel * 0.05;
}

export function getCriticalChance(level) {
  return Math.min(level * 0.08, 0.4);
}

export function getCriticalMultiplier(level) {
  return 2 + level * 0.25;
}

export function getPrestigeReward(totalEarned) {
  return Math.floor(Math.sqrt(Math.max(0, totalEarned) / 1000));
}

export function getPrestigeMultiplier(duiktcoins) {
  return 1 + duiktcoins * 0.1;
}

export function getGlobalIncomeMultiplier(state, now = Date.now()) {
  const prestigeMultiplier = getPrestigeMultiplier(state.duiktcoins);
  const boosterMultiplier = state.activeBoosterUntil > now ? 2 : 1;
  return prestigeMultiplier * boosterMultiplier;
}

export function isAntiBonusActive(state, antiBonusId, now = Date.now()) {
  return Boolean(
    state.antiBonus &&
      state.antiBonus.id === antiBonusId &&
      state.antiBonus.endsAt > now
  );
}

export function getManualClickReward(state, now = Date.now()) {
  const comboContinues = now - state.lastManualClickAt <= COMBO_WINDOW_MS;
  const nextComboStreak = comboContinues ? state.comboStreak + 1 : 1;
  const base = getManualBaseClickValue(state.upgrades);
  const comboMultiplier = getComboMultiplier(state.upgrades.combo, nextComboStreak);
  const criticalChance = getCriticalChance(state.upgrades.criticalClick);
  const criticalHit = Math.random() < criticalChance;
  const criticalMultiplier = criticalHit
    ? getCriticalMultiplier(state.upgrades.criticalClick)
    : 1;
  const totalMultiplier = getGlobalIncomeMultiplier(state, now);

  return {
    reward: roundNumber(base * comboMultiplier * criticalMultiplier * totalMultiplier),
    criticalHit,
    nextComboStreak
  };
}

export function getRemainingSeconds(until, now = Date.now()) {
  if (!until || until <= now) {
    return 0;
  }

  return Math.ceil((until - now) / 1000);
}

export function getRandomAntiBonus() {
  const list = Object.values(ANTI_BONUSES);
  return list[Math.floor(Math.random() * list.length)];
}

export function drawWeightedReward(rewards) {
  const totalWeight = rewards.reduce((sum, item) => sum + item.weight, 0);
  let cursor = Math.random() * totalWeight;

  for (const reward of rewards) {
    cursor -= reward.weight;
    if (cursor <= 0) {
      return reward;
    }
  }

  return rewards[rewards.length - 1];
}

export function drawCaseReward() {
  return drawWeightedReward(CASE_REWARDS);
}

export function drawWheelReward() {
  return drawWeightedReward(WHEEL_REWARDS);
}

export function getBoosterDurationMs() {
  return BOOSTER_DURATION_MS;
}

export function calculateOfflineIncome(state, now = Date.now()) {
  const elapsedSeconds = clampSeconds(
    Math.floor((now - (state.lastPlayedAt || now)) / 1000)
  );

  if (elapsedSeconds <= 0) {
    return { offlineIncome: 0, elapsedSeconds: 0 };
  }

  const cleanState = {
    ...state,
    activeBoosterUntil: 0,
    antiBonus: null
  };
  const incomePerSecond = getPassiveTickBreakdown(cleanState, now).totalIncome;

  return {
    offlineIncome: roundNumber(incomePerSecond * elapsedSeconds),
    elapsedSeconds
  };
}

export function getAntiBonusCountdownText(state, now = Date.now()) {
  if (!state.antiBonus || state.antiBonus.endsAt <= now) {
    return "Немає активного антибонусу";
  }

  const seconds = getRemainingSeconds(state.antiBonus.endsAt, now);
  return `${state.antiBonus.label} активний ще ${seconds} c`;
}