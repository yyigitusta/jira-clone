import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom' 
import api from '../api'

function Home() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newProject, setNewProject] = useState({ name: '', description: '' })
  
  const navigate = useNavigate() 
  useEffect(() => {
    api.get('/Projects').then(res => {
        setProjects(res.data);
        setLoading(false);
      });
  }, [])

  const handleSave = () => {
    if (!newProject.name) return alert("Proje adı şart!");
    api.post('/Projects', newProject).then(res => {
        setProjects([...projects, res.data]);
        setIsModalOpen(false);
        setNewProject({ name: '', description: '' });
      });
  }

  return (
    <div className="min-h-screen p-10 relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Projeler</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium shadow-lg transition">
          + Yeni Proje
        </button>
      </div>
      
      {loading ? <p>Yükleniyor...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div 
              key={project.id} 
              onClick={() => navigate(`/project/${project.id}`)}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition border border-gray-200 cursor-pointer group"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition">{project.name}</h2>
              <p className="text-gray-600 line-clamp-3 mb-4">{project.description || "Açıklama yok."}</p>
              <div className="flex justify-between items-center text-sm text-gray-400 border-t pt-4">
                <span>ID: {project.id}</span>
                <span className="text-blue-500">Detaylar →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-4">Yeni Proje</h2>
            <input type="text" className="w-full border p-2 rounded mb-4" placeholder="Adı" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} />
            <textarea className="w-full border p-2 rounded mb-4" placeholder="Açıklama" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600">İptal</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home