export function getCurrentPosition(options = {}) {
  if (!navigator.geolocation) {
    throw new Error('이 브라우저에서는 위치 수집을 지원하지 않습니다.');
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      resolve,
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(new Error('위치 권한이 거부되어 자동 감지를 진행할 수 없어요.'));
          return;
        }

        reject(new Error('위치 자동 감지에 실패했어요. 도시명으로 조회해 주세요.'));
      },
      {
        enableHighAccuracy: false,
        timeout: 8_000,
        maximumAge: 600_000,
        ...options,
      }
    );
  });
}
