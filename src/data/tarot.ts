export type TarotArcana = 'major' | 'cups' | 'wands' | 'swords' | 'pentacles'
export type TarotElement = '목' | '화' | '토' | '금' | '수'

export interface TarotCard {
  id: number
  name: string
  emoji: string
  arcana: TarotArcana
  element: TarotElement
  upright: string
  reversed: string
  advice: string
}

// ── 메이저 아르카나 (22장) ────────────────────────────────────────────────
const MAJOR: TarotCard[] = [
  { id: 0,  name: '바보',            emoji: '🃏', arcana: 'major', element: '목', upright: '새로운 시작과 자유로운 도전의 기운이 흘러요. 두려움 없이 첫 발을 내딛을 때예요.', reversed: '무모한 행동이나 준비 없는 도전에 주의하세요.', advice: '오늘은 계산보다 용기가 더 중요한 날이에요.' },
  { id: 1,  name: '마법사',          emoji: '✨', arcana: 'major', element: '화', upright: '내 안의 능력과 의지가 최고조에 달해 있어요. 원하는 것을 현실로 만들 힘이 있어요.', reversed: '재능을 낭비하거나 집중력이 흐트러지기 쉬운 날이에요.', advice: '가진 것을 총동원해 하나의 목표에 집중해보세요.' },
  { id: 2,  name: '여사제',          emoji: '🌙', arcana: 'major', element: '수', upright: '직관과 내면의 목소리에 귀 기울여야 할 때예요. 아직 드러나지 않은 것들이 있어요.', reversed: '정보를 숨기거나 직관을 억누르는 것에 주의해요.', advice: '오늘은 논리보다 느낌을 따르면 더 좋은 답이 나와요.' },
  { id: 3,  name: '여황제',          emoji: '🌸', arcana: 'major', element: '목', upright: '풍요와 창의성, 따뜻한 관계의 기운이 흘러요. 가꾸고 돌보는 것에 집중할 때예요.', reversed: '과도한 의존이나 감정 소모에 주의가 필요해요.', advice: '나 자신과 소중한 사람을 아끼는 하루를 만들어보세요.' },
  { id: 4,  name: '황제',            emoji: '👑', arcana: 'major', element: '금', upright: '질서와 리더십, 강한 의지의 에너지가 흘러요. 계획을 실행하고 책임을 지기 좋은 날이에요.', reversed: '고집이나 통제욕이 지나쳐 갈등이 생길 수 있어요.', advice: '원칙은 지키되 주변 의견에도 한 번쯤 귀를 열어보세요.' },
  { id: 5,  name: '교황',            emoji: '⛪', arcana: 'major', element: '토', upright: '전통과 신뢰, 안정적인 가르침의 기운이 흘러요. 믿을 수 있는 조언을 구하면 좋아요.', reversed: '규범에 지나치게 얽매이거나 독선적이 되지 않도록 주의해요.', advice: '검증된 방법과 경험자의 조언을 참고해보세요.' },
  { id: 6,  name: '연인들',          emoji: '💑', arcana: 'major', element: '목', upright: '관계와 선택의 기운이 강해요. 중요한 결정을 앞두고 있거나 소중한 인연이 부각돼요.', reversed: '선택의 혼란이나 관계의 불균형이 나타날 수 있어요.', advice: '오늘 내린 선택은 마음에서 우러난 것이어야 해요.' },
  { id: 7,  name: '전차',            emoji: '🏆', arcana: 'major', element: '화', upright: '강한 의지와 승리의 에너지가 흘러요. 도전과 경쟁에서 앞서 나갈 수 있는 날이에요.', reversed: '무리하거나 방향을 잃고 달리는 것에 주의해요.', advice: '목표를 분명히 하고 한 방향으로 에너지를 모아보세요.' },
  { id: 8,  name: '힘',              emoji: '🦁', arcana: 'major', element: '화', upright: '내면의 용기와 인내, 유연한 강인함의 에너지예요. 부드럽게 상황을 이끌어갈 수 있어요.', reversed: '자신감 부족이나 감정 조절에 어려움이 올 수 있어요.', advice: '강하게 밀어붙이기보다 온화하게 설득해보세요.' },
  { id: 9,  name: '은둔자',          emoji: '🏮', arcana: 'major', element: '수', upright: '혼자만의 성찰과 지혜를 찾는 시간이 필요해요. 내면의 답을 구할 때예요.', reversed: '지나친 고립이나 도움 거부에 주의가 필요해요.', advice: '오늘 하루 조용히 혼자만의 시간을 가져보세요.' },
  { id: 10, name: '운명의 수레바퀴', emoji: '🎡', arcana: 'major', element: '토', upright: '변화와 전환점의 에너지가 흘러요. 흐름을 탈 줄 알면 기회가 찾아와요.', reversed: '예상치 못한 변수나 불운한 흐름에 유연하게 대응해야 해요.', advice: '지금의 변화를 저항하지 말고 흐름에 맡겨보세요.' },
  { id: 11, name: '정의',            emoji: '⚖️', arcana: 'major', element: '금', upright: '공정함과 균형, 올바른 판단의 기운이 흘러요. 진실이 드러나는 날이에요.', reversed: '불공정하거나 편향된 판단이 생길 수 있어요.', advice: '오늘은 감정보다 사실에 기반해 판단하세요.' },
  { id: 12, name: '매달린 사람',     emoji: '🙃', arcana: 'major', element: '수', upright: '다른 시각으로 바라볼 때예요. 잠시 멈추고 관점을 전환하면 새 길이 보여요.', reversed: '희생이 의미 없이 소모되거나 결단을 미루고 있어요.', advice: '지금은 행동보다 기다림이 더 현명한 선택이에요.' },
  { id: 13, name: '죽음',            emoji: '🍂', arcana: 'major', element: '금', upright: '끝과 변화, 새로운 시작의 에너지예요. 낡은 것을 놓아야 새것이 와요.', reversed: '변화에 저항하거나 매달리는 것이 스트레스를 만들어요.', advice: '오늘은 더 이상 필요 없는 것을 하나 내려놔보세요.' },
  { id: 14, name: '절제',            emoji: '🌊', arcana: 'major', element: '수', upright: '균형과 인내, 중용의 지혜가 빛나는 날이에요. 꾸준함이 결실을 맺어요.', reversed: '극단적이거나 불균형한 태도에 주의가 필요해요.', advice: '급하게 서두르지 말고 천천히 균형을 유지하세요.' },
  { id: 15, name: '악마',            emoji: '⛓️', arcana: 'major', element: '토', upright: '집착이나 유혹, 물질적 욕망의 에너지를 직시해야 해요. 묶인 것을 인식하는 것이 해방의 시작이에요.', reversed: '속박에서 벗어나기 시작하는 에너지가 흘러요.', advice: '나를 제한하는 습관이나 생각이 무엇인지 점검해보세요.' },
  { id: 16, name: '탑',              emoji: '⚡', arcana: 'major', element: '화', upright: '갑작스러운 변화나 충격이 올 수 있어요. 하지만 무너진 뒤에야 새로운 것이 세워져요.', reversed: '내부에서 이미 변화가 진행 중이에요. 천천히 조정하세요.', advice: '예상치 못한 일이 생겨도 본질을 잃지 마세요.' },
  { id: 17, name: '별',              emoji: '⭐', arcana: 'major', element: '목', upright: '희망과 영감, 치유의 에너지가 흘러요. 믿고 나아가면 길이 열려요.', reversed: '희망을 잃거나 불안감이 커지는 날이에요. 쉬세요.', advice: '오늘은 기대를 품고 한 발씩 나아가는 것으로 충분해요.' },
  { id: 18, name: '달',              emoji: '🌕', arcana: 'major', element: '수', upright: '무의식과 환상, 불확실성의 에너지가 흘러요. 보이는 것이 전부가 아니에요.', reversed: '혼란이 걷히고 진실이 드러나기 시작해요.', advice: '중요한 결정은 오늘 미루고 정보를 더 모아보세요.' },
  { id: 19, name: '태양',            emoji: '☀️', arcana: 'major', element: '화', upright: '기쁨과 성공, 활기찬 에너지가 넘쳐요. 긍정적인 일이 일어나기 좋은 날이에요.', reversed: '과도한 낙관주의나 자만에 주의가 필요해요.', advice: '오늘의 밝은 에너지를 주변과 나눠보세요.' },
  { id: 20, name: '심판',            emoji: '📯', arcana: 'major', element: '금', upright: '각성과 새로운 부름의 에너지예요. 과거를 돌아보고 다음 단계로 나아갈 때예요.', reversed: '자기 반성이 부족하거나 기회를 놓치고 있어요.', advice: '오늘은 솔직하게 자신을 평가하는 시간을 가져보세요.' },
  { id: 21, name: '세계',            emoji: '🌍', arcana: 'major', element: '토', upright: '완성과 성취, 통합의 에너지가 넘쳐요. 하나의 사이클이 마무리되는 날이에요.', reversed: '미완성이나 마무리 지연에 주의가 필요해요.', advice: '지금까지의 노력을 인정하고 다음 목표를 바라보세요.' },
]

// ── 마이너 아르카나 생성 헬퍼 ─────────────────────────────────────────────
type MinorRank = 'ace' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'page' | 'knight' | 'queen' | 'king'

interface MinorData {
  name: string
  upright: string
  reversed: string
  advice: string
}

const CUPS_DATA: Record<MinorRank, MinorData> = {
  ace:    { name: '컵 에이스',    upright: '감정의 새로운 시작, 사랑과 직관의 충만함이 흘러요.',         reversed: '감정적 소모나 거절의 기운이 있어요.',       advice: '마음을 열고 새로운 감정을 받아들여보세요.' },
  '2':    { name: '컵 2',        upright: '조화로운 만남과 파트너십, 상호 이해의 기운이 좋아요.',        reversed: '관계의 불균형이나 소통 단절에 주의해요.',   advice: '상대방의 감정에 진심으로 귀 기울여보세요.' },
  '3':    { name: '컵 3',        upright: '축하와 우정, 함께하는 기쁨의 에너지가 넘쳐요.',              reversed: '과음이나 과도한 사교에 주의가 필요해요.',    advice: '오늘은 좋아하는 사람들과 시간을 나눠보세요.' },
  '4':    { name: '컵 4',        upright: '내면을 돌아보는 시간, 주어진 것들을 재평가할 때예요.',        reversed: '기회를 놓치지 않도록 눈을 크게 떠보세요.',   advice: '익숙한 것에서 새로운 가치를 찾아보세요.' },
  '5':    { name: '컵 5',        upright: '상실감이나 실망이 있지만 아직 남은 것에 집중해야 해요.',     reversed: '슬픔을 딛고 앞으로 나아갈 힘이 생겨요.',   advice: '잃은 것보다 남아 있는 것에 감사해보세요.' },
  '6':    { name: '컵 6',        upright: '따뜻한 기억과 친숙한 사람의 기운, 선물 같은 날이에요.',     reversed: '과거에 너무 머물지 않도록 주의해요.',        advice: '옛 인연에게 안부를 전해보는 건 어떨까요?' },
  '7':    { name: '컵 7',        upright: '다양한 가능성이 펼쳐지지만 선택이 어려울 수 있어요.',        reversed: '환상에서 벗어나 현실적으로 판단할 때예요.', advice: '오늘은 하나의 선택에만 집중해보세요.' },
  '8':    { name: '컵 8',        upright: '더 이상 맞지 않는 것을 놓고 앞으로 나아갈 때예요.',         reversed: '미련이나 집착을 내려놓기 어려운 날이에요.',  advice: '마음의 짐을 하나 내려놓으면 길이 보여요.' },
  '9':    { name: '컵 9',        upright: '소원 성취와 만족의 기운, 원하던 것이 이루어지는 날이에요.', reversed: '만족을 미루거나 과욕에 주의가 필요해요.',    advice: '지금 가진 것만으로도 충분히 풍요로워요.' },
  '10':   { name: '컵 10',       upright: '행복한 가정과 완전한 성취, 감정적 충만의 에너지예요.',      reversed: '관계의 균열이나 이상과 현실의 괴리를 돌봐요.', advice: '소중한 사람들과의 행복을 의식적으로 느껴보세요.' },
  page:   { name: '컵 페이지',   upright: '감수성 풍부한 메시지, 직관적 아이디어나 좋은 소식이 와요.', reversed: '감정적 미성숙이나 공상에 주의해요.',          advice: '감성적인 영감을 기록해두면 도움이 돼요.' },
  knight: { name: '컵 기사',     upright: '낭만적이고 이상적인 추구, 감정에 따라 행동하는 에너지예요.', reversed: '감정에 휘둘리거나 비현실적인 기대를 주의해요.', advice: '마음이 이끄는 대로 가되 현실을 잊지 마세요.' },
  queen:  { name: '컵 여왕',     upright: '공감과 돌봄, 감성적 성숙의 에너지가 빛나요.',              reversed: '감정 과몰입이나 자기 희생에 주의가 필요해요.', advice: '나 자신의 감정도 중요하게 여겨주세요.' },
  king:   { name: '컵 왕',       upright: '감성적 균형과 지혜, 따뜻한 리더십의 에너지예요.',           reversed: '감정 억압이나 차가운 태도에 주의해요.',      advice: '이성과 감성의 균형을 유지하는 날이에요.' },
}

const WANDS_DATA: Record<MinorRank, MinorData> = {
  ace:    { name: '완드 에이스',  upright: '창의성과 열정의 불꽃이 점화되는 날이에요.',               reversed: '에너지 소진이나 시작의 어려움이 있어요.',   advice: '작은 아이디어도 오늘은 실행해볼 가치가 있어요.' },
  '2':    { name: '완드 2',      upright: '계획을 세우고 미래를 바라보는 시기예요. 비전이 생겨요.', reversed: '계획이 막히거나 방향성을 잃기 쉬운 날이에요.', advice: '지금 위치에서 다음 목표를 그려보세요.' },
  '3':    { name: '완드 3',      upright: '노력한 것들이 결실을 맺기 시작해요. 더 큰 기회가 열려요.', reversed: '지연이나 예상 밖의 장애물에 주의해요.',       advice: '기다려온 것들이 조금씩 모습을 드러내고 있어요.' },
  '4':    { name: '완드 4',      upright: '축하와 안정, 성취를 기념하는 에너지가 넘쳐요.',           reversed: '내면의 불안이나 아직 완성되지 않은 것들이 있어요.', advice: '오늘은 수고한 자신을 칭찬하고 축하해주세요.' },
  '5':    { name: '완드 5',      upright: '경쟁이나 갈등이 있지만 성장의 기회가 돼요.',             reversed: '불필요한 싸움에서 빠져나올 때예요.',          advice: '경쟁을 동력으로 삼되 소모전은 피하세요.' },
  '6':    { name: '완드 6',      upright: '승리와 인정의 기운, 노력이 빛을 발하는 날이에요.',        reversed: '인정받지 못하는 느낌이 들 수 있어요.',       advice: '결과에 상관없이 오늘의 노력 자체를 소중히 여기세요.' },
  '7':    { name: '완드 7',      upright: '도전에 맞서 자신을 지키는 에너지가 필요해요.',           reversed: '방어적 태도가 오히려 고립을 만들 수 있어요.', advice: '나의 입장을 명확히 하되 과도하게 방어하지 마세요.' },
  '8':    { name: '완드 8',      upright: '빠른 전개와 소통, 일이 속도감 있게 진행돼요.',           reversed: '급하게 서두르면 실수가 생길 수 있어요.',      advice: '속도는 내되 방향이 맞는지 확인해가며 나아가세요.' },
  '9':    { name: '완드 9',      upright: '피로하지만 거의 다 왔어요. 마지막 힘을 내볼 때예요.',    reversed: '지쳐서 포기하고 싶은 마음에 주의해요.',       advice: '조금만 더 버티면 돼요. 끝이 가까워요.' },
  '10':   { name: '완드 10',     upright: '책임이 무겁지만 능력이 있어요. 짐을 나눌 방법을 찾아요.', reversed: '지나친 부담으로 번아웃이 올 수 있어요.',      advice: '혼자 다 하려 하지 말고 도움을 요청해보세요.' },
  page:   { name: '완드 페이지', upright: '호기심과 탐험 정신, 새로운 아이디어의 시작점이에요.',    reversed: '산만하거나 의욕만 앞서는 것에 주의해요.',     advice: '아이디어를 적고 가장 흥미로운 것 하나에 집중해요.' },
  knight: { name: '완드 기사',   upright: '열정적으로 앞으로 달려나가는 에너지가 강해요.',          reversed: '충동적이거나 무모한 행동에 주의가 필요해요.', advice: '에너지를 집중해서 한 방향으로 쏟아보세요.' },
  queen:  { name: '완드 여왕',   upright: '독립적이고 활기차며 카리스마 있는 에너지가 빛나요.',    reversed: '자기중심적이 되거나 에너지를 낭비하기 쉬워요.', advice: '당당하게 자신의 빛을 발산하는 날이에요.' },
  king:   { name: '완드 왕',     upright: '비전 있는 리더십과 열정적인 추진력의 에너지예요.',       reversed: '독단적이거나 성급한 결정에 주의해요.',         advice: '큰 그림을 보며 팀을 이끌어가는 날이에요.' },
}

const SWORDS_DATA: Record<MinorRank, MinorData> = {
  ace:    { name: '소드 에이스',  upright: '명확한 생각과 진실, 새로운 아이디어의 돌파구가 열려요.',  reversed: '혼란이나 소통 실패에 주의가 필요해요.',        advice: '복잡한 상황을 명확하게 정리해볼 때예요.' },
  '2':    { name: '소드 2',      upright: '결단을 내려야 하지만 균형 잡기가 어려워요.',            reversed: '정보 부족으로 판단이 지연되고 있어요.',         advice: '선택을 더 이상 미루지 말고 결정을 내려보세요.' },
  '3':    { name: '소드 3',      upright: '상처나 슬픔이 있지만 치유가 시작돼요. 솔직히 직면해요.', reversed: '아픔을 억누르거나 부정하는 것에 주의해요.',      advice: '감정을 억누르지 말고 충분히 느끼고 흘려보내세요.' },
  '4':    { name: '소드 4',      upright: '휴식과 재충전이 필요해요. 잠시 멈추고 쉬어가야 해요.',   reversed: '쉬어야 하는데 계속 달리려는 것에 주의해요.',   advice: '오늘은 의도적으로 쉬는 시간을 만들어보세요.' },
  '5':    { name: '소드 5',      upright: '갈등에서 이겼지만 상처가 남을 수 있어요.', reversed: '집착하지 말고 흘려보낼 때가 됐어요.',              advice: '이기는 것보다 관계를 지키는 방법을 찾아보세요.' },
  '6':    { name: '소드 6',      upright: '어려운 상황에서 벗어나 더 나은 곳으로 이동해요.',       reversed: '아직 완전히 빠져나오지 못한 것들이 있어요.',    advice: '지금보다 더 나은 상황을 향해 천천히 나아가세요.' },
  '7':    { name: '소드 7',      upright: '전략과 기지가 필요한 날이에요. 독립적으로 행동하세요.',  reversed: '속임수나 비밀이 드러날 수 있어요.',             advice: '정직하고 영리하게 상황을 헤쳐나가세요.' },
  '8':    { name: '소드 8',      upright: '제한감이 느껴지지만 실제로는 선택권이 있어요.',          reversed: '속박에서 벗어나는 길이 보이기 시작해요.',       advice: '스스로 만든 한계를 의심하고 다른 가능성을 찾아봐요.' },
  '9':    { name: '소드 9',      upright: '걱정과 불안이 밤을 새우게 하지만 생각보다 덜 심각해요.', reversed: '최악의 상상에서 빠져나올 때예요.',              advice: '걱정을 종이에 써보면 실체가 보이고 마음이 가벼워져요.' },
  '10':   { name: '소드 10',     upright: '어려운 끝이지만 이제 새로운 시작만 남았어요.',           reversed: '아직 바닥을 치지 않았어요. 좀 더 버텨야 해요.', advice: '가장 힘든 순간이 지나면 올라갈 일만 남아요.' },
  page:   { name: '소드 페이지', upright: '예리한 관찰력과 탐구심이 빛나는 날이에요.',             reversed: '험담이나 가십에 주의가 필요해요.',              advice: '눈과 귀를 열고 정보를 수집하는 날이에요.' },
  knight: { name: '소드 기사',   upright: '빠르고 결단력 있게 행동하는 에너지가 필요해요.',         reversed: '성급함이나 공격적 태도에 주의가 필요해요.',     advice: '생각하고 말하는 순서를 지키면 실수가 줄어요.' },
  queen:  { name: '소드 여왕',   upright: '예리한 지성과 직접적인 소통, 독립적인 힘이 빛나요.',    reversed: '냉정함이 차가움으로 비칠 수 있어요.',           advice: '명확하게 말하되 따뜻함을 잃지 마세요.' },
  king:   { name: '소드 왕',     upright: '공정하고 분석적인 판단력으로 상황을 주도하는 날이에요.', reversed: '독단적 결정이나 냉혹함에 주의가 필요해요.',     advice: '이성적 판단이 빛을 발하는 날이에요.' },
}

const PENTACLES_DATA: Record<MinorRank, MinorData> = {
  ace:    { name: '펜타클 에이스',  upright: '물질적 기회와 새로운 시작, 풍요로운 잠재력이 열려요.',     reversed: '기회를 놓치거나 실질적 준비가 부족해요.',      advice: '현실적인 기회에 주목하고 시작해보세요.' },
  '2':    { name: '펜타클 2',      upright: '여러 일의 균형을 맞추며 유연하게 대응해야 해요.',          reversed: '한 번에 너무 많은 것을 하려는 것에 주의해요.', advice: '우선순위를 정하면 혼란이 줄어들어요.' },
  '3':    { name: '펜타클 3',      upright: '협력과 전문성, 인정받는 작업의 기운이 흘러요.',            reversed: '팀워크 문제나 동기 부족에 주의해요.',           advice: '함께 만들어가는 것의 가치를 느껴보세요.' },
  '4':    { name: '펜타클 4',      upright: '안정과 저축의 에너지지만 지나친 집착은 성장을 막아요.',    reversed: '물질적 집착에서 벗어날 때가 됐어요.',          advice: '가진 것을 지키면서도 필요한 곳엔 쓸 줄 알아야 해요.' },
  '5':    { name: '펜타클 5',      upright: '어려움이 있지만 도움이 가까이 있어요. 손을 내밀어보세요.',  reversed: '점차 회복되는 기운이 흘러요.',                 advice: '주변의 도움을 받아들이는 것도 용기예요.' },
  '6':    { name: '펜타클 6',      upright: '주고받는 균형, 나눔과 관대함의 에너지가 좋아요.',          reversed: '과도한 베풂이나 의존에 주의가 필요해요.',       advice: '베풀 때와 받을 때의 균형을 찾아보세요.' },
  '7':    { name: '펜타클 7',      upright: '노력의 결실을 평가하는 시간이에요. 방향이 맞는지 확인해요.', reversed: '불안이나 조급함이 성장을 방해하고 있어요.',    advice: '지금 하는 것이 올바른 방향인지 점검해보세요.' },
  '8':    { name: '펜타클 8',      upright: '기술과 전문성을 쌓는 시간, 묵묵히 연습하는 에너지예요.',   reversed: '완벽주의나 일 중독에 주의가 필요해요.',         advice: '오늘 하루 한 가지 기술을 더 연마해보세요.' },
  '9':    { name: '펜타클 9',      upright: '풍요와 독립, 자기 충족의 만족스러운 에너지가 흘러요.',     reversed: '물질에 과도하게 의존하는 것에 주의해요.',       advice: '나 자신의 힘으로 이룬 것들을 충분히 즐기세요.' },
  '10':   { name: '펜타클 10',     upright: '장기적 풍요와 가족·유산의 충만함, 안정의 절정이에요.',     reversed: '과거의 성공에 얽매이지 않도록 주의해요.',       advice: '소중한 것들을 오래 지킬 방법을 생각해보세요.' },
  page:   { name: '펜타클 페이지', upright: '새로운 기술 배우기, 실용적인 기회를 탐색하는 날이에요.',   reversed: '지나치게 신중하거나 소심해지기 쉬워요.',        advice: '작고 실용적인 것에서 큰 가능성을 찾아보세요.' },
  knight: { name: '펜타클 기사',   upright: '꾸준하고 신뢰할 수 있는 행동으로 목표를 향해 나아가요.',  reversed: '지나치게 느리거나 완고한 것에 주의해요.',       advice: '오늘은 꾸준함이 가장 강력한 무기예요.' },
  queen:  { name: '펜타클 여왕',   upright: '실용적이고 풍요로우며 돌보는 에너지가 빛나는 날이에요.',  reversed: '물질적 걱정이나 과도한 관리욕에 주의해요.',     advice: '현실적이고 따뜻한 방식으로 사람들을 지지해보세요.' },
  king:   { name: '펜타클 왕',     upright: '물질적 성공과 풍요, 신뢰받는 리더십의 에너지가 강해요.',  reversed: '탐욕이나 고집에 주의가 필요해요.',             advice: '안정과 번영을 함께 나누는 날이에요.' },
}

function buildMinor(
  arcana: TarotArcana,
  element: TarotElement,
  emoji: string,
  data: Record<MinorRank, MinorData>,
  startId: number
): TarotCard[] {
  const ranks: MinorRank[] = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'page', 'knight', 'queen', 'king']
  return ranks.map((rank, i) => ({
    id: startId + i,
    name: data[rank].name,
    emoji,
    arcana,
    element,
    upright: data[rank].upright,
    reversed: data[rank].reversed,
    advice: data[rank].advice,
  }))
}

const CUPS_CARDS = buildMinor('cups', '수', '💧', CUPS_DATA, 22)
const WANDS_CARDS = buildMinor('wands', '화', '🔥', WANDS_DATA, 36)
const SWORDS_CARDS = buildMinor('swords', '목', '⚔️', SWORDS_DATA, 50)
const PENTACLES_CARDS = buildMinor('pentacles', '토', '💰', PENTACLES_DATA, 64)

export const ALL_CARDS: TarotCard[] = [
  ...MAJOR,
  ...CUPS_CARDS,
  ...WANDS_CARDS,
  ...SWORDS_CARDS,
  ...PENTACLES_CARDS,
]

export const POSITIONS = [
  { label: '오늘의 에너지', icon: '🌅', desc: '지금 흐르는 전반적인 기운' },
  { label: '오늘 해볼 것',  icon: '💡', desc: '행동을 이끄는 방향' },
  { label: '오늘 주의할 것', icon: '⚠️', desc: '조심하면 좋을 포인트' },
]
