import { useEffect, useMemo, useState } from 'react';
import styles from './ProfileForm.module.css';

const JOB_OPTIONS = ['사무직', '개발자', '학생', '서비스직', '크리에이터', '자영업', '기타'];

function normalizeProfile(initialValue) {
  return {
    name: initialValue.name ?? '',
    gender: initialValue.gender ?? 'none',
    age: initialValue.age ?? 29,
    jobCategory: initialValue.jobCategory ?? '사무직',
    jobDetail: initialValue.jobDetail ?? '',
    lastMealHours: initialValue.lastMealHours ?? 4,
    hungerLevel: initialValue.hungerLevel ?? 3,
  };
}

function genderLabel(gender) {
  if (gender === 'male') return '남';
  if (gender === 'female') return '여';
  return '선택 안 함';
}

export default function ProfileForm({ initialValue, onSubmit }) {
  const [form, setForm] = useState(() => normalizeProfile(initialValue));
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(normalizeProfile(initialValue));
  }, [initialValue]);

  const lastMealText = useMemo(() => `${form.lastMealHours}시간 전`, [form.lastMealHours]);

  const handleField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError('이름은 꼭 입력해 주세요.');
      return;
    }

    const age = Number(form.age);
    if (!Number.isFinite(age) || age < 1 || age > 120) {
      setError('나이는 1세에서 120세 사이로 입력해 주세요.');
      return;
    }

    setError('');

    onSubmit({
      ...form,
      name: form.name.trim(),
      age,
      lastMealHours: Number(form.lastMealHours),
      hungerLevel: Number(form.hungerLevel),
      jobDetail: form.jobDetail.trim(),
    });
  };

  return (
    <section className={styles.panel}>
      <h2>Step 1. 프로필을 알려주세요</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span>이름 *</span>
          <input
            type="text"
            value={form.name}
            onChange={(event) => handleField('name', event.target.value)}
            placeholder="예: 제이드"
            required
          />
        </label>

        <div className={styles.field}>
          <span>성별 (선택)</span>
          <div className={styles.genderRow}>
            {[
              { value: 'male', label: '남' },
              { value: 'female', label: '여' },
              { value: 'none', label: '선택 안 함' },
            ].map((item) => (
              <button
                type="button"
                key={item.value}
                onClick={() => handleField('gender', item.value)}
                className={`${styles.genderButton} ${form.gender === item.value ? styles.selected : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <label className={styles.field}>
          <span>나이 *</span>
          <input
            type="number"
            min="1"
            max="120"
            value={form.age}
            onChange={(event) => handleField('age', event.target.value)}
            required
          />
        </label>

        <label className={styles.field}>
          <span>하는 일 (선택)</span>
          <div className={styles.jobGroupRow}>
            <select
              value={form.jobCategory}
              onChange={(event) => handleField('jobCategory', event.target.value)}
            >
              {JOB_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={form.jobDetail}
              onChange={(event) => handleField('jobDetail', event.target.value)}
              placeholder="예: 프론트엔드 개발"
            />
          </div>
        </label>

        <label className={styles.field}>
          <span>마지막 식사: {lastMealText}</span>
          <input
            type="range"
            min="0"
            max="12"
            step="1"
            value={form.lastMealHours}
            onChange={(event) => handleField('lastMealHours', event.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span>배고픔 강도: {form.hungerLevel}/5</span>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={form.hungerLevel}
            onChange={(event) => handleField('hungerLevel', event.target.value)}
          />
        </label>

        <div className={styles.summary}>
          <strong>{form.name || '익명'}</strong> · {genderLabel(form.gender)} · {form.age}세 ·{' '}
          {form.jobDetail ? `${form.jobCategory} (${form.jobDetail})` : form.jobCategory}
        </div>

        {error ? <p className={styles.error}>{error}</p> : null}

        <button type="submit" className={styles.submitButton}>
          위치와 날씨 수집 시작
        </button>
      </form>
    </section>
  );
}
