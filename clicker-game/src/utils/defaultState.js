export function createDefaultGameState() {
  return {
    version: 1,
    credits: 0,
    duiktcoins: 0,
    totalEarned: 0,
    totalClicks: 0,
    boosters: 0,
    casesOpened: 0,
    spinsUsed: 0,
    comboStreak: 0,
    lastManualClickAt: 0,
    lastPlayedAt: Date.now(),
    activeBoosterUntil: 0,
    antiBonus: null,
    activeSkin: "classic",
    skinsUnlocked: ["classic"],
    upgrades: {
      clickPower: 0,
      autoClicker: 0,
      passiveIncome: 0,
      combo: 0,
      criticalClick: 0
    }
  };
}

export function normalizeGameState(savedState) {
  const defaults = createDefaultGameState();

  if (!savedState || typeof savedState !== "object") {
    return defaults;
  }

  return {
    ...defaults,
    ...savedState,
    upgrades: {
      ...defaults.upgrades,
      ...(savedState.upgrades ?? {})
    },
    skinsUnlocked: Array.isArray(savedState.skinsUnlocked)
      ? Array.from(new Set(["classic", ...savedState.skinsUnlocked]))
      : defaults.skinsUnlocked,
    antiBonus:
      savedState.antiBonus &&
      typeof savedState.antiBonus === "object" &&
      savedState.antiBonus.id &&
      savedState.antiBonus.endsAt
        ? savedState.antiBonus
        : null
  };
}
