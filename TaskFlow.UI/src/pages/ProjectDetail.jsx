import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core'
import api from '../api'

// --- RENKLER & TANIMLAR ---
const STATUS_TYPES = {
  0: { label: 'Yapılacak', color: 'bg-gray-100 text-gray-600 border-gray-200' },
  1: { label: 'Sürüyor', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  2: { label: 'Bitti', color: 'bg-green-50 text-green-600 border-green-200' }
}

const PRIORITY_LABELS = { 0: 'Düşük', 1: 'Orta', 2: 'Yüksek' }

// --- 1. KART BİLEŞENİ (Kullanıcı Avatarı Eklendi) ---
function DraggableTask({ task, onDelete }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: { task }
  });

  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;

  const handleDeleteClick = (e) => {
    e.stopPropagation(); e.preventDefault(); onDelete(task.id);
  };

  // İsimden Baş Harf Çıkarma (Örn: Yiğit Developer -> YD)
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} 
         className="bg-white p-4 rounded-md shadow-sm border border-gray-200 hover:shadow-md cursor-grab active:cursor-grabbing group relative mb-3 z-10">
      
      {/* Silme Butonu */}
      <button onPointerDown={(e) => e.stopPropagation()} onClick={handleDeleteClick}
        className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
      </button>

      <div className="flex justify-between items-start mb-2 pr-6">
        <h4 className="font-semibold text-gray-800 text-sm">{task.title}</h4>
        <span className={`text-[10px] px-2 py-0.5 rounded border ${
          task.priority === 2 ? 'bg-red-50 text-red-600 border-red-200' : 
          task.priority === 1 ? 'bg-orange-50 text-orange-600 border-orange-200' : 
          'bg-green-50 text-green-600 border-green-200'
        }`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
      </div>
      
      <p className="text-xs text-gray-500 line-clamp-2 mb-3">
        {task.description || "Açıklama yok"}
      </p>

      {/* Alt Bilgi: ID ve Avatar */}
      <div className="flex justify-between items-center border-t pt-2 mt-2">
        <div className="text-[10px] text-gray-400">#{task.id}</div>
        
        {/* Kullanıcı Avatarı */}
        {task.assignee && (
           <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold border border-indigo-200" title={task.assignee.fullName}>
             {getInitials(task.assignee.fullName)}
           </div>
        )}
      </div>
    </div>
  );
}

// --- 2. SÜTUN BİLEŞENİ ---
function DroppableColumn({ statusId, tasks, onDeleteTask }) {
  const { setNodeRef } = useDroppable({ id: statusId });

  return (
    <div ref={setNodeRef} className="flex flex-col h-full min-w-[280px]">
      <div className={`flex items-center justify-between p-3 rounded-t-lg border-t-4 border-b bg-white shadow-sm ${STATUS_TYPES[statusId].color.split(' ')[2]}`}>
        <h3 className="font-bold text-gray-700">{STATUS_TYPES[statusId].label}</h3>
        <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full font-bold">{tasks.length}</span>
      </div>
      <div className="bg-gray-100 p-3 rounded-b-lg flex-1 min-h-[200px]">
        {tasks.map(task => <DraggableTask key={task.id} task={task} onDelete={onDeleteTask} />)}
        {tasks.length === 0 && <div className="h-full w-full text-transparent">Boş</div>}
      </div>
    </div>
  );
}

// --- 3. ANA BİLEŞEN ---
function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([]) // YENİ: Kullanıcı Listesi
  const [loading, setLoading] = useState(true)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 1, status: 0, assigneeId: '' })

  const fetchData = () => {
    Promise.all([
      api.get(`/Projects/${id}`),
      api.get('/TaskItems'),
      api.get('/Users') // YENİ: Kullanıcıları da çek
    ])
    .then(([projectRes, tasksRes, usersRes]) => {
      setProject(projectRes.data)
      setTasks(tasksRes.data.filter(t => t.projectId == id))
      setUsers(usersRes.data) // Kullanıcıları kaydet
      setLoading(false)
    })
    .catch(err => setLoading(false))
  }

  useEffect(() => { fetchData() }, [id])

  const handleSaveTask = () => {
    if (!newTask.title) return alert("Başlık şart!")
    
    // AssigneeId boşsa null gönderelim
    const payload = {
      ...newTask,
      projectId: parseInt(id),
      assigneeId: newTask.assigneeId ? parseInt(newTask.assigneeId) : null 
    }

    api.post('/TaskItems', payload)
      .then(res => {
        // Yeni görev geldiğinde içinde Assignee nesnesi olmayabilir (sadece ID döner).
        // Listeyi düzgün göstermek için sayfayı yenilemek yerine manuel eşleştirme yapıyoruz:
        const createdTask = res.data;
        if (createdTask.assigneeId) {
            createdTask.assignee = users.find(u => u.id === createdTask.assigneeId);
        }
        
        setTasks([...tasks, createdTask])
        setIsModalOpen(false)
        setNewTask({ title: '', description: '', priority: 1, status: 0, assigneeId: '' })
      })
  }

  const handleDeleteTask = (taskId) => {
    if (!window.confirm("Silmek istediğine emin misin?")) return;
    api.delete(`/TaskItems/${taskId}`)
      .then(() => setTasks(prev => prev.filter(t => t.id !== taskId)))
      .catch(err => alert("Hata oluştu"))
  }

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    const taskId = active.id;
    const newStatus = parseInt(over.id);
    const draggedTask = tasks.find(t => t.id === taskId);
    if (draggedTask.status === newStatus) return;

    const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
    setTasks(updatedTasks);
    api.put(`/TaskItems/${taskId}`, { ...draggedTask, status: newStatus }).catch(() => setTasks(tasks));
  };

  if (loading) return <div className="p-10">Yükleniyor...</div>
  if (!project) return <div className="p-10">Proje bulunamadı!</div>

  return (
    <div className="min-h-screen p-6 md:p-10 flex flex-col relative">
      <div className="flex justify-between items-start mb-8 border-b pb-6">
        <div>
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-black mb-2 text-sm">← Projelere Dön</button>
          <h1 className="text-3xl font-bold text-slate-800">{project.name}</h1>
          <p className="text-gray-500 mt-1">{project.description}</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-md">
          + Yeni Görev Ekle
        </button>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto pb-10">
          {[0, 1, 2].map(statusId => (
            <DroppableColumn key={statusId} statusId={statusId} tasks={tasks.filter(t => t.status === statusId)} onDeleteTask={handleDeleteTask} />
          ))}
        </div>
      </DndContext>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-bounce-in">
            <h2 className="text-xl font-bold mb-4">Yeni Görev</h2>
            <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                  <input type="text" className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-indigo-500" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                   <select className="w-full border p-2 rounded" value={newTask.status} onChange={e => setNewTask({...newTask, status: parseInt(e.target.value)})}>
                     <option value={0}>Yapılacak</option><option value={1}>Sürüyor</option><option value={2}>Bitti</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Öncelik</label>
                   <select className="w-full border p-2 rounded" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: parseInt(e.target.value)})}>
                     <option value={0}>Düşük</option><option value={1}>Orta</option><option value={2}>Yüksek</option>
                   </select>
                </div>
              </div>

              {/* YENİ: KULLANICI SEÇİMİ */}
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Kime Atansın?</label>
                 <select 
                    className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-indigo-500" 
                    value={newTask.assigneeId} 
                    onChange={e => setNewTask({...newTask, assigneeId: e.target.value})}
                 >
                   <option value="">Atanmamış</option>
                   {users.map(user => (
                     <option key={user.id} value={user.id}>{user.fullName}</option>
                   ))}
                 </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                <textarea className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-indigo-500" rows="3" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})}></textarea>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600">İptal</button>
              <button onClick={handleSaveTask} className="px-4 py-2 bg-indigo-600 text-white rounded">Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectDetail