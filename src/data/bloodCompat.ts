export type BloodType = 'A' | 'B' | 'O' | 'AB'

export const BLOOD_TYPES: BloodType[] = ['A', 'B', 'O', 'AB']

export interface BloodCompatResult {
  score: number
  grade: '환상' | '좋음' | '보통' | '도전'
  summary: string
  detail: string
  tip: string
}

export const BLOOD_TRAITS: Record<BloodType, { keyword: string; desc: string }> = {
  A: { keyword: '섬세·계획형', desc: '꼼꼼하고 계획적이며 타인을 배려해요. 완벽을 추구하다 보니 스트레스를 잘 받기도 해요.' },
  B: { keyword: '자유·직관형', desc: '창의적이고 즉흥적이에요. 규칙보다 자신의 감각을 따르며 자유로운 표현을 중요시해요.' },
  O: { keyword: '리더·행동형', desc: '활기차고 추진력이 강해요. 낙관적인 리더십으로 주변을 이끌지만 때로 고집이 강해요.' },
  AB: { keyword: '이성·독창형', desc: '논리적이면서도 창의적인 양면성을 가져요. 상황에 따라 다른 모습을 보여 때로 예측 불가해요.' },
}

const COMPAT: Record<string, BloodCompatResult> = {
  'A-A': { score: 84, grade: '좋음', summary: '서로를 가장 잘 이해하는 조합', detail: '둘 다 섬세하고 배려심이 깊어 갈등을 피하려는 성향이에요. 완벽주의적 면이 겹쳐 서로의 불안을 이해하고 지지해줄 수 있어요.', tip: '속마음을 솔직하게 표현하는 연습을 하세요. 서로 눈치 보다가 정작 하고 싶은 말을 못할 수 있어요.' },
  'A-B': { score: 58, grade: '도전', summary: '정반대 성향이 만든 케미', detail: 'A의 계획성과 B의 즉흥성이 자주 충돌해요. 하지만 서로에게 없는 부분을 자극하며 성장할 수 있는 관계이기도 해요.', tip: '차이를 단점이 아닌 새로운 관점으로 받아들이세요. B는 약속을 조금 더, A는 융통성을 조금 더 발휘하면 좋아요.' },
  'A-O': { score: 81, grade: '좋음', summary: '든든한 리더와 세심한 서포터', detail: 'O의 리더십과 A의 세심한 배려가 균형을 이뤄요. A는 O에게 안정감을 주고, O는 A에게 추진력을 불어넣어 줘요.', tip: 'O가 결정을 주도할 때 A가 세부사항을 챙기면 완벽한 팀이 돼요.' },
  'A-AB': { score: 74, grade: '보통', summary: '지적 교감이 깊은 조합', detail: 'AB의 이중적 모습이 A를 당혹스럽게 할 때도 있지만, 둘 다 섬세한 감수성을 가져 깊은 대화가 가능해요.', tip: 'AB의 변덕스러운 면을 이해하려고 노력하면 관계가 훨씬 부드러워져요.' },
  'B-B': { score: 79, grade: '좋음', summary: '자유로운 영혼끼리의 만남', detail: '서로를 구속하지 않아 편안한 관계예요. 둘 다 즉흥적이라 즐거운 일이 많지만 현실적인 계획이 필요할 때 흔들릴 수 있어요.', tip: '중요한 결정은 함께 충분히 이야기해보세요. 즉흥성이 강점이지만 때로는 계획도 필요해요.' },
  'B-O': { score: 76, grade: '좋음', summary: 'O의 포용력이 B를 감싸는 관계', detail: 'O의 넉넉한 포용력이 B의 자유로운 성격을 받아줘요. 활기차고 에너지 넘치는 관계를 유지할 수 있어요.', tip: 'B가 O의 리더십을 인정해주면 서로 존중하는 좋은 관계가 돼요.' },
  'B-AB': { score: 77, grade: '좋음', summary: '개성 강한 둘의 특별한 유대', detail: '둘 다 독창적이고 자유로워 서로의 독특함을 자연스럽게 인정해요. 지적 자극을 주고받는 흥미로운 관계예요.', tip: '비슷한 자유로움을 추구하지만 AB의 이성적 면과 B의 감성적 면이 균형을 이루면 더 좋아요.' },
  'O-O': { score: 80, grade: '좋음', summary: '두 리더의 에너지 넘치는 만남', detail: '활기차고 긍정적인 에너지가 시너지를 내요. 다만 두 리더가 만나 주도권 싸움이 생길 수 있으니 역할 분담이 중요해요.', tip: '승부욕보다 협력을 선택하면 최강의 파트너가 될 수 있어요.' },
  'O-AB': { score: 71, grade: '보통', summary: '직선과 곡선의 만남', detail: 'O의 직선적이고 솔직한 성격과 AB의 복잡한 내면이 때로 엇갈려요. 하지만 서로에게서 배울 점이 많은 관계예요.', tip: 'O는 AB를 이해하려는 여유를, AB는 O에게 속마음을 더 솔직하게 표현하면 가까워질 수 있어요.' },
  'AB-AB': { score: 69, grade: '보통', summary: '복잡한 내면끼리의 신비로운 만남', detail: '서로의 이중적인 면을 본능적으로 이해하지만, 그만큼 서로를 완전히 파악하기 어렵기도 해요. 특별하고 깊은 유대가 생길 수 있어요.', tip: '서로의 다양한 면을 받아들이는 데 시간이 걸려도 괜찮아요. 천천히 이해해가는 과정 자체가 이 관계의 매력이에요.' },
}

function key(a: BloodType, b: BloodType): string {
  const order: BloodType[] = ['A', 'AB', 'B', 'O']
  return order.indexOf(a) <= order.indexOf(b) ? `${a}-${b}` : `${b}-${a}`
}

export function getBloodCompat(a: BloodType, b: BloodType): BloodCompatResult {
  return COMPAT[key(a, b)] ?? {
    score: 70, grade: '보통', summary: '평범하지만 가능성 있는 조합',
    detail: '서로의 차이를 이해하면 좋은 관계가 될 수 있어요.', tip: '열린 마음으로 상대를 알아가보세요.'
  }
}
