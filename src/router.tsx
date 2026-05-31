import { type RouteObject } from 'react-router-dom'
import Layout from './Layout'
import HomePage from './pages/HomePage'
import SajuPage from './pages/SajuPage'
import SajuYearPage from './pages/SajuYearPage'
import MbtiPage from './pages/MbtiPage'
import MbtiCompatibilityPage from './pages/MbtiCompatibilityPage'
import FortunePage from './pages/FortunePage'
import FortuneWeekPage from './pages/FortuneWeekPage'
import FortuneMonthPage from './pages/FortuneMonthPage'
import FortuneYearPage from './pages/FortuneYearPage'
import ZodiacPage from './pages/ZodiacPage'
import ZodiacCompatPage from './pages/ZodiacCompatPage'
import InsightPage from './pages/InsightPage'
import CompatibilityPage from './pages/CompatibilityPage'
import CombinedCompatPage from './pages/CombinedCompatPage'
import QuizPage from './pages/QuizPage'
import BlogSajuBasicsPage from './pages/BlogSajuBasicsPage'
import BlogZodiacStandardPage from './pages/BlogZodiacStandardPage'
import BlogMbtiLoveStylePage from './pages/BlogMbtiLoveStylePage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import ContactPage from './pages/ContactPage'
import BloodCompatPage from './pages/BloodCompatPage'
import StarSignCompatPage from './pages/StarSignCompatPage'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'saju', element: <SajuPage /> },
      { path: 'saju/:year', element: <SajuYearPage /> },
      { path: 'mbti', element: <MbtiPage /> },
      { path: 'mbti/compatibility', element: <MbtiCompatibilityPage /> },
      { path: 'fortune', element: <FortunePage /> },
      { path: 'fortune/week', element: <FortuneWeekPage /> },
      { path: 'fortune/month', element: <FortuneMonthPage /> },
      { path: 'fortune/year', element: <FortuneYearPage /> },
      { path: 'zodiac', element: <ZodiacPage /> },
      { path: 'zodiac/compatibility', element: <ZodiacCompatPage /> },
      { path: 'blood-compatibility', element: <BloodCompatPage /> },
      { path: 'starsign-compatibility', element: <StarSignCompatPage /> },
      { path: 'zodiac/:type', element: <ZodiacPage /> },
      { path: 'insight', element: <InsightPage /> },
      { path: 'compatibility', element: <CompatibilityPage /> },
      { path: 'compatibility/combined', element: <CombinedCompatPage /> },
      { path: 'quiz', element: <QuizPage /> },
      { path: 'blog/saju-basics', element: <BlogSajuBasicsPage /> },
      { path: 'blog/zodiac-standard', element: <BlogZodiacStandardPage /> },
      { path: 'blog/mbti-love-style', element: <BlogMbtiLoveStylePage /> },
      { path: 'privacy-policy', element: <PrivacyPolicyPage /> },
      { path: 'terms-of-service', element: <TermsOfServicePage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
  },
]
