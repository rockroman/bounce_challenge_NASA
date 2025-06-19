import './App.css'
import APOD from './components/APOD'
import NavBar from './components/NavBar'

function App() {
  return (
    <div className="app">
      <NavBar />
      <main className="app-main">
        <APOD />
      </main>
      <footer className="app-footer">
        <p>Created with NASA Open APIs</p>
      </footer>
    </div>
  )
}

export default App
