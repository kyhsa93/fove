import { JSX, useCallback, useState } from 'react'
import { shareLink } from '../lib/share'
import type { ShareOptions } from '../lib/share'
import { useToast } from './ToastProvider'

interface ShareLinkButtonProps {
  options: ShareOptions
  label?: string
  className?: string
}

export function ShareLinkButton({ options, label = '공유하기 🔗', className = '' }: ShareLinkButtonProps): JSX.Element {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleClick = useCallback(async () => {
    if (loading) return
    setLoading(true)
    try {
      const result = await shareLink(options)
      if (result === 'clipboard') {
        showToast('링크가 복사됐어요. 친구에게 공유해보세요!', 'success')
      } else if (result === 'error') {
        showToast('공유에 실패했어요. 다시 시도해주세요.', 'error')
      }
    } finally {
      setLoading(false)
    }
  }, [options, loading, showToast])

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`rounded-full border border-indigo-200 bg-white/70 py-2.5 text-sm font-medium text-indigo-700 hover:bg-white transition disabled:opacity-50 ${className}`}
    >
      {loading ? '공유 중...' : label}
    </button>
  )
}
