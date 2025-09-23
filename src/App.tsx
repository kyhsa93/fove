import { useState } from 'react'
import { SajuForm } from './components/SajuForm'
import { SajuResult } from './components/SajuResult'
import { SajuResultPlaceholder } from './components/SajuResultPlaceholder'
import { MbtiTest, type MbtiResult } from './components/MbtiTest'
import { CombinedFortuneCard, CombinedLottoCard } from './components/FortuneAndLotto'
import { useSajuCalculator } from './hooks/useSajuCalculator'

export default function App(): JSX.Element {
  const [activeTool, setActiveTool] = useState<'saju' | 'mbti' | 'fortune' | 'lotto'>('saju')
  const [mbtiResult, setMbtiResult] = useState<MbtiResult | null>(null)
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

  const toolHeadline =
    activeTool === 'saju'
      ? '사주팔자 간편 조회'
      : activeTool === 'mbti'
        ? 'MBTI 성향 진단'
        : activeTool === 'fortune'
          ? '오늘의 운세'
          : '로또 번호 추천'
  const toolDescription =
    activeTool === 'saju'
      ? '양력 생년월일과 태어난 시간을 입력하면 사주팔자(연·월·일·시주의 천간과 지지)를 자동으로 계산해 드립니다.'
      : activeTool === 'mbti'
        ? '20개의 질문으로 자신에게 가까운 MBTI 성향을 확인해 보세요. 직관적인 설명과 함께 강점과 성장 포인트를 안내합니다.'
        : activeTool === 'fortune'
          ? '사주 결과와 MBTI 성향을 조합한 맞춤 오늘의 운세를 확인해 보세요.'
          : '사주 기반 추천 번호에 MBTI 성향 가중치를 더한 로또 번호를 제공합니다.'

  const renderFortuneView = () => {
    if (!result) {
      return (
        <div className="rounded-2xl border border-amber-100 bg-white/60 p-6 text-sm text-gray-700">
          사주 정보를 먼저 입력해 주세요. 사주 계산 탭에서 생년월일과 시간을 입력하면 오늘의 운세를 생성할 수 있습니다.
        </div>
      )
    }
    if (!dailyFortune) {
      return (
        <div className="rounded-2xl border border-amber-100 bg-white/60 p-6 text-sm text-gray-700">
          오늘의 운세 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </div>
      )
    }
    return (
      <div className="space-y-4">
        <CombinedFortuneCard dailyFortune={dailyFortune} mbtiResult={mbtiResult} />
        {!mbtiResult ? (
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 text-sm text-indigo-900/80">
            MBTI 검사를 완료하면 에너지·실천 가이드가 개인 성향에 맞춰 더 정교하게 제공됩니다.
          </div>
        ) : null}
      </div>
    )
  }

  const renderLottoView = () => {
    if (!result) {
      return (
        <div className="rounded-2xl border border-amber-100 bg-white/60 p-6 text-sm text-gray-700">
          사주 정보를 먼저 입력해 주세요. 사주 계산 탭에서 기본 정보를 입력하면 추천 번호를 생성할 수 있습니다.
        </div>
      )
    }
    if (!dailyFortune) {
      return (
        <div className="rounded-2xl border border-amber-100 bg-white/60 p-6 text-sm text-gray-700">
          오늘의 일진 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </div>
      )
    }
    return (
      <div className="space-y-4">
        <CombinedLottoCard dailyFortune={dailyFortune} result={result} mbtiResult={mbtiResult} />
        {!mbtiResult ? (
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 text-sm text-indigo-900/80">
            MBTI 검사를 완료하면 성향 가중치를 반영한 맞춤 번호를 받을 수 있습니다.
          </div>
        ) : null}
      </div>
    )
  }

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
          <button
            type="button"
            onClick={() => setActiveTool('fortune')}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              activeTool === 'fortune'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'border border-gray-200 bg-white text-gray-600 hover:border-rose-300 hover:text-rose-600'
            }`}
          >
            오늘의 운세
          </button>
          <button
            type="button"
            onClick={() => setActiveTool('lotto')}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              activeTool === 'lotto'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'border border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:text-emerald-600'
            }`}
          >
            로또 추천
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
                mbtiResult={mbtiResult}
              />
            ) : (
              <SajuResultPlaceholder />
            )}
          </>
        ) : null}

        {activeTool === 'mbti' ? <MbtiTest onResultChange={setMbtiResult} /> : null}

        {activeTool === 'fortune' ? renderFortuneView() : null}

        {activeTool === 'lotto' ? renderLottoView() : null}
      </div>
    </div>
  )
}
