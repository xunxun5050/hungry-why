function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function pause(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function normalizeMinutes(minutes) {
  const day = 24 * 60;
  return ((minutes % day) + day) % day;
}

function hashSeed(value) {
  const input = String(value ?? '');
  let hash = 0;

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function pickBySeed(items, seed) {
  if (!Array.isArray(items) || !items.length) return null;
  return items[seed % items.length];
}

const REGIONAL_RECOMMENDATIONS = [
  {
    keys: ['도쿄', 'tokyo'],
    menu: '도쿄 쇼유 라멘',
    why: '도쿄에서 대표적으로 많이 찾는 메뉴라 지역 분위기와 잘 맞아요.',
  },
  {
    keys: ['나고야', 'nagoya'],
    menu: '미소카츠',
    why: '나고야 대표 메뉴라 단짠한 지역 특색을 제대로 느낄 수 있어요.',
  },
  {
    keys: ['요코하마', 'yokohama'],
    menu: '이에케 라멘',
    why: '요코하마 계열 라멘은 진한 국물로 허기 해소에 좋아요.',
  },
  {
    keys: ['오사카', 'osaka'],
    menu: '오코노미야키',
    why: '오사카를 대표하는 분식 메뉴라 여행 기분도 같이 살릴 수 있어요.',
  },
  {
    keys: ['교토', 'kyoto'],
    menu: '유도후 정식',
    why: '교토식 담백한 두부 요리가 속을 편안하게 달래줘요.',
  },
  {
    keys: ['후쿠오카', 'fukuoka'],
    menu: '하카타 돈코츠 라멘',
    why: '후쿠오카에서 특히 유명한 진한 국물 라멘이라 만족감이 높아요.',
  },
  {
    keys: ['삿포로', 'sapporo'],
    menu: '삿포로 미소 라멘',
    why: '삿포로 대표 메뉴라 든든한 한 끼로 딱 좋아요.',
  },
  {
    keys: ['서울', 'seoul'],
    menu: '설렁탕',
    why: '서울에서 찾기 쉽고 든든해서 허기 진정에 효과적인 선택이에요.',
  },
  {
    keys: ['부산', 'busan'],
    menu: '돼지국밥',
    why: '부산 대표 메뉴라 지역감도 살리고 포만감도 확실해요.',
  },
  {
    keys: ['제주', 'jeju'],
    menu: '고기국수',
    why: '제주 지역색이 뚜렷하고 든든해서 추천하기 좋아요.',
  },
  {
    keys: ['대구', 'daegu'],
    menu: '따로국밥',
    why: '대구식 얼큰한 국물 메뉴라 피로감 있는 날 잘 맞아요.',
  },
  {
    keys: ['인천', 'incheon'],
    menu: '짜장면',
    why: '인천 차이나타운 계열의 지역 상징 메뉴로 선택지 가치가 높아요.',
  },
  {
    keys: ['대전', 'daejeon'],
    menu: '성심당 튀김소보로 + 샌드위치',
    why: '대전에서 유명한 빵 라인업이라 가볍게 출출함 달래기 좋아요.',
  },
  {
    keys: ['광주', 'gwangju'],
    menu: '애호박찌개',
    why: '광주권에서 자주 찾는 구수한 메뉴로 속을 편안하게 채워줘요.',
  },
  {
    keys: ['울산', 'ulsan'],
    menu: '언양불고기',
    why: '울산/언양 지역 대표 고기 메뉴라 포만감이 확실해요.',
  },
  {
    keys: ['전주', 'jeonju'],
    menu: '전주비빔밥',
    why: '전주를 대표하는 메뉴라 지역색과 균형 잡힌 한 끼를 같이 챙길 수 있어요.',
  },
  {
    keys: ['경주', 'gyeongju'],
    menu: '경주 교리김밥 + 잔치국수',
    why: '경주에서 인기 있는 조합이라 가볍고도 만족감 있는 한 끼예요.',
  },
  {
    keys: ['뉴욕', 'newyork', 'new york'],
    menu: '뉴욕 페퍼로니 피자 슬라이스',
    why: '뉴욕 대표 스트리트 푸드라 빠르게 허기를 채우기 좋아요.',
  },
  {
    keys: ['로스앤젤레스', '엘에이', 'losangeles', 'los angeles', 'la'],
    menu: 'LA 타코',
    why: 'LA에서 흔하게 즐기는 메뉴라 지역 무드와 잘 맞아요.',
  },
  {
    keys: ['런던', 'london'],
    menu: '피시 앤 칩스',
    why: '런던 대표 메뉴라 지역 특색을 살린 선택지예요.',
  },
  {
    keys: ['파리', 'paris'],
    menu: '크로크무슈',
    why: '파리식 카페 메뉴로 가볍지만 만족감 있게 먹기 좋아요.',
  },
  {
    keys: ['방콕', 'bangkok'],
    menu: '팟타이',
    why: '방콕에서 대중적으로 사랑받는 메뉴라 실패 확률이 낮아요.',
  },
  {
    keys: ['타이베이', 'taipei'],
    menu: '우육면',
    why: '타이베이 대표급 면 요리라 든든하고 만족감이 높아요.',
  },
  {
    keys: ['홍콩', 'hongkong', 'hong kong'],
    menu: '완탕면',
    why: '홍콩에서 친숙한 한 그릇 메뉴로 출출함 해결에 좋아요.',
  },
  {
    keys: ['싱가포르', 'singapore'],
    menu: '하이난 치킨라이스',
    why: '싱가포르 대표 메뉴로 깔끔하고 든든한 한 끼예요.',
  },
];

const COUNTRY_RECOMMENDATIONS = [
  {
    keys: ['대한민국', '한국', 'korea', 'southkorea', 'south korea'],
    menu: '김치찌개 정식',
    why: '한국에서는 접근성이 좋고 만족도가 높은 국민 메뉴라 안정적이에요.',
  },
  {
    keys: ['일본', 'japan'],
    menu: '돈카츠 정식',
    why: '일본 전역에서 찾기 쉬운 메뉴라 어디서든 무난하게 만족감을 주기 좋아요.',
  },
  {
    keys: ['미국', 'usa', 'unitedstates', 'united states'],
    menu: '버거 + 감자튀김',
    why: '미국권에서 접근성이 높아 빠르게 허기를 해소하기 쉬워요.',
  },
  {
    keys: ['영국', 'uk', 'unitedkingdom', 'united kingdom'],
    menu: '잉글리시 브렉퍼스트 플레이트',
    why: '영국권에서 든든하게 먹기 좋은 전형적인 선택지예요.',
  },
  {
    keys: ['프랑스', 'france'],
    menu: '스테이크 프리트',
    why: '프랑스권에서 익숙하고 만족도 높은 클래식 조합이에요.',
  },
  {
    keys: ['이탈리아', 'italy'],
    menu: '마르게리타 피자',
    why: '이탈리아권에서 접근성이 좋은 대표 메뉴라 실패 확률이 낮아요.',
  },
  {
    keys: ['태국', 'thailand'],
    menu: '카오만가이',
    why: '태국에서 부담 없이 찾기 쉬운 메뉴라 가벼운 허기에 잘 맞아요.',
  },
  {
    keys: ['대만', 'taiwan'],
    menu: '루러우판',
    why: '대만에서 대중적인 한 그릇 메뉴라 빠르고 든든하게 먹기 좋아요.',
  },
  {
    keys: ['홍콩', 'hongkong', 'hong kong'],
    menu: '차슈덮밥',
    why: '홍콩권에서 흔하게 볼 수 있는 메뉴라 접근성이 좋아요.',
  },
  {
    keys: ['베트남', 'vietnam'],
    menu: '쌀국수',
    why: '베트남 전역에서 무난하게 즐길 수 있어 컨디션 회복에 좋아요.',
  },
  {
    keys: ['싱가포르', 'singapore'],
    menu: '락사',
    why: '싱가포르의 대표 면 요리로 지역색과 포만감을 함께 챙길 수 있어요.',
  },
];

const DOMESTIC_SHOPS_BY_MENU = {
  '설렁탕': ['이문설농탕', '영동설렁탕'],
  '돼지국밥': ['수변최고돼지국밥', '합천국밥집'],
  '고기국수': ['자매국수', '올래국수'],
  '따로국밥': ['국일따로국밥', '옛집식당'],
  '짜장면': ['공화춘', '신승반점'],
  '전주비빔밥': ['한국집', '가족회관'],
  '언양불고기': ['언양기와집불고기', '진미불고기'],
  '김치찌개 정식': ['은주정', '옥동식당'],
  '제육덮밥': ['봉추찜닭', '백채김치찌개'],
  '비빔밥': ['고궁', '한국관'],
  '물냉면 + 만두': ['을밀대', '봉피양'],
};

const OVERSEAS_FAMOUS_SHOPS_BY_CITY = [
  { keys: ['도쿄', 'tokyo'], names: ['이치란 라멘 신주쿠점', 'AFURI 에비스'] },
  { keys: ['오사카', 'osaka'], names: ['오코노미야키 미즈노', '치보 도톤보리'] },
  { keys: ['교토', 'kyoto'], names: ['오쿠탄 난젠지점', '준세이'] },
  { keys: ['후쿠오카', 'fukuoka'], names: ['이치란 본점', '하카타 잇푸도'] },
  { keys: ['삿포로', 'sapporo'], names: ['스미레 본점', '멘야 사이미'] },
  { keys: ['뉴욕', 'newyork', 'new york'], names: ["Joe's Pizza", 'Prince Street Pizza'] },
  { keys: ['런던', 'london'], names: ['Poppies Fish & Chips', 'The Mayfair Chippy'] },
  { keys: ['파리', 'paris'], names: ['Le Relais de l’Entrecôte', 'Bouillon Chartier'] },
  { keys: ['방콕', 'bangkok'], names: ['Thipsamai Pad Thai', 'Somboon Seafood'] },
  { keys: ['타이베이', 'taipei'], names: ['Yong Kang Beef Noodle', 'Liu Shandong Beef Noodles'] },
  { keys: ['홍콩', 'hongkong', 'hong kong'], names: ['Mak’s Noodle', 'Tsim Chai Kee Noodle'] },
  { keys: ['싱가포르', 'singapore'], names: ['Tian Tian Hainanese Chicken Rice', '328 Katong Laksa'] },
];

const OVERSEAS_FAMOUS_SHOPS_BY_MENU = {
  '마르게리타 피자': ['L’Antica Pizzeria da Michele', 'Gino e Toto Sorbillo'],
  '팟타이': ['Thipsamai Pad Thai', 'Baan Phadthai'],
  '우육면': ['Yong Kang Beef Noodle', 'Lao Shandong Homemade Noodles'],
  '완탕면': ['Mak’s Noodle', 'Ho Hung Kee'],
  '차슈덮밥': ['Joy Hing Roasted Meat', 'Yat Lok'],
  '쌀국수': ['Pho Hoa', 'Pho Quynh'],
  '하이난 치킨라이스': ['Tian Tian Hainanese Chicken Rice', 'Boon Tong Kee'],
};

function parseClockTime(timeText) {
  const text = String(timeText ?? '');
  const match = text.match(/(\d{1,2})\s*:\s*(\d{2})/);

  if (match) {
    const hour = toNumber(match[1], 12);
    const minute = toNumber(match[2], 0);
    const safeHour = Math.min(Math.max(hour, 0), 23);
    const safeMinute = Math.min(Math.max(minute, 0), 59);

    return {
      hour: safeHour,
      minute: safeMinute,
      minutesOfDay: safeHour * 60 + safeMinute,
    };
  }

  const now = new Date();
  return {
    hour: now.getHours(),
    minute: now.getMinutes(),
    minutesOfDay: now.getHours() * 60 + now.getMinutes(),
  };
}

function normalizeCityToken(city) {
  return String(city ?? '')
    .split(',')[0]
    .trim();
}

function normalizeCityKey(city) {
  return normalizeCityToken(city).toLowerCase().replace(/\s+/g, '');
}

function normalizeCountryToken(city) {
  const parts = String(city ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (parts.length <= 1) return '';
  return parts.slice(1).join(' ');
}

function normalizeCountryKey(city) {
  return normalizeCountryToken(city).toLowerCase().replace(/\s+/g, '');
}

function isDomesticLocation(city) {
  return /(서울|부산|대구|인천|광주|대전|울산|제주|전주|경주|대한민국|한국|korea)/i.test(
    String(city ?? '')
  );
}

function inferMealType(minutesOfDay) {
  if (minutesOfDay >= 5 * 60 && minutesOfDay < 10 * 60 + 30) return '아침';
  if (minutesOfDay >= 11 * 60 && minutesOfDay < 15 * 60) return '점심';
  if (minutesOfDay >= 17 * 60 && minutesOfDay < 21 * 60 + 30) return '저녁';
  if (minutesOfDay >= 22 * 60 || minutesOfDay < 2 * 60) return '야식';
  return '간식';
}

function buildWeatherFlavor(context) {
  const city = normalizeCityToken(context.city) || '현재 위치';
  const weather = context.weatherStatus ?? '평범한 날씨';
  const temp = toNumber(context.temp, 20);
  const humidity = toNumber(context.humidity, 55);

  if (temp >= 28) {
    return `${city}의 ${weather} ${temp}°C 더위가 체력을 살짝 빼서, 몸이 '시원하고 짭짤한 한 입'을 추가 요청하는 중이에요.`;
  }

  if (temp <= 8) {
    return `${city}의 ${weather} ${temp}°C 기온이라 몸이 따뜻한 탄수화물을 자동 검색하고 있어요.`;
  }

  if (humidity >= 75) {
    return `습도 ${humidity}%의 눅눅한 공기가 집중력을 갉아먹어서, 뇌가 허기 신호를 과장 방송하는 분위기예요.`;
  }

  return `${city}의 ${weather} ${temp}°C, 습도 ${humidity}% 조합이 입 심심함을 살짝 증폭시키는 타이밍이에요.`;
}

function buildJobFlavor(profile) {
  const jobCategory = String(profile.jobCategory ?? '').trim();
  const jobDetail = String(profile.jobDetail ?? '').trim();
  const source = `${jobCategory} ${jobDetail}`.trim().toLowerCase();

  if (!source) {
    return '하는 일을 비워둔 만큼, 지금은 몸의 배고픔 신호 자체에 더 민감해진 상태예요.';
  }

  if (source.includes('개발')) {
    return '개발 업무 특성상 집중 시간이 길어져, 뇌가 빠른 에너지를 찾는 속도가 더 빨라졌어요.';
  }

  if (source.includes('학생') || source.includes('공부')) {
    return '공부 흐름이 길어질수록 간헐적인 출출함이 더 자주 올라오는 패턴이 나타나기 쉬워요.';
  }

  if (source.includes('서비스') || source.includes('매장') || source.includes('판매')) {
    return '대면/현장 업무가 이어지면 체력 소모가 빨라져 공복감이 더 일찍 느껴질 수 있어요.';
  }

  if (source.includes('크리에이터') || source.includes('디자인') || source.includes('영상')) {
    return '아이디어를 오래 쥐어짜는 작업은 생각보다 에너지를 많이 써서 군것질 신호가 빨리 와요.';
  }

  if (source.includes('자영업') || source.includes('사업')) {
    return '자영업 리듬은 식사 타이밍이 흔들리기 쉬워, 출출함 신호가 예고 없이 올라오곤 해요.';
  }

  if (jobDetail) {
    return `${jobDetail} 업무 특성상 페이스가 몰리면 배고픔 신호가 과장되어 느껴질 수 있어요.`;
  }

  return `${jobCategory} 업무 리듬 때문에 식사 후에도 간헐적인 출출함이 올라올 수 있어요.`;
}

function collectRegionalRecommendations(context) {
  const cityKey = normalizeCityKey(context.city);
  const countryKey = normalizeCountryKey(context.city);

  const cityMatched = REGIONAL_RECOMMENDATIONS.filter((item) =>
    item.keys.some((key) => cityKey.includes(key))
  );

  if (cityMatched.length) {
    return cityMatched.map((item) => ({ menu: item.menu, why: item.why }));
  }

  if (!countryKey) return [];

  const countryMatched = COUNTRY_RECOMMENDATIONS.filter((item) =>
    item.keys.some((key) => countryKey.includes(key))
  );

  return countryMatched.map((item) => ({ menu: item.menu, why: item.why }));
}

function buildSearchKeyword(menu) {
  const text = String(menu ?? '').trim();
  if (!text) return '맛집';
  const primary = text.split('+')[0].trim();
  return primary || text;
}

function buildDomesticStoreLinks(city, menu) {
  const cityToken = normalizeCityToken(city) || '현재 위치';
  const keyword = buildSearchKeyword(menu);
  const stores =
    DOMESTIC_SHOPS_BY_MENU[menu] ??
    [`현지 인기 ${keyword}집`, `로컬 추천 ${keyword}집`];

  return stores.slice(0, 2).map((storeName) => ({
    name: storeName,
    url: `https://map.naver.com/p/search/${encodeURIComponent(`${cityToken} ${storeName}`)}`,
  }));
}

function buildOverseasFamousStores(city, menu) {
  const byMenu = OVERSEAS_FAMOUS_SHOPS_BY_MENU[menu];
  if (Array.isArray(byMenu) && byMenu.length) {
    return byMenu.slice(0, 2);
  }

  const cityKey = normalizeCityKey(city);
  const byCity = OVERSEAS_FAMOUS_SHOPS_BY_CITY.find((item) =>
    item.keys.some((key) => cityKey.includes(key))
  );

  if (byCity?.names?.length) {
    return byCity.names.slice(0, 2);
  }

  const cityToken = normalizeCityToken(city) || '현지';
  return [`${cityToken} 인기 ${menu} 전문점`, `${cityToken} 로컬 ${menu} 맛집`];
}

function buildRecommendationSeed(profile, context) {
  const parts = [
    context.city,
    context.time,
    context.dayOfWeek,
    profile.lastMealHours,
    profile.hungerLevel,
    profile.jobCategory,
    profile.jobDetail,
  ];

  return hashSeed(parts.join('|'));
}

function buildReason(profile, context) {
  const name = String(profile.name ?? '').trim() || '당신';
  const time = context.time ?? '지금';
  const dayOfWeek = context.dayOfWeek ?? '';
  const hungerLevel = toNumber(profile.hungerLevel, 3);
  const lastMealHours = Math.max(0, toNumber(profile.lastMealHours, 4));
  const jobFlavor = buildJobFlavor(profile);

  const clock = parseClockTime(context.time);
  const lastMealMinutes = normalizeMinutes(clock.minutesOfDay - Math.round(lastMealHours * 60));
  const lastMealType = inferMealType(lastMealMinutes);

  const weatherFlavor = buildWeatherFlavor(context);

  if (lastMealHours <= 1.5) {
    const mealHint =
      lastMealType === '저녁'
        ? `저녁을 먹은 지 ${lastMealHours}시간밖에 안 됐는데`
        : `${lastMealType} 먹은 지 ${lastMealHours}시간밖에 안 됐는데`;

    return `${name}님, ${time} ${dayOfWeek} 기준으로 ${mealHint} 출출한 건 아주 정상입니다. 위장이 빈 게 아니라 뇌가 '식사의 감동 앵콜 공연'을 요청한 상태예요. ${jobFlavor} ${weatherFlavor} 결론적으로 오늘 허기는 공복 4할, 심리적 디저트 본능 6할입니다.`;
  }

  if (lastMealHours >= 6) {
    return `${name}님, 마지막 식사 후 ${lastMealHours}시간이 지나면 배고픔 센서가 울리는 게 정상이죠. 여기에 배고픔 강도 ${hungerLevel}/5까지 올라오면 몸이 바로 연료 재보급을 요구합니다. ${jobFlavor} ${weatherFlavor} 오늘은 재치보다 실전, 든든하게 먹는 게 승리예요.`;
  }

  const intensityLine =
    hungerLevel >= 4
      ? `배고픔 강도 ${hungerLevel}/5라 뇌가 이미 탄수화물 핫라인을 열었고`
      : `배고픔 강도 ${hungerLevel}/5의 은근한 신호가 올라와서`;

  return `${name}님, ${time} ${dayOfWeek} 현재 ${intensityLine} 입 심심함이 배고픔으로 번역되는 구간에 들어왔어요. 마지막 식사 후 ${lastMealHours}시간 경과라 몸도 어느 정도 연료를 다시 원합니다. ${jobFlavor} ${weatherFlavor} 조금 말이 안 되지만 오늘 배고픔의 정체는 생리학과 분위기의 합작품이에요.`;
}

function buildFallbackRecommendations(profile, context) {
  const hungerLevel = toNumber(profile.hungerLevel, 3);
  const lastMealHours = Math.max(0, toNumber(profile.lastMealHours, 4));
  const temp = toNumber(context.temp, 20);
  const clock = parseClockTime(context.time);

  const isLateEvening = clock.hour >= 20 || clock.hour < 3;
  const options = [];

  if (lastMealHours <= 1.5) {
    if (isLateEvening) {
      options.push({
        menu: '그릭요거트 + 바나나 + 견과류',
        why: '저녁 직후 출출함은 가벼운 간식으로 끊어야 밤에 부담이 적고 만족감이 좋아요.',
      });
    }

    options.push({
      menu: '김밥 반줄 + 따뜻한 차',
      why: '식사 직후 허기는 양보다 템포 조절이 중요해서, 가볍게 입 심심함만 달래기 좋아요.',
    });

    options.push({
      menu: '두유 + 통밀 샌드위치',
      why: '가벼운 탄수화물과 단백질 조합으로 출출함을 부드럽게 잠재우기 좋아요.',
    });

    return options;
  }

  if (lastMealHours >= 6 || hungerLevel >= 4) {
    if (temp <= 10) {
      options.push({
        menu: '돼지국밥',
        why: '오랜 공복 + 낮은 기온 조합엔 따뜻하고 든든한 한 그릇이 회복 속도가 가장 좋아요.',
      });
    }

    if (temp >= 28) {
      options.push({
        menu: '물냉면 + 만두',
        why: '더운 날 강한 허기에는 수분 보충과 탄수화물 리필을 동시에 잡는 조합이 잘 맞아요.',
      });
    }

    options.push({
      menu: '제육덮밥',
      why: '지금은 맛과 포만감의 균형이 중요해서, 단짠 단백질 조합이 만족도를 높여줘요.',
    });

    options.push({
      menu: '가츠동',
      why: '강한 허기 타이밍엔 단백질과 탄수화물을 빠르게 보충하기 좋아요.',
    });

    return options;
  }

  if (isLateEvening) {
    options.push({
      menu: '연어 포케',
      why: '늦은 시간엔 너무 무겁지 않으면서도 단백질이 있는 메뉴가 다음날 컨디션에 유리해요.',
    });
  }

  options.push({
    menu: '비빔밥',
    why: '지금 타이밍에는 과하지 않게 탄단지를 채우는 한 그릇 메뉴가 가장 안정적이에요.',
  });

  options.push({
    menu: '온소바 + 주먹밥',
    why: '속 부담은 줄이고 포만감은 적당히 챙기기 좋은 조합이에요.',
  });

  return options;
}

function buildSingleRecommendation(profile, context) {
  const seed = buildRecommendationSeed(profile, context);
  const regionalCandidates = collectRegionalRecommendations(context);
  const fallbackCandidates = buildFallbackRecommendations(profile, context);
  const selected = regionalCandidates.length
    ? pickBySeed(regionalCandidates, seed)
    : pickBySeed(fallbackCandidates, seed);
  const domestic = isDomesticLocation(context.city);
  const safeSelected = selected ?? fallbackCandidates[0];

  return {
    ...safeSelected,
    storeType: domestic ? 'domestic' : 'overseas',
    storeLinks: domestic ? buildDomesticStoreLinks(context.city, safeSelected.menu) : [],
    famousStores: domestic ? [] : buildOverseasFamousStores(context.city, safeSelected.menu),
  };
}

async function streamPreview(reason, onStream) {
  if (typeof onStream !== 'function') return;

  const parts = reason
    .split(/(?<=\.)\s+/)
    .map((text) => text.trim())
    .filter(Boolean);

  let accumulated = '';

  for (const part of parts) {
    accumulated = accumulated ? `${accumulated} ${part}` : part;
    onStream(accumulated);
    await pause(420);
  }
}

export async function analyzeHungerWithClaude({ profile, context, onStream }) {
  const reason = buildReason(profile, context);
  const recommendation = buildSingleRecommendation(profile, context);

  await streamPreview(reason, onStream);
  await pause(500);

  return { reason, recommendation };
}
