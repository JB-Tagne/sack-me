import { HashRouter, Navigate, Route, Routes } from 'react-router'
import { ConfettiBurst } from './components/ConfettiBurst'
import { DataStackPage } from './pages/DataStackPage'

/**
 * HashRouter works in Streamlit srcdoc iframes (BrowserRouter breaks on about:srcdoc).
 * Eager import keeps a single IIFE bundle without dynamic import().
 */
export default function App() {
  return (
    <HashRouter>
      <ConfettiBurst />
      <Routes>
        <Route path="/" element={<DataStackPage />} />
        <Route path="/pm-game" element={<Navigate to="/" replace />} />
        <Route path="/sack-me" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
