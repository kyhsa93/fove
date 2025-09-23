import { useState } from 'react'
import { SajuForm } from './components/SajuForm'
import { SajuResult } from './components/SajuResult'
import { SajuResultPlaceholder } from './components/SajuResultPlaceholder'
import { MbtiTest } from './components/MbtiTest'
import { useSajuCalculator } from './hooks/useSajuCalculator'

export default function App(): JSX.Element {
  const [activeTool, setActiveTool] = useState<'saju' | 'mbti'>('saju')
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

  const toolHeadline = activeTool === 'saju' ? '사주팔자 간편 조회' : 'MBTI 성향 진단'
  const toolDescription =
    activeTool === 'saju'
      ? '양력 생년월일과 태어난 시간을 입력하면 사주팔자(연·월·일·시주의 천간과 지지)를 자동으로 계산해 드립니다.'
      : '8개의 질문으로 자신에게 가까운 MBTI 성향을 확인해 보세요. 직관적인 설명과 함께 강점과 성장 포인트를 안내합니다.'

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-rose-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900">{toolHeadline}</h1>
          <p className="text-sm text-gray-600">{toolDescription}</p>
        </header>

        <nav className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTool('saju')}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              activeTool === 'saju'
                ? 'bg-amber-500/90 text-white shadow-sm'
                : 'border border-gray-200 bg-white text-gray-600 hover:border-amber-300 hover:text-amber-600'
            }`}
          >
            사주 계산기
          </button>
          <button
            type="button"
            onClick={() => setActiveTool('mbti')}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              activeTool === 'mbti'
                ? 'bg-indigo-500 text-white shadow-sm'
                : 'border border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            MBTI 검사
          </button>
        </nav>

        {activeTool === 'saju' ? (
          <>
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
          </>
        ) : (
          <MbtiTest />
        )}
      </div>
    </div>
  )
}
