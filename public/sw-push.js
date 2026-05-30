// ── 알림 클릭: data.url 또는 /fortune 으로 이동 ──────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = (event.notification.data && event.notification.data.url)
    ? event.notification.data.url
    : '/fortune'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('navigate' in client && 'focus' in client) {
          client.navigate(url)
          return client.focus()
        }
      }
      return self.clients.openWindow(url)
    })
  )
})

// ── 일진 천간 계산 (JDN 기반) ────────────────────────────────────────────
const STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계']

const STEM_CONTEXT = {
  '갑': '새로운 시작과 직진하는 추진력이 강하게 흐르는 날이에요.',
  '을': '유연한 적응력과 관계 조율 감각이 살아있는 날이에요.',
  '병': '밝고 외향적인 존재감을 드러내기 좋은 날이에요.',
  '정': '섬세한 집중력과 내적 열정이 빛을 발하는 날이에요.',
  '무': '안정적인 포용력과 중심 잡기에 유리한 날이에요.',
  '기': '현실적인 판단력과 세밀한 조정 능력이 돋보이는 날이에요.',
  '경': '결단력과 추진력이 선명하게 드러나는 날이에요.',
  '신': '정밀함과 날카로운 분석력이 빛을 발하는 날이에요.',
  '임': '큰 그림을 보는 안목과 유동적인 지혜가 살아나는 날이에요.',
  '계': '섬세한 인내력과 깊은 통찰이 발휘되는 날이에요.',
}

function swMod(n, m) { return ((n % m) + m) % m }

function getJulianDayNumber(year, month, day) {
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  )
}

function getTodayStemContext() {
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000)
  const year = kst.getUTCFullYear()
  const month = kst.getUTCMonth() + 1
  const day = kst.getUTCDate()
  const jdn = getJulianDayNumber(year, month, day)
  const stem = STEMS[swMod(jdn + 50, 60) % 10]
  return STEM_CONTEXT[stem] ?? '오늘의 운세를 확인해보세요!'
}

// ── 스마트 알림 내용 결정 ─────────────────────────────────────────────────
function buildSwNotificationContent() {
  const now = new Date()
  const dayOfWeek = now.getDay() // 0=일, 1=월
  const stemContext = getTodayStemContext()

  // 월요일 — 주간 운세 유도
  if (dayOfWeek === 1) {
    return {
      title: 'Fove · 이번 주 흐름',
      body: '새로운 한 주가 시작됐어요! 이번 주 일진 흐름을 미리 확인해보세요.',
      url: '/fortune/week',
    }
  }

  // 기본: 일진 키워드 포함
  return {
    title: 'Fove · 오늘의 운세',
    body: `${stemContext} 오늘의 운세를 확인해보세요!`,
    url: '/fortune',
  }
}

// ── Periodic Background Sync: 스마트 일일 운세 알림 ──────────────────────
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'fove-daily-fortune') {
    const content = buildSwNotificationContent()
    event.waitUntil(
      self.registration.showNotification(content.title, {
        body: content.body,
        icon: '/icons/icon-192.svg',
        badge: '/icons/icon-192.svg',
        tag: 'fove-daily',
        renotify: true,
        data: { url: content.url },
      })
    )
  }
})
