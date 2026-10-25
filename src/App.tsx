import { HashRouter, Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'
import History from './pages/History'
import Places from './pages/Places'
import PlaceDetail from './pages/PlaceDetail'
import Compare from './pages/Compare'
import Homes from './pages/Homes'
import Scorecard from './pages/Scorecard'
import Food from './pages/Food'
import Notes from './pages/Notes'
import Credits from './pages/Credits'
import { StoreProvider } from './lib/store'

const MapPage = lazy(() => import('./pages/MapPage'))

function NotFound() {
  return <div className="card p-8 text-center">Page not found.</div>
}

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="history" element={<History />} />
            <Route path="places" element={<Places />} />
            <Route path="places/:id" element={<PlaceDetail />} />
            <Route path="homes" element={<Homes />} />
            <Route path="map" element={<Suspense fallback={<p>Loading map…</p>}><MapPage /></Suspense>} />
            <Route path="compare" element={<Compare />} />
            <Route path="scorecard" element={<Scorecard />} />
            <Route path="food" element={<Food />} />
            <Route path="notes" element={<Notes />} />
            <Route path="credits" element={<Credits />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </StoreProvider>
  )
}
