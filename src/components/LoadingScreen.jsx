import { useEffect, useMemo, useState } from 'react';
import styles from './LoadingScreen.module.css';

const PHRASES = [
  '냉장고와 마음의 온도를 동시에 재는 중...',
  '배고픔 센서가 마지막 식사 흔적을 추적 중...',
  '오늘의 기분과 날씨를 메뉴 언어로 번역 중...',
  '지금 가장 먹고 싶은 한 끼를 계산하는 중...',
  '한 끼의 행복 확률을 높이는 중...',
];

export default function LoadingScreen({ name, streamText }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timerId = setInterval(() => {
      setIndex((prev) => (prev + 1) % PHRASES.length);
    }, 1800);

    return () => clearInterval(timerId);
  }, []);

  const preview = useMemo(() => {
    if (!streamText) return '';
    return streamText.length > 220 ? `${streamText.slice(0, 220)}...` : streamText;
  }, [streamText]);

  return (
    <section className={styles.panel}>
      <div className={styles.spinner} aria-hidden="true" />
      <h2>{name || '사용자'} 님을 위한 배고픔 분석 중</h2>
      <p className={styles.phrase}>{PHRASES[index]}</p>

      {preview ? (
        <article className={styles.preview}>
          <h3>실시간 생성 미리보기</h3>
          <p>{preview}</p>
        </article>
      ) : null}
    </section>
  );
}
