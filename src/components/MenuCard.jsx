import styles from './MenuCard.module.css';

const TONE_EMOJI = {
  lunch: '🍱',
  dinner: '🌙',
  now: '🍽️',
};

export default function MenuCard({ title, reason, tone, links = [] }) {
  return (
    <article className={styles.card}>
      <h4>
        <span>{TONE_EMOJI[tone] ?? '🍽️'}</span>
        <span>{title}</span>
      </h4>
      <p>{reason}</p>
      {Array.isArray(links) && links.length ? (
        <div className={styles.links}>
          {links.slice(0, 2).map((link) => (
            <a key={`${link.label}-${link.url}`} href={link.url} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
        </div>
      ) : null}
    </article>
  );
}
