import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ConfettiBurst } from './components/ConfettiBurst'

const DataStackPage = lazy(() =>
  import('./pages/DataStackPage').then((m) => ({ default: m.DataStackPage })),
)

export default function App() {
  return (
    <BrowserRouter>
      <ConfettiBurst />
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<p className="page-loading">Sack Me!…</p>}>
              <DataStackPage />
            </Suspense>
          }
        />
        <Route path="/pm-game" element={<Navigate to="/" replace />} />
        <Route path="/sack-me" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
