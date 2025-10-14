import { JSX } from "react";

export function SajuResultPlaceholder(): JSX.Element {
  return (
    <section className="bg-white/70 border border-dashed border-amber-200 rounded-2xl px-2 py-6 text-center text-sm text-gray-600 sm:px-8 sm:py-8">
      생년월일을 입력하면 사주팔자 결과가 이 영역에 실시간으로 표시됩니다.
    </section>
  )
}
