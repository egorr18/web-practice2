import styles from "./ResourcePanel.module.css";

export default function ResourcePanel({
  credits,
  duiktcoins,
  boosters,
  totalClicks,
  totalEarned,
  offlineSummary,
  prestigeReward,
  boosterSeconds,
  clickValue,
  autoClicksPerSecond,
  autoIncomePerSecond,
  passiveIncomePerSecond,
  totalIncomePerSecond
}) {
  const items = [
    { label: "Кредити", value: credits },
    { label: "Duiktcoins", value: duiktcoins },
    { label: "Бустери", value: boosters },
    { label: "Усього кліків", value: totalClicks },
    { label: "Загальний дохід", value: totalEarned },
    { label: "Наступний престиж", value: prestigeReward }
  ];

  const rates = [
    { label: "Клік вручну", value: `+${clickValue}` },
    { label: "Автокліки/с", value: autoClicksPerSecond },
    { label: "Автодохід/с", value: `+${autoIncomePerSecond}` },
    { label: "Пасивний дохід/с", value: `+${passiveIncomePerSecond}` },
    { label: "Усього дохід/с", value: `+${totalIncomePerSecond}` }
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {items.map((item) => (
          <article key={item.label} className={styles.stat}>
            <span className={styles.label}>{item.label}</span>
            <strong className={styles.value}>{item.value}</strong>
          </article>
        ))}
      </div>

      <div className={styles.rateGrid}>
        {rates.map((item) => (
          <article key={item.label} className={styles.rate}>
            <span className={styles.label}>{item.label}</span>
            <strong className={styles.rateValue}>{item.value}</strong>
          </article>
        ))}
      </div>

      <div className={styles.meta}>
        <span>Останній оффлайн-дохід: +{offlineSummary.income}</span>
        <span>Оффлайн-час: {offlineSummary.seconds} c</span>
        <span>Бустер: {boosterSeconds > 0 ? `${boosterSeconds} c` : "неактивний"}</span>
      </div>
    </div>
  );
}