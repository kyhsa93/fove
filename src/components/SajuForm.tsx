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
  return (
    <section className="bg-white/80 backdrop-blur-sm border border-amber-100 shadow-sm rounded-2xl p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">기본 정보 입력</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm text-gray-700 font-medium">생년월일</span>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => onBirthDateChange(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm text-gray-700 font-medium">태어난 시간 (선택)</span>
          <input
            type="time"
            value={birthTime}
            onChange={(e) => onBirthTimeChange(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          <span className="text-xs text-gray-500">* 시간 미입력 시 시주는 계산되지 않습니다.</span>
        </label>
        <fieldset className="flex flex-col gap-2">
          <span className="text-sm text-gray-700 font-medium">성별</span>
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === 'male'}
                onChange={() => onGenderChange('male')}
                className="text-amber-500 focus:ring-amber-400"
              />
              남성
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === 'female'}
                onChange={() => onGenderChange('female')}
                className="text-amber-500 focus:ring-amber-400"
              />
              여성
            </label>
          </div>
          <span className="text-xs text-gray-500">* 성별 정보는 해석 문구의 톤을 맞추는 데 활용됩니다.</span>
        </fieldset>
      </div>
    </section>
  )
}
