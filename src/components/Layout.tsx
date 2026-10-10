import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { REPORT } from '../data/places'
import { useStore } from '../lib/store'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/history', label: 'History' },
  { to: '/places', label: 'Places' },
  { to: '/map', label: 'Map' },
  { to: '/compare', label: 'Compare' },
  { to: '/scorecard', label: 'Scorecard' },
  { to: '/food', label: 'Food finder' },
  { to: '/notes', label: 'My notes' },
]

export default function Layout() {
  const { theme, toggleTheme, saved } = useStore()
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => { setOpen(false); window.scrollTo(0, 0) }, [loc.pathname])

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium transition ${isActive ? 'bg-teal-700 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-[1100] border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          <NavLink to="/" className="mr-2 flex items-center gap-2 font-bold text-teal-700 dark:text-teal-400">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-teal-700 text-sm text-white">⛰</span>
            Tom’s Move
          </NavLink>
          <nav className="hidden flex-1 items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkCls}>
                {l.label}{l.to === '/notes' && saved.favorites.length > 0 ? ` (${saved.favorites.length}★)` : ''}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={toggleTheme} className="btn" aria-label="Toggle dark mode" title="Toggle dark mode">
              {theme === 'dark' ? '☀ Light' : '☾ Dark'}
            </button>
            <button className="btn lg:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Menu">☰</button>
          </div>
        </div>
        {open && (
          <nav className="grid grid-cols-2 gap-1 border-t border-slate-200 p-3 lg:hidden dark:border-slate-800">
            {LINKS.map((l) => <NavLink key={l.to} to={l.to} end={l.end} className={linkCls}>{l.label}</NavLink>)}
            <NavLink to="/credits" className={linkCls}>Credits & method</NavLink>
          </nav>
        )}
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white py-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        <div className="mx-auto max-w-6xl space-y-2 px-4">
          <p><b>About this data.</b> {REPORT.disclaimer}</p>
          <p>Report date {REPORT.reportDate} · latest scout {REPORT.latestScout} · <NavLink to="/credits" className="text-teal-700 underline dark:text-teal-400">Photo credits & scoring method</NavLink> · Map data © OpenStreetMap contributors</p>
        </div>
      </footer>
    </div>
  )
}
