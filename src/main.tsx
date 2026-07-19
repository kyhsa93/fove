import './index.css'
import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './router'

export const createRoot = ViteReactSSG({
  routes,
  basename: import.meta.env.BASE_URL,
})
