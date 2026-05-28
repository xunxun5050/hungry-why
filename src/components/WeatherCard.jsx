import { useMemo, useState } from 'react';
import styles from './WeatherCard.module.css';
import { getWeatherByCity } from '../services/weather';

const STATUS_TEXT = {
  idle: '도시명을 입력해 주세요',
  weatherLoading: '날씨 정보를 가져오는 중이에요',
  ready: '수집 완료',
  error: '조회 실패',
};

function currentTimeContext() {
  const now = new Date();
  return {
    time: now.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
    dayOfWeek: now.toLocaleDateString('ko-KR', { weekday: 'long' }),
  };
}

function buildSnapshot(weather) {
  const { time, dayOfWeek } = currentTimeContext();

  return {
    city: weather.city,
    temp: weather.temp,
    weatherStatus: weather.weatherStatus,
    humidity: weather.humidity,
    time,
    dayOfWeek,
    source: '도시명 입력 + Geocoding + Open-Meteo',
  };
}

export default function WeatherCard({ onConfirm }) {
  const [status, setStatus] = useState('idle');
  const [snapshot, setSnapshot] = useState(null);
  const [manualCity, setManualCity] = useState('');
  const [error, setError] = useState('');

  const handleManualFetch = async (event) => {
    event.preventDefault();

    const city = manualCity.trim();

    if (!city) {
      setStatus('error');
      setError('도시명을 입력해 주세요.');
      return;
    }

    setError('');
    setStatus('weatherLoading');

    try {
      const weather = await getWeatherByCity(city);
      setSnapshot(buildSnapshot(weather));
      setStatus('ready');
    } catch (fetchError) {
      setStatus('error');
      setSnapshot(null);
      setError(fetchError instanceof Error ? fetchError.message : '도시명 조회에 실패했어요.');
    }
  };

  const statusText = useMemo(() => STATUS_TEXT[status] ?? '확인 중', [status]);

  return (
    <section className={styles.panel}>
      <h2>Step 2. 위치와 날씨 확인</h2>

      <p className={styles.status}>
        상태: <strong>{statusText}</strong>
      </p>

      <form className={styles.controls} onSubmit={handleManualFetch}>
        <label className={styles.inlineForm}>
          <input
            type="text"
            value={manualCity}
            onChange={(event) => setManualCity(event.target.value)}
            placeholder="예: 서울, 도쿄, Busan"
          />
          <button type="submit">오늘 날씨 불러오기</button>
        </label>

        <p className={styles.helper}>
          도시명을 입력하면 Geocoding API로 좌표를 찾고, Open-Meteo로 오늘 날씨와 기온을 조회합니다.
        </p>
      </form>

      {error ? <p className={styles.error}>{error}</p> : null}

      {snapshot ? (
        <article className={styles.card}>
          <p className={styles.source}>수집 방식: {snapshot.source}</p>

          <div className={styles.grid}>
            <div>
              <span>도시</span>
              <strong>{snapshot.city}</strong>
            </div>
            <div>
              <span>기온</span>
              <strong>{snapshot.temp}°C</strong>
            </div>
            <div>
              <span>날씨 상태</span>
              <strong>{snapshot.weatherStatus}</strong>
            </div>
            <div>
              <span>습도</span>
              <strong>{snapshot.humidity}%</strong>
            </div>
            <div>
              <span>현재 시각</span>
              <strong>{snapshot.time}</strong>
            </div>
            <div>
              <span>요일</span>
              <strong>{snapshot.dayOfWeek}</strong>
            </div>
          </div>

          <button type="button" className={styles.primaryButton} onClick={() => onConfirm(snapshot)}>
            다음: 배고픔 분석 시작
          </button>
        </article>
      ) : (
        <p className={styles.notice}>도시명을 입력하고 날씨를 불러오면 다음 단계로 진행할 수 있어요.</p>
      )}
    </section>
  );
}
