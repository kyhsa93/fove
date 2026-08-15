export const ZODIAC_SIGNS = [
  { slug: 'rat', animal: '쥐', branch: '자', element: '수' },
  { slug: 'ox', animal: '소', branch: '축', element: '토' },
  { slug: 'tiger', animal: '호랑이', branch: '인', element: '목' },
  { slug: 'rabbit', animal: '토끼', branch: '묘', element: '목' },
  { slug: 'dragon', animal: '용', branch: '진', element: '토' },
  { slug: 'snake', animal: '뱀', branch: '사', element: '화' },
  { slug: 'horse', animal: '말', branch: '오', element: '화' },
  { slug: 'goat', animal: '양', branch: '미', element: '토' },
  { slug: 'monkey', animal: '원숭이', branch: '신', element: '금' },
  { slug: 'rooster', animal: '닭', branch: '유', element: '금' },
  { slug: 'dog', animal: '개', branch: '술', element: '토' },
  { slug: 'pig', animal: '돼지', branch: '해', element: '수' }
]

export const ZODIAC_SLUGS = ZODIAC_SIGNS.map((sign) => sign.slug)
