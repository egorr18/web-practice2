import styles from "./UpgradeShop.module.css";

export default function UpgradeShop({ items, credits, onBuy, locked }) {
  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <article key={item.id} className={styles.card}>
          <div className={styles.body}>
            <h3 className={styles.title}>{item.label}</h3>
            <p className={styles.description}>{item.description}</p>
          </div>
          <div className={styles.footer}>
            <div className={styles.meta}>
              <span>Рівень: {item.level}</span>
              <span>Ціна: {item.cost}</span>
            </div>
            <button
              type="button"
              className={styles.button}
              onClick={() => onBuy(item.id)}
              disabled={locked || credits < item.cost}
            >
              Купити
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
