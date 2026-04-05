import styles from "./BonusPanel.module.css";

export default function BonusPanel({
  credits,
  boosters,
  caseCost,
  wheelCost,
  onOpenCase,
  onSpinWheel,
  onActivateBooster,
  locked
}) {
  const actions = [
    {
      title: "Кейс",
      description: "Може дати кредити, бустер, Duiktcoin або антибонус.",
      button: `Відкрити за ${caseCost}`,
      disabled: locked || credits < caseCost,
      onClick: onOpenCase
    },
    {
      title: "Колесо фортуни",
      description: "Дає рідкісні нагороди або може запустити антибонус.",
      button: `Крутити за ${wheelCost}`,
      disabled: locked || credits < wheelCost,
      onClick: onSpinWheel
    },
    {
      title: "Бустер",
      description: "Подвоює весь дохід на 30 секунд.",
      button: `Активувати (${boosters})`,
      disabled: boosters <= 0,
      onClick: onActivateBooster
    }
  ];

  return (
    <div className={styles.grid}>
      {actions.map((item) => (
        <article key={item.title} className={styles.card}>
          <h3 className={styles.title}>{item.title}</h3>
          <p className={styles.description}>{item.description}</p>
          <button
            type="button"
            className={styles.button}
            disabled={item.disabled}
            onClick={item.onClick}
          >
            {item.button}
          </button>
        </article>
      ))}
    </div>
  );
}
