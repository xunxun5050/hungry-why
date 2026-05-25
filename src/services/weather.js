const GEOCODING_ENDPOINT = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_ENDPOINT = 'https://api.open-meteo.com/v1/forecast';

const WEATHER_LABELS = {
  0: '맑음',
  1: '대체로 맑음',
  2: '약간 흐림',
  3: '흐림',
  45: '안개',
  48: '서리 안개',
  51: '이슬비',
  53: '이슬비',
  55: '강한 이슬비',
  56: '어는 이슬비',
  57: '강한 어는 이슬비',
  61: '약한 비',
  63: '비',
  65: '강한 비',
  66: '어는 비',
  67: '강한 어는 비',
  71: '약한 눈',
  73: '눈',
  75: '강한 눈',
  77: '싸락눈',
  80: '소나기',
  81: '강한 소나기',
  82: '매우 강한 소나기',
  85: '눈 소나기',
  86: '강한 눈 소나기',
  95: '천둥번개',
  96: '우박 동반 천둥번개',
  99: '강한 우박 동반 천둥번개',
};

function weatherLabelFromCode(code) {
  if (code in WEATHER_LABELS) return WEATHER_LABELS[code];
  return '정보 없음';
}

function buildCityLabel(location) {
  const name = location?.name ? String(location.name).trim() : '';
  const country = location?.country ? String(location.country).trim() : '';

  if (name && country && country.toLowerCase() !== name.toLowerCase()) {
    return `${name}, ${country}`;
  }

  return name || country || '도시 정보 없음';
}

async function geocodeCity(city) {
  const url = new URL(GEOCODING_ENDPOINT);
  url.searchParams.set('name', city);
  url.searchParams.set('count', '1');
  url.searchParams.set('language', 'ko');
  url.searchParams.set('format', 'json');

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('도시 정보를 찾지 못했어요. 도시명을 다시 확인해 주세요.');
  }

  const data = await response.json();
  const location = data?.results?.[0];

  if (!location) {
    throw new Error('입력한 도시를 찾을 수 없어요. 영어/현지 표기로 다시 시도해 주세요.');
  }

  return {
    city: buildCityLabel(location),
    latitude: location.latitude,
    longitude: location.longitude,
  };
}

async function requestWeatherByCoords(latitude, longitude) {
  const url = new URL(FORECAST_ENDPOINT);
  url.searchParams.set('latitude', String(latitude));
  url.searchParams.set('longitude', String(longitude));
  url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,weather_code');
  url.searchParams.set('timezone', 'auto');

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('날씨 정보를 가져오지 못했어요. 잠시 후 다시 시도해 주세요.');
  }

  const data = await response.json();
  const current = data?.current;

  if (!current) {
    throw new Error('현재 날씨 데이터가 없어요. 잠시 후 다시 시도해 주세요.');
  }

  return {
    temp: Math.round(current.temperature_2m),
    humidity: Math.round(current.relative_humidity_2m),
    weatherStatus: weatherLabelFromCode(current.weather_code),
  };
}

export async function getWeatherByCoords(latitude, longitude) {
  return requestWeatherByCoords(latitude, longitude);
}

export async function getWeatherByCity(city) {
  const normalizedCity = String(city ?? '').trim();

  if (!normalizedCity) {
    throw new Error('도시명을 입력해 주세요.');
  }

  const location = await geocodeCity(normalizedCity);
  const weather = await requestWeatherByCoords(location.latitude, location.longitude);

  return {
    city: location.city,
    temp: weather.temp,
    humidity: weather.humidity,
    weatherStatus: weather.weatherStatus,
  };
}
