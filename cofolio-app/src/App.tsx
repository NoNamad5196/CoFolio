import { Routes, Route } from 'react-router-dom'
import { useReveal } from './hooks/useReveal'
import { ThemeToggle } from './components/common/ThemeToggle'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import BuilderPage from './pages/BuilderPage'
import GeneratingPage from './pages/GeneratingPage'
import ResultPage from './pages/ResultPage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  useReveal()

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/builder" element={<BuilderPage />} />
        <Route path="/generating" element={<GeneratingPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
      <ThemeToggle />
    </>
  )
}
