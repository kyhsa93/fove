import { SajuForm } from './components/SajuForm'
import { SajuResult } from './components/SajuResult'
import { SajuResultPlaceholder } from './components/SajuResultPlaceholder'
import { useSajuCalculator } from './hooks/useSajuCalculator'

export default function App(): JSX.Element {
  const {
    birthDate,
    birthTime,
    gender,
    result,
    error,
    elementBars,
    interpretation,
    dailyFortune,
    setBirthDate,
    setBirthTime,
    setGender
  } = useSajuCalculator()

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-rose-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900">사주팔자 간편 조회</h1>
          <p className="text-sm text-gray-600">
            양력 생년월일과 태어난 시간을 입력하면 사주팔자(연·월·일·시주의 천간과 지지)를 자동으로 계산해 드립니다.
          </p>
        </header>

        <SajuForm
          birthDate={birthDate}
          birthTime={birthTime}
          gender={gender}
          onBirthDateChange={setBirthDate}
          onBirthTimeChange={setBirthTime}
          onGenderChange={setGender}
        />

        {error ? (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</div>
        ) : null}

        {result ? (
          <SajuResult
            result={result}
            elementBars={elementBars}
            interpretation={interpretation}
            dailyFortune={dailyFortune}
          />
        ) : (
          <SajuResultPlaceholder />
        )}
      </div>
    </div>
  )
}
