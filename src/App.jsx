import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Movies from './pages/Movies'
import TV from './pages/TV'
import Requests from './pages/Requests'
import Downloads from './pages/Downloads'

export default function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tv" element={<TV />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/downloads" element={<Downloads />} />
        </Routes>
      </div>
    </Router>
  )
}
