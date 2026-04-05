import { useEffect, useMemo, useRef, useState } from "react";
import { loadGameState, saveGameState } from "../db/gameStorage.js";
import { useIndexedDB } from "./useIndexedDB.js";
import { createDefaultGameState, normalizeGameState } from "../utils/defaultState.js";
import {
  CASE_COST,
  COMBO_WINDOW_MS,
  SKINS,
  UPGRADE_CONFIG,
  WHEEL_COST
} from "../utils/constants.js";
import {
  calculateOfflineIncome,
  drawCaseReward,
  drawWheelReward,
  getAntiBonusCountdownText,
  getAutoClickIncome,
  getAutoClicksPerSecond,
  getBoosterDurationMs,
  getManualBaseClickValue,
  getManualClickReward,
  getPassiveIncome,
  getPassiveTickBreakdown,
  getPrestigeMultiplier,
  getPrestigeReward,
  getRandomAntiBonus,
  getRemainingSeconds,
  getUpgradeCost,
  isAntiBonusActive
} from "../utils/formulas.js";

function unlockSkinIfNeeded(currentState) {
  const nextUnlocked = new Set(currentState.skinsUnlocked);
  let changed = false;

  if (currentState.totalClicks >= SKINS.sunset.unlock.value && !nextUnlocked.has("sunset")) {
    nextUnlocked.add("sunset");
    changed = true;
  }

  if (currentState.duiktcoins >= SKINS.cyber.unlock.value && !nextUnlocked.has("cyber")) {
    nextUnlocked.add("cyber");
    changed = true;
  }

  if (!changed) {
    return currentState;
  }

  return {
    ...currentState,
    skinsUnlocked: Array.from(nextUnlocked)
  };
}

function applyReward(currentState, reward, setStatus) {
  let nextState = { ...currentState };
  let statusText = reward.message;

  switch (reward.type) {
    case "credits":
      nextState.credits += reward.value;
      nextState.totalEarned += reward.value;
      break;
    case "booster":
      nextState.boosters += reward.value;
      break;
    case "duiktcoins":
      nextState.duiktcoins += reward.value;
      break;
    case "unlockSkin":
      if (!nextState.skinsUnlocked.includes(reward.value)) {
        nextState.skinsUnlocked = [...nextState.skinsUnlocked, reward.value];
      } else {
        nextState.credits += 100;
        nextState.totalEarned += 100;
        statusText = `${reward.message} Скін уже був відкритий, тому ви отримали +100 кредитів.`;
      }
      break;
    case "clearAntiBonus":
      nextState.antiBonus = null;
      break;
    case "antiBonus": {
      const antiBonus = getRandomAntiBonus();
      nextState.antiBonus = {
        ...antiBonus,
        endsAt: Date.now() + antiBonus.durationMs
      };
      statusText = `${antiBonus.label}: ${antiBonus.description}`;
      break;
    }
    default:
      break;
  }

  setStatus({
    type: reward.type === "antiBonus" ? "error" : "success",
    text: statusText
  });

  return unlockSkinIfNeeded(nextState);
}

export function useClickerGame() {
  const { data, isLoading, storageError, persist } = useIndexedDB(loadGameState, saveGameState);
  const [gameState, setGameState] = useState(createDefaultGameState());
  const [status, setStatus] = useState({
    type: "info",
    text: "Гра готова до запуску."
  });
  const [offlineSummary, setOfflineSummary] = useState({
    income: 0,
    seconds: 0
  });
  const [clock, setClock] = useState(Date.now());
  const initializedRef = useRef(false);
  const lastTickRef = useRef(Date.now());

  useEffect(() => {
    if (isLoading || initializedRef.current) {
      return;
    }

    const normalized = normalizeGameState(data);
    const { offlineIncome, elapsedSeconds } = calculateOfflineIncome(normalized);
    const hydrated = unlockSkinIfNeeded({
      ...normalized,
      credits: normalized.credits + offlineIncome,
      totalEarned: normalized.totalEarned + offlineIncome,
      lastPlayedAt: Date.now()
    });

    setGameState(hydrated);
    setOfflineSummary({
      income: offlineIncome,
      seconds: elapsedSeconds
    });

    if (offlineIncome > 0) {
      setStatus({
        type: "success",
        text: `Оффлайн-дохід: +${offlineIncome} кредитів за ${elapsedSeconds} c.`
      });
    } else {
      setStatus({
        type: "info",
        text: "Прогрес успішно відновлено з IndexedDB."
      });
    }

    lastTickRef.current = Date.now();
    initializedRef.current = true;
  }, [data, isLoading]);

  useEffect(() => {
    if (!initializedRef.current) {
      return;
    }

    const snapshot = {
      ...gameState,
      lastPlayedAt: Date.now()
    };

    persist(snapshot);
  }, [gameState, persist]);

  useEffect(() => {
    if (!initializedRef.current) {
      return;
    }

    const timerId = window.setInterval(() => {
      const now = Date.now();
      setClock(now);

      setGameState((currentState) => {
        let nextState = currentState;
        let changed = false;
        const elapsedTicks = Math.floor((now - lastTickRef.current) / 1000);

        if (elapsedTicks > 0) {
          for (let tickIndex = 0; tickIndex < elapsedTicks; tickIndex += 1) {
            const tickTime = lastTickRef.current + 1000 * (tickIndex + 1);

            if (nextState.activeBoosterUntil && nextState.activeBoosterUntil <= tickTime) {
              nextState = {
                ...nextState,
                activeBoosterUntil: 0
              };
              changed = true;
            }

            if (nextState.antiBonus && nextState.antiBonus.endsAt <= tickTime) {
              nextState = {
                ...nextState,
                antiBonus: null
              };
              changed = true;
            }

            const tickBreakdown = getPassiveTickBreakdown(nextState, tickTime);

            if (tickBreakdown.totalIncome > 0 || tickBreakdown.autoClicks > 0) {
              nextState = {
                ...nextState,
                credits: nextState.credits + tickBreakdown.totalIncome,
                totalEarned: nextState.totalEarned + tickBreakdown.totalIncome,
                totalClicks: nextState.totalClicks + tickBreakdown.autoClicks
              };
              changed = true;
            }
          }

          lastTickRef.current += elapsedTicks * 1000;
        }

        if (nextState.activeBoosterUntil && nextState.activeBoosterUntil <= now) {
          nextState = {
            ...nextState,
            activeBoosterUntil: 0
          };
          changed = true;
        }

        if (nextState.antiBonus && nextState.antiBonus.endsAt <= now) {
          nextState = {
            ...nextState,
            antiBonus: null
          };
          changed = true;
        }

        return changed ? unlockSkinIfNeeded(nextState) : currentState;
      });
    }, 250);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  const buyUpgrade = (upgradeId) => {
    setGameState((currentState) => {
      if (isAntiBonusActive(currentState, "virus")) {
        setStatus({
          type: "error",
          text: "Virus блокує магазин апгрейдів."
        });
        return currentState;
      }

      const currentLevel = currentState.upgrades[upgradeId];
      const cost = getUpgradeCost(upgradeId, currentLevel);

      if (currentState.credits < cost) {
        setStatus({
          type: "warning",
          text: "Недостатньо кредитів для купівлі апгрейду."
        });
        return currentState;
      }

      const nextState = {
        ...currentState,
        credits: currentState.credits - cost,
        upgrades: {
          ...currentState.upgrades,
          [upgradeId]: currentLevel + 1
        }
      };

      setStatus({
        type: "success",
        text: `Апгрейд ${UPGRADE_CONFIG[upgradeId].label} куплено.`
      });

      return nextState;
    });
  };

  const clickMainButton = () => {
    setGameState((currentState) => {
      if (isAntiBonusActive(currentState, "ddos")) {
        setStatus({
          type: "error",
          text: "DDoS блокує ручні кліки."
        });
        return currentState;
      }

      const now = Date.now();
      const { reward, criticalHit, nextComboStreak } = getManualClickReward(currentState, now);
      const nextState = unlockSkinIfNeeded({
        ...currentState,
        credits: currentState.credits + reward,
        totalEarned: currentState.totalEarned + reward,
        totalClicks: currentState.totalClicks + 1,
        comboStreak: nextComboStreak,
        lastManualClickAt: now
      });

      setStatus({
        type: criticalHit ? "success" : "info",
        text: criticalHit
          ? `Критичний клік! +${reward} кредитів.`
          : `Клік приніс +${reward} кредитів.`
      });

      return nextState;
    });
  };

  const openCase = () => {
    setGameState((currentState) => {
      if (isAntiBonusActive(currentState, "virus")) {
        setStatus({
          type: "error",
          text: "Virus блокує відкриття кейсів."
        });
        return currentState;
      }

      if (currentState.credits < CASE_COST) {
        setStatus({
          type: "warning",
          text: "Недостатньо кредитів для відкриття кейса."
        });
        return currentState;
      }

      const reward = drawCaseReward();
      const paidState = {
        ...currentState,
        credits: currentState.credits - CASE_COST,
        casesOpened: currentState.casesOpened + 1
      };

      return applyReward(paidState, reward, setStatus);
    });
  };

  const spinWheel = () => {
    setGameState((currentState) => {
      if (isAntiBonusActive(currentState, "virus")) {
        setStatus({
          type: "error",
          text: "Virus блокує колесо фортуни."
        });
        return currentState;
      }

      if (currentState.credits < WHEEL_COST) {
        setStatus({
          type: "warning",
          text: "Недостатньо кредитів для запуску колеса фортуни."
        });
        return currentState;
      }

      const reward = drawWheelReward();
      const paidState = {
        ...currentState,
        credits: currentState.credits - WHEEL_COST,
        spinsUsed: currentState.spinsUsed + 1
      };

      return applyReward(paidState, reward, setStatus);
    });
  };

  const activateBooster = () => {
    setGameState((currentState) => {
      if (currentState.boosters <= 0) {
        setStatus({
          type: "warning",
          text: "Немає бустерів для активації."
        });
        return currentState;
      }

      const nextUntil = Date.now() + getBoosterDurationMs();
      setStatus({
        type: "success",
        text: "Бустер активовано на 30 секунд."
      });

      return {
        ...currentState,
        boosters: currentState.boosters - 1,
        activeBoosterUntil: nextUntil
      };
    });
  };

  const buyOrApplySkin = (skinId) => {
    setGameState((currentState) => {
      if (isAntiBonusActive(currentState, "virus")) {
        setStatus({
          type: "error",
          text: "Virus блокує зміну та купівлю скінів."
        });
        return currentState;
      }

      if (currentState.skinsUnlocked.includes(skinId)) {
        setStatus({
          type: "success",
          text: `Скін ${SKINS[skinId].label} застосовано.`
        });

        return {
          ...currentState,
          activeSkin: skinId
        };
      }

      const unlockRule = SKINS[skinId].unlock;

      if (unlockRule.type === "credits") {
        if (currentState.credits < unlockRule.value) {
          setStatus({
            type: "warning",
            text: "Недостатньо кредитів для відкриття цього скіна."
          });
          return currentState;
        }

        setStatus({
          type: "success",
          text: `Скін ${SKINS[skinId].label} куплено і застосовано.`
        });

        return {
          ...currentState,
          credits: currentState.credits - unlockRule.value,
          skinsUnlocked: [...currentState.skinsUnlocked, skinId],
          activeSkin: skinId
        };
      }

      setStatus({
        type: "warning",
        text: "Цей скин відкривається автоматично через прогрес."
      });
      return currentState;
    });
  };

  const prestige = () => {
    setGameState((currentState) => {
      const reward = getPrestigeReward(currentState.totalEarned);

      if (reward <= 0) {
        setStatus({
          type: "warning",
          text: "Недостатньо загального доходу для престижу."
        });
        return currentState;
      }

      const baseState = createDefaultGameState();
      const nextState = unlockSkinIfNeeded({
        ...baseState,
        duiktcoins: currentState.duiktcoins + reward,
        skinsUnlocked: currentState.skinsUnlocked,
        activeSkin: currentState.activeSkin
      });

      setStatus({
        type: "success",
        text: `Престиж виконано. Отримано ${reward} Duiktcoins.`
      });

      lastTickRef.current = Date.now();
      return nextState;
    });
  };

  const derived = useMemo(() => {
    const nextPrestigeReward = getPrestigeReward(gameState.totalEarned);
    const boosterSeconds = getRemainingSeconds(gameState.activeBoosterUntil, clock);
    const antiBonusText = getAntiBonusCountdownText(gameState, clock);

    return {
      nextPrestigeReward,
      boosterSeconds,
      antiBonusText,
      prestigeMultiplier: getPrestigeMultiplier(gameState.duiktcoins),
      clickValue: getManualBaseClickValue(gameState.upgrades),
      autoClicksPerSecond: getAutoClicksPerSecond(gameState.upgrades),
      autoIncomePerSecond: getAutoClickIncome(gameState, clock),
      passiveIncomePerSecond: getPassiveIncome(gameState, clock),
      totalIncomePerSecond: getPassiveTickBreakdown(gameState, clock).totalIncome,
      isVirusActive: isAntiBonusActive(gameState, "virus", clock),
      isDdosActive: isAntiBonusActive(gameState, "ddos", clock),
      isGlitchActive: isAntiBonusActive(gameState, "glitch", clock),
      comboWindowMs: COMBO_WINDOW_MS
    };
  }, [clock, gameState]);

  const upgradeCards = useMemo(
    () =>
      Object.values(UPGRADE_CONFIG).map((upgrade) => ({
        ...upgrade,
        level: gameState.upgrades[upgrade.id],
        cost: getUpgradeCost(upgrade.id, gameState.upgrades[upgrade.id])
      })),
    [gameState.upgrades]
  );

  const skinCards = useMemo(
    () =>
      Object.values(SKINS).map((skin) => ({
        ...skin,
        unlocked: gameState.skinsUnlocked.includes(skin.id),
        active: gameState.activeSkin === skin.id
      })),
    [gameState.activeSkin, gameState.skinsUnlocked]
  );

  return {
    gameState,
    isReady: initializedRef.current,
    isLoading,
    storageError,
    status,
    offlineSummary,
    derived,
    upgradeCards,
    skinCards,
    actions: {
      buyUpgrade,
      clickMainButton,
      openCase,
      spinWheel,
      activateBooster,
      buyOrApplySkin,
      prestige
    }
  };
}