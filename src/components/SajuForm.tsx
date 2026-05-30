import { JSX } from 'react'
import type { Gender } from '../lib/saju'

interface SajuFormProps {
  birthDate: string
  birthTime: string
  gender: Gender
  name?: string
  onBirthDateChange: (value: string) => void
  onBirthTimeChange: (value: string) => void
  onGenderChange: (value: Gender) => void
  onNameChange?: (value: string) => void
}

export function SajuForm({
  birthDate,
  birthTime,
  gender,
  name = '',
  onBirthDateChange,
  onBirthTimeChange,
  onGenderChange,
  onNameChange
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
    <section className="bg-white/80 backdrop-blur-sm border border-amber-100 shadow-sm rounded-2xl px-2 py-4 space-y-5 sm:px-6 sm:py-6">
      <header className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">기본 정보 입력</h2>
        <p className="text-sm text-amber-700 bg-amber-50/80 border border-amber-100 rounded-xl px-3 py-2">
          양력 날짜로 입력해주세요 (음력 변환 미지원). 생년월일만으로도 기본 분석이 가능하고, 태어난 시간까지 추가하면 더 상세한 결과를 확인할 수 있어요.
        </p>
      </header>

      <div className="rounded-xl border border-amber-100/60 bg-amber-50/50 px-2 py-4 text-sm text-gray-700 sm:px-4">
        <h3 className="font-medium text-gray-900 mb-2">입력 요약</h3>
        <dl className="grid gap-3 md:grid-cols-3">
          {name && (
            <div className="space-y-0.5">
              <dt className="text-xs uppercase tracking-[0.08em] text-gray-500">이름</dt>
              <dd className="font-medium text-gray-900">{name}</dd>
            </div>
          )}
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
        {onNameChange !== undefined && (
          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-sm text-gray-700 font-medium">이름 / 닉네임 <span className="text-gray-400 font-normal">(선택)</span></span>
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="홍길동"
              maxLength={20}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300"
            />
            <span className="text-xs text-gray-500">입력하면 운세 화면과 알림에 이름이 표시됩니다.</span>
          </label>
        )}
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
          <span className="text-xs text-gray-500">양력 기준 입력입니다. 1900년 이후의 생년월일을 권장하며 미래 날짜는 선택할 수 없습니다.</span>
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
          <span className="text-xs text-gray-500">태어난 시간은 말년 운과 자녀 인연에 영향을 줘요. 밤 11시 이후 출생이라면 다음 날 일주가 적용될 수 있어요.</span>
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
