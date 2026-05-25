import styles from './MenuCard.module.css';

const TONE_EMOJI = {
  lunch: '🍱',
  dinner: '🌙',
  now: '🍽️',
};

export default function MenuCard({ title, reason, tone }) {
  return (
    <article className={styles.card}>
      <h4>
        <span>{TONE_EMOJI[tone] ?? '🍽️'}</span>
        <span>{title}</span>
      </h4>
      <p>{reason}</p>
    </article>
  );
}
