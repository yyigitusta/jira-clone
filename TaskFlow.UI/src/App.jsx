import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'

function App() {
  return (
    <Routes>
      {/* Ana Sayfa: Home bileşenini göster */}
      <Route path="/" element={<Home />} />
      
      {/* Detay Sayfası: :id değişken bir sayıdır */}
      <Route path="/project/:id" element={<ProjectDetail />} />
    </Routes>
  )
}

export default App