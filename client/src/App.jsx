import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import HomePage from './pages/HomePage'
import VentPage from './pages/VentPage'
import VoiceVentPage from './pages/VoiceVentPage'
import ListenerPage from './pages/ListenerPage'
import PatiencePage from './pages/PatiencePage'

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/vent" element={<VentPage />} />
          <Route path="/voice" element={<VoiceVentPage />} />
          <Route path="/listener" element={<ListenerPage />} />
          <Route path="/patience" element={<PatiencePage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  )
}
