export interface BlogMeta {
  h1: string
  subtitle: string
  category: string
}

export interface BlogSection {
  title: string
  content: string[]
}

export interface LoveStyle {
  type: string
  nickname: string
  group: string
  summary: string
  strengths: string[]
  cautions: string[]
  idealDate: string
}
