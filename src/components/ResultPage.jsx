import { useMemo, useState } from 'react';
import styles from './ResultPage.module.css';
import MenuCard from './MenuCard';

function buildShareText(profile, weatherContext, result) {
  const head = `${profile.name || '익명'}님의 배고픔 분석 결과`;
  const env = `현재 ${weatherContext.city}, ${weatherContext.temp}°C, ${weatherContext.weatherStatus}`;
  const reason = `이유: ${result.reason}`;
  const recommendation = `지금 추천 메뉴: ${result.recommendation.menu} - ${result.recommendation.why}`;
  const links = Array.isArray(result.recommendation.links)
    ? result.recommendation.links.map((link, index) => `${index + 1}. ${link.label}: ${link.url}`).join('\n')
    : '';

  return [head, env, reason, recommendation, links ? `가게 찾기 링크\n${links}` : '']
    .filter(Boolean)
    .join('\n\n');
}

export default function ResultPage({ profile, weatherContext, result, onRestart }) {
  const [statusMessage, setStatusMessage] = useState('');

  const shareText = useMemo(
    () => buildShareText(profile, weatherContext, result),
    [profile, weatherContext, result]
  );

  const fallbackCopy = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', 'true');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();

    let copied = false;
    try {
      copied = document.execCommand('copy');
    } catch (_error) {
      copied = false;
    }

    document.body.removeChild(textarea);
    return copied;
  };

  const copyToClipboard = async (text) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    return fallbackCopy(text);
  };

  const handleCopy = async () => {
    try {
      const copied = await copyToClipboard(shareText);
      if (!copied) {
        setStatusMessage('복사에 실패했어요. 브라우저 권한을 확인해 주세요.');
        return;
      }
      setStatusMessage('결과 텍스트를 복사했어요.');
    } catch (_error) {
      setStatusMessage('복사에 실패했어요. 브라우저 권한을 확인해 주세요.');
    }
  };

  const handleShare = async () => {
    try {
      if (!navigator.share) {
        const copied = await copyToClipboard(shareText);
        setStatusMessage(
          copied
            ? '이 브라우저는 공유 기능이 없어 결과 텍스트를 대신 복사했어요.'
            : '이 브라우저는 공유 기능을 지원하지 않아요.'
        );
        return;
      }

      await navigator.share({
        title: '오늘은 왜 배고프지? 결과',
        text: shareText,
      });

      setStatusMessage('공유 완료!');
    } catch (_error) {
      setStatusMessage('공유가 취소되었거나 실패했어요. 필요하면 복사 버튼을 사용해 주세요.');
    }
  };

  return (
    <section className={styles.panel}>
      <h2>Step 4. 분석 결과</h2>
      <p className={styles.context}>
        {weatherContext.city} · {weatherContext.temp}°C · {weatherContext.weatherStatus} · {weatherContext.time}{' '}
        {weatherContext.dayOfWeek}
      </p>

      <article className={styles.reasonBox}>
        <h3>왜 지금 배고플까?</h3>
        <p>{result.reason}</p>
      </article>

      <div className={styles.menuSection}>
        <h3>지금 먹기 추천 메뉴 (지역 반영)</h3>
        <div className={styles.cardGrid}>
          <MenuCard
            title={result.recommendation.menu}
            reason={result.recommendation.why}
            tone="now"
            links={result.recommendation.links}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={handleCopy}>
          결과 복사
        </button>
        <button type="button" onClick={handleShare}>
          공유하기
        </button>
        <button type="button" onClick={onRestart} className={styles.restartButton}>
          다시 분석
        </button>
      </div>

      {statusMessage ? <p className={styles.status}>{statusMessage}</p> : null}
    </section>
  );
}
