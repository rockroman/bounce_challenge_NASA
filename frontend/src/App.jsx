import './App.css'
import { Routes, Route } from 'react-router-dom'
import APOD from './components/APOD'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import About from './pages/About'
import ImageSearch from './pages/ImageSearch'

function App() {
  return (
    <div className="app">
      <NavBar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apod" element={<APOD />} />
          <Route path="/about" element={<About/>} />
          <Route path="/search" element={<ImageSearch/>} />
        </Routes>
      </main>
      <footer className="app-footer">
        <p>Created with NASA Open APIs</p>
      </footer>
    </div>
  )
}

export default App
