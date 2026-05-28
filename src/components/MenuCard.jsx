import styles from './MenuCard.module.css';

const TONE_EMOJI = {
  lunch: '🍱',
  dinner: '🌙',
  now: '🍽️',
};

export default function MenuCard({
  title,
  reason,
  tone,
  storeType = 'domestic',
  storeLinks = [],
  famousStores = [],
}) {
  const hasDomesticLinks = storeType === 'domestic' && Array.isArray(storeLinks) && storeLinks.length;
  const hasOverseasStores = storeType === 'overseas' && Array.isArray(famousStores) && famousStores.length;

  return (
    <article className={styles.card}>
      <h4>
        <span>{TONE_EMOJI[tone] ?? '🍽️'}</span>
        <span>{title}</span>
      </h4>
      <p>{reason}</p>
      {hasDomesticLinks ? (
        <div className={styles.links}>
          {storeLinks.slice(0, 2).map((store) => (
            <a key={`${store.name}-${store.url}`} href={store.url} target="_blank" rel="noreferrer">
              {store.name}
            </a>
          ))}
        </div>
      ) : null}
      {hasOverseasStores ? (
        <div className={styles.famousStores}>
          {famousStores.slice(0, 2).map((storeName) => (
            <span key={storeName}>{storeName}</span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
