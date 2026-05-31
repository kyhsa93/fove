import { JSX, useEffect, useRef, useState } from 'react'
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

function parseDateParts(value: string): { year: string; month: string; day: string } {
  if (value?.length === 10) {
    const [y, m, d] = value.split('-')
    return {
      year: y ?? '',
      month: m ? String(parseInt(m, 10)) : '',
      day: d ? String(parseInt(d, 10)) : '',
    }
  }
  return { year: '', month: '', day: '' }
}

function tryBuildDate(year: string, month: string, day: string): string {
  const yn = parseInt(year, 10)
  const mn = parseInt(month, 10)
  const dn = parseInt(day, 10)
  if (!year || !month || !day || isNaN(yn) || isNaN(mn) || isNaN(dn)) return ''

  const currentYear = new Date().getFullYear()
  if (yn < 1900 || yn > currentYear || mn < 1 || mn > 12 || dn < 1 || dn > 31) return ''

  const parsed = new Date(yn, mn - 1, dn)
  if (parsed.getFullYear() !== yn || parsed.getMonth() !== mn - 1 || parsed.getDate() !== dn) return ''

  return `${year}-${String(mn).padStart(2, '0')}-${String(dn).padStart(2, '0')}`
}

export function SajuForm({
  birthDate,
  birthTime,
  gender,
  name = '',
  onBirthDateChange,
  onBirthTimeChange,
  onGenderChange,
  onNameChange,
}: SajuFormProps): JSX.Element {
  const init = parseDateParts(birthDate)
  const [year, setYear] = useState(init.year)
  const [month, setMonth] = useState(init.month)
  const [day, setDay] = useState(init.day)
  const [dateError, setDateError] = useState('')

  const monthRef = useRef<HTMLInputElement>(null)
  const dayRef = useRef<HTMLInputElement>(null)

  // 외부에서 birthDate가 변경될 때 내부 상태 동기화 (로컬스토리지 초기 로드)
  useEffect(() => {
    if (!birthDate) return
    const { year: y, month: m, day: d } = parseDateParts(birthDate)
    const current = tryBuildDate(year, month, day)
    if (current !== birthDate) {
      setYear(y); setMonth(m); setDay(d)
    }
  }, [birthDate]) // eslint-disable-line react-hooks/exhaustive-deps

  function emitDate(y: string, m: string, d: string) {
    const result = tryBuildDate(y, m, d)
    if (result) {
      setDateError('')
      onBirthDateChange(result)
    } else {
      onBirthDateChange('')
      // 세 필드 모두 입력됐는데 유효하지 않으면 오류 표시
      if (y.length === 4 && m && d) {
        setDateError('유효하지 않은 날짜입니다.')
      } else {
        setDateError('')
      }
    }
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4)
    setYear(val)
    emitDate(val, month, day)
    if (val.length === 4) monthRef.current?.focus()
  }

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 2)
    setMonth(val)
    emitDate(year, val, day)
    if (val.length === 2) dayRef.current?.focus()
  }

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 2)
    setDay(val)
    emitDate(year, month, val)
  }

  const formatBirthDate = (): string => {
    const result = tryBuildDate(year, month, day)
    if (!result) return year || month || day ? '날짜를 완성해주세요.' : '생년월일을 입력해주세요.'
    const [y, m, d] = result.split('-').map(Number)
    return new Intl.DateTimeFormat('ko-KR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    }).format(new Date(y, m - 1, d))
  }

  const formatBirthTime = (value: string): string => {
    const [hour, minute] = value.split(':').map(Number)
    if (isNaN(hour) || isNaN(minute)) return '시간 형식을 다시 확인해주세요.'
    return new Intl.DateTimeFormat('ko-KR', { hour: 'numeric', minute: 'numeric' }).format(
      new Date(1970, 0, 1, hour, minute)
    )
  }

  const inputClass = (hasError: boolean) =>
    `rounded-lg border bg-white px-3 py-2.5 text-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 ${
      hasError ? 'border-rose-300 bg-rose-50' : 'border-gray-200'
    }`

  return (
    <section className="bg-white/80 backdrop-blur-sm border border-amber-100 shadow-sm rounded-2xl px-2 py-4 space-y-5 sm:px-6 sm:py-6">
      <header className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">기본 정보 입력</h2>
        <p className="text-sm text-amber-700 bg-amber-50/80 border border-amber-100 rounded-xl px-3 py-2">
          양력 날짜로 입력해주세요 (음력 변환 미지원). 생년월일만으로도 기본 분석이 가능하고, 태어난 시간까지 추가하면 더 상세한 결과를 확인할 수 있어요.
        </p>
      </header>

      {/* 입력 요약 */}
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
            <dd className="font-medium text-gray-900">{formatBirthDate()}</dd>
          </div>
          <div className="space-y-0.5">
            <dt className="text-xs uppercase tracking-[0.08em] text-gray-500">태어난 시간</dt>
            <dd className="font-medium text-gray-900">
              {birthTime ? formatBirthTime(birthTime) : '선택 사항입니다.'}
            </dd>
          </div>
          <div className="space-y-0.5">
            <dt className="text-xs uppercase tracking-[0.08em] text-gray-500">성별</dt>
            <dd className="font-medium text-gray-900">{gender === 'male' ? '남성' : '여성'}</dd>
          </div>
        </dl>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 이름 */}
        {onNameChange !== undefined && (
          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-sm text-gray-700 font-medium">
              이름 / 닉네임 <span className="text-gray-400 font-normal">(선택)</span>
            </span>
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

        {/* 생년월일 — 년/월/일 분리 입력 */}
        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-700 font-medium">
            생년월일 <span className="text-amber-600">*</span>
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              value={year}
              onChange={handleYearChange}
              placeholder="1990"
              maxLength={4}
              aria-label="출생 연도"
              className={`w-20 ${inputClass(Boolean(dateError))}`}
            />
            <span className="text-sm text-gray-500 shrink-0">년</span>
            <input
              ref={monthRef}
              type="text"
              inputMode="numeric"
              value={month}
              onChange={handleMonthChange}
              placeholder="1"
              maxLength={2}
              aria-label="출생 월"
              className={`w-14 ${inputClass(Boolean(dateError))}`}
            />
            <span className="text-sm text-gray-500 shrink-0">월</span>
            <input
              ref={dayRef}
              type="text"
              inputMode="numeric"
              value={day}
              onChange={handleDayChange}
              placeholder="1"
              maxLength={2}
              aria-label="출생 일"
              className={`w-14 ${inputClass(Boolean(dateError))}`}
            />
            <span className="text-sm text-gray-500 shrink-0">일</span>
          </div>
          {dateError ? (
            <span className="text-xs text-rose-600">{dateError}</span>
          ) : (
            <span className="text-xs text-gray-500">양력 기준. 연도 4자리 입력 후 자동으로 월 입력으로 이동합니다.</span>
          )}
        </div>

        {/* 태어난 시간 */}
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

        {/* 성별 */}
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
