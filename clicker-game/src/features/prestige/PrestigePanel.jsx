import styles from "./PrestigePanel.module.css";

export default function PrestigePanel({ reward, multiplier, onPrestige }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.info}>
        <h3 className={styles.title}>Престиж</h3>
        <p className={styles.description}>
          Скидає звичайний прогрес і дає Duiktcoins, які назавжди збільшують дохід.
        </p>
        <ul className={styles.list}>
          <li>Поточна винагорода: {reward} Duiktcoins</li>
          <li>Глобальний множник доходу: x{multiplier.toFixed(1)}</li>
        </ul>
      </div>
      <button
        type="button"
        className={styles.button}
        onClick={onPrestige}
        disabled={reward <= 0}
      >
        Виконати престиж
      </button>
    </div>
  );
}
