import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './components/home/Home'
import Fight from './components/fight/Fight'
import Gallery from './components/gallery/Gallery'
import Stats from './components/stats/Stats'
import History from './components/history/History'
import './App.css'
import logo from './hamster-logo.png'

function App() {
  return (
    <div className="App">
      <header>
        <nav>
          <div className="logo-container">
            <img className="header-logo" src={logo} alt="" />
          </div>
          <NavLink className="nav-home" to="/">
            Hem
          </NavLink>
          <NavLink className="nav-fight" to="/fight">
            Match
          </NavLink>
          <NavLink className="nav-gallery" to="/gallery">
            Galleri
          </NavLink>
          <NavLink className="nav-stats" to="/stats">
            Statistik
          </NavLink>
          <NavLink className="nav-history" to="/history">
            Historik
          </NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fight" element={<Fight />} />
          <Route path="/gallery/*" element={<Gallery />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
      <footer>
        <p>Hamsterwars - David Forsyth Rosin 2022</p>
      </footer>
    </div>
  )
}

export default App
