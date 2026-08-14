const PROFILE_KEY = 'fove:profile'

interface Profile {
  name: string
}

function load(): Profile {
  if (typeof window === 'undefined') return { name: '' }
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY)
    if (!raw) return { name: '' }
    const parsed = JSON.parse(raw) as Partial<Profile>
    return { name: typeof parsed.name === 'string' ? parsed.name.trim() : '' }
  } catch {
    return { name: '' }
  }
}

export function getName(): string {
  return load().name
}

export function setName(name: string): void {
  if (typeof window === 'undefined') return
  const trimmed = name.trim()
  try {
    if (!trimmed) {
      window.localStorage.removeItem(PROFILE_KEY)
      return
    }
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify({ name: trimmed }))
  } catch {
  }
}
