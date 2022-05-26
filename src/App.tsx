import { useEffect, useState } from 'react'
import { Routes, Route, NavLink, Link } from 'react-router-dom'
import Home from './components/home/Home'
import Fight from './components/fight/Fight'
import Gallery from './components/gallery/Gallery'
import Stats from './components/stats/Stats'
import History from './components/history/History'
import './App.css'
import logo from './hamster-logo.png'

function App() {
  const [hamburgerOpen, setHamburgerOpen] = useState(false)
  return (
    <div
      className="App"
      onClick={() => {
        if (hamburgerOpen) {
          setHamburgerOpen(false)
        }
      }}
    >
      <header>
        <nav className="desktop-nav">
          <Link className="logo-link" to="/">
            <div className="logo-container">
              <img className="header-logo" src={logo} alt="site logo" />
            </div>
          </Link>
          <NavLink className="desk-nav" to="/">
            Hem
          </NavLink>
          <NavLink className="desk-nav" to="/fight">
            Match
          </NavLink>
          <NavLink className="desk-nav" to="/gallery">
            Galleri
          </NavLink>
          <NavLink className="desk-nav" to="/stats">
            Statistik
          </NavLink>
          <NavLink className="desk-nav" to="/history">
            Historik
          </NavLink>
        </nav>
        <nav className="mobile-nav">
          <Link to="/">
            <div className="logo-container">
              <img className="header-logo" src={logo} alt="site logo" />
            </div>
          </Link>
          <h1>Hamster Wars</h1>
          <div
            className={`hamburger${hamburgerOpen ? ' open' : ''}`}
            onClick={() => setHamburgerOpen(!hamburgerOpen)}
          >
            <div className="line line1"></div>
            <div className="line line2"></div>
            <div className="line line3"></div>
          </div>
          <div className={`menu${hamburgerOpen ? ' open-menu' : ''}`}>
            <NavLink
              onClick={() => setHamburgerOpen(false)}
              className="nav-home"
              to="/"
            >
              Hem
            </NavLink>
            <NavLink
              onClick={() => setHamburgerOpen(false)}
              className="nav-fight"
              to="/fight"
            >
              Match
            </NavLink>
            <NavLink
              onClick={() => setHamburgerOpen(false)}
              className="nav-gallery"
              to="/gallery"
            >
              Galleri
            </NavLink>
            <NavLink
              onClick={() => setHamburgerOpen(false)}
              className="nav-stats"
              to="/stats"
            >
              Statistik
            </NavLink>
            <NavLink
              onClick={() => setHamburgerOpen(false)}
              className="nav-history"
              to="/history"
            >
              Historik
            </NavLink>
          </div>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fight" element={<Fight />} />
          <Route path="/gallery/*" element={<Gallery />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/history" element={<History />} />
          <Route path="/*" element={<Home />} />
        </Routes>
      </main>
      <footer>
        <p>Hamsterwars - David Forsyth Rosin 2022</p>
      </footer>
    </div>
  )
}

export default App
