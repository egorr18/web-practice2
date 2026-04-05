import styles from "./SkinPanel.module.css";

export default function SkinPanel({ items, onSelect, locked }) {
  return (
    <div className={styles.grid}>
      {items.map((item) => {
        const unlock = item.unlock.type === "credits"
          ? `Купити за ${item.unlock.value}`
          : item.unlock.type === "clicks"
            ? `Відкрити за ${item.unlock.value} кліків`
            : item.unlock.type === "duiktcoins"
              ? `Відкрити за ${item.unlock.value} Duiktcoins`
              : "Доступний одразу";

        return (
          <article key={item.id} className={styles.card}>
            <div className={styles.top}>
              <h3 className={styles.title}>{item.label}</h3>
              <span className={styles.badge}>
                {item.active ? "Активний" : item.unlocked ? "Відкритий" : "Закритий"}
              </span>
            </div>
            <p className={styles.description}>{item.description}</p>
            <p className={styles.unlock}>{unlock}</p>
            <button
              type="button"
              className={styles.button}
              onClick={() => onSelect(item.id)}
              disabled={locked || (item.active && item.unlocked)}
            >
              {item.unlocked ? "Застосувати" : "Відкрити"}
            </button>
          </article>
        );
      })}
    </div>
  );
}
