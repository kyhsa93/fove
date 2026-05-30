// ── 알림 클릭: 앱의 /fortune 페이지로 이동 ───────────────
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

// ── Periodic Background Sync: 매일 운세 알림 ─────────────
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'fove-daily-fortune') {
    event.waitUntil(
      self.registration.showNotification('Fove · 오늘의 운세', {
        body: '오늘의 운세가 준비됐어요. 하루의 흐름을 확인해보세요!',
        icon: '/icons/icon-192.svg',
        badge: '/icons/icon-192.svg',
        tag: 'fove-daily',
        renotify: true,
        data: { url: '/fortune' },
      })
    )
  }
})
