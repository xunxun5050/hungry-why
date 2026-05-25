import { useState } from 'react';

const STORAGE_KEY = 'hungry-why-profile-v1';

function loadProfile(defaultProfile) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProfile;

    const parsed = JSON.parse(raw);
    return {
      ...defaultProfile,
      ...parsed,
    };
  } catch (_error) {
    return defaultProfile;
  }
}

export function useProfile(defaultProfile) {
  const [profile, setProfile] = useState(() => loadProfile(defaultProfile));

  const saveProfile = (nextProfile) => {
    setProfile(nextProfile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProfile));
  };

  return {
    profile,
    saveProfile,
  };
}
