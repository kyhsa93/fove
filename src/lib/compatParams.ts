export function getCompatParams(defaultType = 'love'): { a: string; b: string; type: string } {
  if (typeof window === 'undefined') return { a: '', b: '', type: defaultType }
  const params = new URLSearchParams(window.location.search)
  return {
    a: params.get('a') ?? '',
    b: params.get('b') ?? '',
    type: params.get('type') ?? defaultType,
  }
}
