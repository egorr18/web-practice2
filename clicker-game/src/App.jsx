import styles from "./App.module.css";
import SectionCard from "./components/SectionCard.jsx";
import ResourcePanel from "./components/ResourcePanel.jsx";
import ClickButton from "./components/ClickButton.jsx";
import UpgradeShop from "./features/upgrades/UpgradeShop.jsx";
import BonusPanel from "./features/bonuses/BonusPanel.jsx";
import PrestigePanel from "./features/prestige/PrestigePanel.jsx";
import SkinPanel from "./features/skins/SkinPanel.jsx";
import StatusPanel from "./features/status/StatusPanel.jsx";
import { CASE_COST, SKINS, WHEEL_COST } from "./utils/constants.js";
import { useClickerGame } from "./hooks/useClickerGame.js";

export default function App() {
  const {
    gameState,
    isReady,
    isLoading,
    storageError,
    status,
    offlineSummary,
    derived,
    upgradeCards,
    skinCards,
    actions
  } = useClickerGame();

  const appClassName = [
    styles.app,
    styles[`skin_${gameState.activeSkin}`]
  ].join(" ");

  return (
    <div className={appClassName}>
      <div className={styles.shell}>
        <header className={styles.hero}>
          <div>
            <span className={styles.kicker}>Лабораторний проєкт</span>
            <h1 className={styles.title}>Duikt Clicker Game</h1>
            <p className={styles.subtitle}>
              React + Vite SPA з IndexedDB, апгрейдами, бонусами, антибонусами, престижем та скінами.
            </p>
          </div>
          <div className={styles.heroMeta}>
            <span>Стан: {isLoading ? "завантаження" : isReady ? "готово" : "ініціалізація"}</span>
            <span>Тема: {SKINS[gameState.activeSkin].label}</span>
            <span>Дохід/с: +{derived.totalIncomePerSecond}</span>
          </div>
        </header>

        <ResourcePanel
          credits={gameState.credits}
          duiktcoins={gameState.duiktcoins}
          boosters={gameState.boosters}
          totalClicks={gameState.totalClicks}
          totalEarned={gameState.totalEarned}
          offlineSummary={offlineSummary}
          prestigeReward={derived.nextPrestigeReward}
          boosterSeconds={derived.boosterSeconds}
          clickValue={derived.clickValue}
          autoClicksPerSecond={derived.autoClicksPerSecond}
          autoIncomePerSecond={derived.autoIncomePerSecond}
          passiveIncomePerSecond={derived.passiveIncomePerSecond}
          totalIncomePerSecond={derived.totalIncomePerSecond}
        />

        <div className={styles.layout}>
          <div className={styles.primary}>
            <SectionCard
              title="Клік-механіка"
              description="Натискай кнопку, збирай кредити та підтримуй combo."
            >
              <ClickButton
                disabled={derived.isDdosActive}
                onClick={actions.clickMainButton}
                comboWindowMs={derived.comboWindowMs}
                comboStreak={gameState.comboStreak}
                clickValue={derived.clickValue}
                totalIncomePerSecond={derived.totalIncomePerSecond}
              />
            </SectionCard>

            <SectionCard
              title="Апгрейди"
              description="Мінімум 5 апгрейдів із ростом ціни та ефекту."
            >
              <UpgradeShop
                items={upgradeCards}
                credits={gameState.credits}
                onBuy={actions.buyUpgrade}
                locked={derived.isVirusActive}
              />
            </SectionCard>

            <SectionCard
              title="Бонуси та антибонуси"
              description="Кейси, колесо фортуни, бустер і негативні ефекти."
            >
              <BonusPanel
                credits={gameState.credits}
                boosters={gameState.boosters}
                caseCost={CASE_COST}
                wheelCost={WHEEL_COST}
                onOpenCase={actions.openCase}
                onSpinWheel={actions.spinWheel}
                onActivateBooster={actions.activateBooster}
                locked={derived.isVirusActive}
              />
            </SectionCard>
          </div>

          <div className={styles.secondary}>
            <SectionCard
              title="Статус гри"
              description="Повідомлення, таймери та збереження в IndexedDB."
            >
              <StatusPanel
                status={status}
                antiBonusText={derived.antiBonusText}
                storageError={storageError}
              />
            </SectionCard>

            <SectionCard
              title="Престиж"
              description="Скинь прогрес і посиль глобальний множник доходу."
            >
              <PrestigePanel
                reward={derived.nextPrestigeReward}
                multiplier={derived.prestigeMultiplier}
                onPrestige={actions.prestige}
              />
            </SectionCard>

            <SectionCard
              title="Скіни"
              description="Купуй або відкривай теми та зберігай вибір."
            >
              <SkinPanel
                items={skinCards}
                onSelect={actions.buyOrApplySkin}
                locked={derived.isVirusActive}
              />
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}