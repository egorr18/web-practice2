import styles from "./StatusPanel.module.css";

export default function StatusPanel({ status, antiBonusText, storageError }) {
  return (
    <div className={styles.wrapper}>
      <div className={`${styles.message} ${styles[status.type] ?? styles.info}`}>
        <strong>Статус:</strong> {status.text}
      </div>
      <div className={styles.meta}>
        <span>{antiBonusText}</span>
        {storageError ? <span className={styles.storageError}>{storageError}</span> : null}
      </div>
    </div>
  );
}
