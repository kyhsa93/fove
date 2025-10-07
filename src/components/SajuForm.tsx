import { JSX } from 'react'
import type { Gender } from '../lib/saju'

interface SajuFormProps {
  birthDate: string
  birthTime: string
  gender: Gender
  onBirthDateChange: (value: string) => void
  onBirthTimeChange: (value: string) => void
  onGenderChange: (value: Gender) => void
}

export function SajuForm({
  birthDate,
  birthTime,
  gender,
  onBirthDateChange,
  onBirthTimeChange,
  onGenderChange
}: SajuFormProps): JSX.Element {
  const today = new Date()
  const maxBirthDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const formatBirthDate = (value: string): string => {
    const [year, month, day] = value.split('-').map((part) => Number(part))
    if ([year, month, day].some((part) => Number.isNaN(part))) {
      return '날짜 형식을 다시 확인해주세요.'
    }

    const parsedDate = new Date(year, month - 1, day)
    const formatter = new Intl.DateTimeFormat('ko-KR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    return formatter.format(parsedDate)
  }

  const formatBirthTime = (value: string): string => {
    const [hour, minute] = value.split(':').map((part) => Number(part))
    if ([hour, minute].some((part) => Number.isNaN(part))) {
      return '시간 형식을 다시 확인해주세요.'
    }

    const parsedTime = new Date(1970, 0, 1, hour, minute)
    const formatter = new Intl.DateTimeFormat('ko-KR', {
      hour: 'numeric',
      minute: 'numeric'
    })

    return formatter.format(parsedTime)
  }

  const formattedDate = birthDate ? formatBirthDate(birthDate) : '생년월일을 먼저 선택해주세요.'
  const formattedTime = birthTime ? formatBirthTime(birthTime) : '선택 사항입니다.'
  const genderLabel = gender === 'male' ? '남성' : '여성'

  return (
    <section className="bg-white/80 backdrop-blur-sm border border-amber-100 shadow-sm rounded-2xl p-6 space-y-5">
      <header className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">기본 정보 입력</h2>
        <p className="text-sm text-amber-700 bg-amber-50/80 border border-amber-100 rounded-xl px-3 py-2">
          생년월일은 반드시 입력해야 정확한 사주 계산이 가능합니다. 저장된 값이 없다면 오늘 날짜와 현재 시간이 기본으로 채워지며, 태어난 시간이 기억나지 않는다면 우선 비워 두고 결과를 확인한 뒤 시간 정보를 보완해 다시 계산해 보세요.
        </p>
      </header>

      <div className="rounded-xl border border-amber-100/60 bg-amber-50/50 p-4 text-sm text-gray-700">
        <h3 className="font-medium text-gray-900 mb-2">입력 요약</h3>
        <dl className="grid gap-3 md:grid-cols-3">
          <div className="space-y-0.5">
            <dt className="text-xs uppercase tracking-[0.08em] text-gray-500">생년월일</dt>
            <dd className="font-medium text-gray-900">{formattedDate}</dd>
          </div>
          <div className="space-y-0.5">
            <dt className="text-xs uppercase tracking-[0.08em] text-gray-500">태어난 시간</dt>
            <dd className="font-medium text-gray-900">{formattedTime}</dd>
          </div>
          <div className="space-y-0.5">
            <dt className="text-xs uppercase tracking-[0.08em] text-gray-500">성별</dt>
            <dd className="font-medium text-gray-900">{genderLabel}</dd>
          </div>
        </dl>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm text-gray-700 font-medium">생년월일 <span className="text-amber-600">*</span></span>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => onBirthDateChange(e.target.value)}
            max={maxBirthDate}
            required
            className="px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300"
          />
          <span className="text-xs text-gray-500">1900년 이후의 생년월일을 권장합니다. 미래 날짜는 선택할 수 없습니다.</span>
        </label>
        <div className="flex flex-col gap-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm text-gray-700 font-medium">태어난 시간 (선택)</span>
            <input
              type="time"
              value={birthTime}
              onChange={(e) => onBirthTimeChange(e.target.value)}
              step={60}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300"
            />
          </label>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={() => onBirthTimeChange('')}
              className="rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-600 transition hover:border-amber-300 hover:text-amber-600"
            >
              시간 비우기
            </button>
            <button
              type="button"
              onClick={() => onBirthTimeChange('00:00')}
              className="rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-600 transition hover:border-amber-300 hover:text-amber-600"
            >
              자정으로 설정
            </button>
            <button
              type="button"
              onClick={() => onBirthTimeChange('12:00')}
              className="rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-600 transition hover:border-amber-300 hover:text-amber-600"
            >
              정오로 설정
            </button>
          </div>
          <span className="text-xs text-gray-500">* 시간이 불확실하다면 비워 두어도 계산은 진행됩니다. 다만 시주는 제외될 수 있습니다.</span>
        </div>

        <fieldset className="flex flex-col gap-3">
          <span className="text-sm text-gray-700 font-medium">성별</span>
          <div className="flex overflow-hidden rounded-full border border-gray-200 bg-white text-sm">
            <button
              type="button"
              onClick={() => onGenderChange('male')}
              className={`flex-1 px-4 py-2 transition ${gender === 'male' ? 'bg-amber-500/90 text-white' : 'text-gray-600 hover:text-amber-600'}`}
            >
              남성
            </button>
            <button
              type="button"
              onClick={() => onGenderChange('female')}
              className={`flex-1 px-4 py-2 transition ${gender === 'female' ? 'bg-amber-500/90 text-white' : 'text-gray-600 hover:text-amber-600'}`}
            >
              여성
            </button>
          </div>
          <span className="text-xs text-gray-500">* 성별 정보는 해석 문구의 톤과 조언을 조정하는 데 사용됩니다.</span>
        </fieldset>
      </div>
    </section>
  )
}
