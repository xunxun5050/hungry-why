import { useState } from 'react';
import styles from './App.module.css';
import ProfileForm from './components/ProfileForm';
import WeatherCard from './components/WeatherCard';
import LoadingScreen from './components/LoadingScreen';
import ResultPage from './components/ResultPage';
import { useProfile } from './hooks/useProfile';
import { analyzeHungerWithClaude } from './services/claude';

const STEP_LABELS = ['프로필 입력', '위치 & 날씨', '배고픔 분석', '결과'];

const DEFAULT_PROFILE = {
  name: '',
  gender: 'none',
  age: 29,
  jobCategory: '사무직',
  jobDetail: '',
  lastMealHours: 4,
  hungerLevel: 3,
};

function App() {
  const { profile, saveProfile } = useProfile(DEFAULT_PROFILE);
  const [step, setStep] = useState(1);
  const [currentProfile, setCurrentProfile] = useState(profile);
  const [weatherContext, setWeatherContext] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [analysisError, setAnalysisError] = useState('');
  const [streamText, setStreamText] = useState('');

  const handleProfileSubmit = (nextProfile) => {
    saveProfile(nextProfile);
    setCurrentProfile(nextProfile);
    setWeatherContext(null);
    setAnalysis(null);
    setAnalysisError('');
    setStep(2);
  };

  const handleWeatherConfirm = async (context) => {
    setWeatherContext(context);
    setAnalysisError('');
    setStreamText('');
    setStep(3);

    try {
      const result = await analyzeHungerWithClaude({
        profile: currentProfile,
        context,
        onStream: setStreamText,
      });

      setAnalysis(result);
      setStep(4);
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : '배고픔 분석 중 오류가 발생했습니다.');
      setStep(2);
    }
  };

  const handleRestart = () => {
    setStep(1);
    setAnalysis(null);
    setWeatherContext(null);
    setAnalysisError('');
    setStreamText('');
  };

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.badge}>오늘의 배고픔 진단소</p>
        <h1>오늘은 왜 배고프지?</h1>
        <p className={styles.subtitle}>프로필과 날씨를 모아 분석 엔진이 이유를 해석하고 지금 타이밍에 맞는 메뉴를 추천해드려요.</p>
        <div className={styles.stepRow}>
          {STEP_LABELS.map((label, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === step;
            const isPassed = stepNumber < step;

            return (
              <div
                key={label}
                className={`${styles.stepChip} ${isActive ? styles.active : ''} ${
                  isPassed ? styles.passed : ''
                }`}
              >
                <span className={styles.stepIndex}>{stepNumber}</span>
                <span>{label}</span>
              </div>
            );
          })}
        </div>
      </header>

      <main className={styles.main}>
        {step === 2 && analysisError ? <p className={styles.errorBanner}>{analysisError}</p> : null}

        {step === 1 ? (
          <ProfileForm initialValue={currentProfile} onSubmit={handleProfileSubmit} />
        ) : null}

        {step === 2 ? <WeatherCard onConfirm={handleWeatherConfirm} /> : null}

        {step === 3 ? <LoadingScreen name={currentProfile.name} streamText={streamText} /> : null}

        {step === 4 && analysis && weatherContext ? (
          <ResultPage
            profile={currentProfile}
            weatherContext={weatherContext}
            result={analysis}
            onRestart={handleRestart}
          />
        ) : null}
      </main>
    </div>
  );
}

export default App;
