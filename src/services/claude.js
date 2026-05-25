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

function inferMealType(minutesOfDay) {
  if (minutesOfDay >= 5 * 60 && minutesOfDay < 10 * 60 + 30) return '아침';
  if (minutesOfDay >= 11 * 60 && minutesOfDay < 15 * 60) return '점심';
  if (minutesOfDay >= 17 * 60 && minutesOfDay < 21 * 60 + 30) return '저녁';
  if (minutesOfDay >= 22 * 60 || minutesOfDay < 2 * 60) return '야식';
  return '간식';
}

function buildWeatherFlavor(context) {
  const city = context.city ?? '현재 위치';
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

function buildReason(profile, context) {
  const name = String(profile.name ?? '').trim() || '당신';
  const time = context.time ?? '지금';
  const dayOfWeek = context.dayOfWeek ?? '';
  const hungerLevel = toNumber(profile.hungerLevel, 3);
  const lastMealHours = Math.max(0, toNumber(profile.lastMealHours, 4));

  const clock = parseClockTime(context.time);
  const lastMealMinutes = normalizeMinutes(clock.minutesOfDay - Math.round(lastMealHours * 60));
  const lastMealType = inferMealType(lastMealMinutes);

  const weatherFlavor = buildWeatherFlavor(context);

  if (lastMealHours <= 1.5) {
    const mealHint =
      lastMealType === '저녁'
        ? `저녁을 먹은 지 ${lastMealHours}시간밖에 안 됐는데`
        : `${lastMealType} 먹은 지 ${lastMealHours}시간밖에 안 됐는데`;

    return `${name}님, ${time} ${dayOfWeek} 기준으로 ${mealHint} 출출한 건 아주 정상입니다. 위장이 빈 게 아니라 뇌가 '식사의 감동 앵콜 공연'을 요청한 상태예요. ${weatherFlavor} 결론적으로 오늘 허기는 공복 4할, 심리적 디저트 본능 6할입니다.`;
  }

  if (lastMealHours >= 6) {
    return `${name}님, 마지막 식사 후 ${lastMealHours}시간이 지나면 배고픔 센서가 울리는 게 정상이죠. 여기에 배고픔 강도 ${hungerLevel}/5까지 올라오면 몸이 바로 연료 재보급을 요구합니다. ${weatherFlavor} 오늘은 재치보다 실전, 든든하게 먹는 게 승리예요.`;
  }

  const intensityLine =
    hungerLevel >= 4
      ? `배고픔 강도 ${hungerLevel}/5라 뇌가 이미 탄수화물 핫라인을 열었고`
      : `배고픔 강도 ${hungerLevel}/5의 은근한 신호가 올라와서`;

  return `${name}님, ${time} ${dayOfWeek} 현재 ${intensityLine} 입 심심함이 배고픔으로 번역되는 구간에 들어왔어요. 마지막 식사 후 ${lastMealHours}시간 경과라 몸도 어느 정도 연료를 다시 원합니다. ${weatherFlavor} 조금 말이 안 되지만 오늘 배고픔의 정체는 생리학과 분위기의 합작품이에요.`;
}

function buildSingleRecommendation(profile, context) {
  const hungerLevel = toNumber(profile.hungerLevel, 3);
  const lastMealHours = Math.max(0, toNumber(profile.lastMealHours, 4));
  const temp = toNumber(context.temp, 20);
  const clock = parseClockTime(context.time);

  const isLateEvening = clock.hour >= 20 || clock.hour < 3;

  if (lastMealHours <= 1.5) {
    if (isLateEvening) {
      return {
        menu: '그릭요거트 + 바나나 + 견과류',
        why: '저녁 직후 출출함은 가벼운 간식으로 끊어야 밤에 부담이 적고 만족감이 좋아요.',
      };
    }

    return {
      menu: '김밥 반줄 + 따뜻한 차',
      why: '식사 직후 허기는 양보다 템포 조절이 중요해서, 가볍게 입 심심함만 달래기 좋아요.',
    };
  }

  if (lastMealHours >= 6 || hungerLevel >= 4) {
    if (temp <= 10) {
      return {
        menu: '돼지국밥',
        why: '오랜 공복 + 낮은 기온 조합엔 따뜻하고 든든한 한 그릇이 회복 속도가 가장 좋아요.',
      };
    }

    if (temp >= 28) {
      return {
        menu: '물냉면 + 만두',
        why: '더운 날 강한 허기에는 수분 보충과 탄수화물 리필을 동시에 잡는 조합이 잘 맞아요.',
      };
    }

    return {
      menu: '제육덮밥',
      why: '지금은 맛과 포만감의 균형이 중요해서, 단짠 단백질 조합이 만족도를 높여줘요.',
    };
  }

  if (isLateEvening) {
    return {
      menu: '연어 포케',
      why: '늦은 시간엔 너무 무겁지 않으면서도 단백질이 있는 메뉴가 다음날 컨디션에 유리해요.',
    };
  }

  return {
    menu: '비빔밥',
    why: '지금 타이밍에는 과하지 않게 탄단지를 채우는 한 그릇 메뉴가 가장 안정적이에요.',
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
