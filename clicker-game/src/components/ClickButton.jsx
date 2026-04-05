import styles from "./ClickButton.module.css";

export default function ClickButton({
  disabled,
  onClick,
  comboWindowMs,
  comboStreak,
  clickValue,
  totalIncomePerSecond
}) {
  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.button}
        onClick={onClick}
        disabled={disabled}
      >
        Заробити кредити
      </button>
      <div className={styles.meta}>
        <span>Базовий ручний клік: +{clickValue}</span>
        <span>Авто та пасивно: +{totalIncomePerSecond}/с</span>
        <span>Combo тримається {comboWindowMs / 1000} с</span>
        <span>Поточна серія: {comboStreak}</span>
      </div>
    </div>
  );
}