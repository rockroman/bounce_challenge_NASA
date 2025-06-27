import './App.css'
import { Routes, Route } from 'react-router-dom'
import APOD from './components/APOD'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import ImageSearch from './pages/ImageSearch'
import { Toaster, toaster } from "./components/ui/toaster"
import { Text } from '@chakra-ui/react'

function App() {
  return (
    <div className="app">
      <NavBar />
      <Toaster/>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apod" element={<APOD />} />
          <Route path="/search" element={<ImageSearch/>} />
        </Routes>
      </main>

      <footer className="app-footer">
        <Text color="white">Created with NASA Open APIs</Text>
      </footer>
    </div>
  )
}

export default App
