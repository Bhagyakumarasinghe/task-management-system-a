import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'Active' });
  const [editingId, setEditingId] = useState(null);
  
  // Task Modal States
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assigned_to: '',
    due_date: '',
    priority: 'Medium',
    status: 'Pending'
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [modalMessage, setModalMessage] = useState({ type: '', text: '' });

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
      if (res.data.length > 0) {
        setTaskForm(prev => ({ ...prev, assigned_to: res.data[0].id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, formData);
        showMessage('success', 'Project updated successfully!');
      } else {
        await api.post('/projects', formData);
        showMessage('success', 'Project created successfully!');
      }
      setFormData({ title: '', description: '', status: 'Active' });
      setEditingId(null);
      fetchProjects();
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Action failed!');
    }
  };

  const handleEditProject = (p) => {
    setEditingId(p.id);
    setFormData({ title: p.title, description: p.description || '', status: p.status });
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project and its tasks?')) {
      try {
        await api.delete(`/projects/${id}`);
        showMessage('success', 'Project deleted successfully!');
        fetchProjects();
      } catch (err) {
        showMessage('error', 'Could not delete project');
      }
    }
  };

  // Task Management Functions
  const openTaskModal = (project) => {
    setSelectedProject(project);
    setTasks(project.tasks || []);
    setModalMessage({ type: '', text: '' });
    setTaskForm({
      title: '',
      description: '',
      assigned_to: users[0]?.id || '',
      due_date: '',
      priority: 'Medium',
      status: 'Pending'
    });
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/tasks', { ...taskForm, project_id: selectedProject.id });
      
      showModalMessage('success', 'Task added successfully!');
      
      // අලුත් task එක UI එකට එකතු කිරීම
      if (res.data) {
        setTasks(prev => [...prev, res.data.task || res.data]);
      }

      fetchProjects();
      
      // Form reset කිරීම
      setTaskForm({ 
        title: '', 
        description: '', 
        assigned_to: users[0]?.id || '', 
        due_date: '', 
        priority: 'Medium', 
        status: 'Pending' 
      });
    } catch (err) {
      showModalMessage('error', err.response?.data?.message || 'Failed to create task!');
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      // 1. Target task එක සොයාගැනීම
      const currentTask = tasks.find(t => t.id === taskId);
      
      // 2. Backend එකෙන් validation error එකක් එන එක වැළැක්වීමට මුළු Task Payload එකම Status එකත් සමඟ යැවීම
      await api.put(`/tasks/${taskId}`, { 
        ...currentTask,
        status: newStatus 
      });

      fetchProjects();
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      showModalMessage('success', 'Task status updated!');
    } catch (err) {
      console.error(err);
      showModalMessage('error', err.response?.data?.message || 'Failed to update task status!');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const showModalMessage = (type, text) => {
    setModalMessage({ type, text });
    setTimeout(() => setModalMessage({ type: '', text: '' }), 3000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Alert Banner for Main Page */}
      {message.text && (
        <div className={`p-4 rounded-xl text-sm font-medium shadow-sm transition-all ${
          message.type === 'success' 
            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
            : 'bg-rose-100 text-rose-800 border border-rose-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Project Workspace</h1>
          <p className="text-slate-500 text-sm">Create, track and assign tasks across all your active projects</p>
        </div>
      </div>

      {/* Project Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4">{editingId ? 'Edit Project' : 'Create New Project'}</h2>
        <form onSubmit={handleProjectSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Project Title *</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. E-Commerce Redesign" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              className="w-full border border-slate-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
            <input 
              type="text" 
              placeholder="Brief project details..." 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              className="w-full border border-slate-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
            <div className="flex gap-2">
              <select 
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value})} 
                className="w-full border border-slate-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition">
                {editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map(p => (
          <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-xl text-slate-800">{p.title}</h3>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  p.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                  p.status === 'Completed' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {p.status}
                </span>
              </div>
              <p className="text-slate-600 text-sm mb-4 line-clamp-2">{p.description || 'No description provided.'}</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <button 
                onClick={() => openTaskModal(p)} 
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2 rounded-lg text-sm flex justify-center items-center gap-2 transition"
              >
                📋 Manage Tasks ({p.tasks?.length || 0})
              </button>
              
              <div className="flex justify-end gap-3 text-xs font-semibold">
                <button onClick={() => handleEditProject(p)} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => handleDeleteProject(p.id)} className="text-rose-600 hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tasks Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{selectedProject.title} - Tasks</h3>
                <p className="text-xs text-slate-500">Manage tasks, assign users and update completion progress</p>
              </div>
              <button onClick={() => setSelectedProject(null)} className="text-slate-400 hover:text-slate-600 text-2xl font-bold">✕</button>
            </div>

            {/* Modal Specific Alert Banner */}
            {modalMessage.text && (
              <div className={`p-3 rounded-xl text-xs font-semibold shadow-sm transition-all ${
                modalMessage.type === 'success' 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                  : 'bg-rose-100 text-rose-800 border border-rose-200'
              }`}>
                {modalMessage.text}
              </div>
            )}

            {/* Add Task Form */}
            <form onSubmit={handleTaskSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-sm font-bold text-slate-700">Add New Task</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input 
                  type="text" 
                  required 
                  placeholder="Task Title *" 
                  value={taskForm.title} 
                  onChange={e => setTaskForm({...taskForm, title: e.target.value})}
                  className="border p-2 rounded-lg text-sm bg-white outline-none focus:ring-1 focus:ring-blue-500"
                />
                <select 
                  value={taskForm.assigned_to} 
                  onChange={e => setTaskForm({...taskForm, assigned_to: e.target.value})}
                  className="border p-2 rounded-lg text-sm bg-white outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Assign to User...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
                <input 
                  type="date" 
                  required 
                  value={taskForm.due_date} 
                  onChange={e => setTaskForm({...taskForm, due_date: e.target.value})}
                  className="border p-2 rounded-lg text-sm bg-white outline-none focus:ring-1 focus:ring-blue-500"
                />
                <select 
                  value={taskForm.priority} 
                  onChange={e => setTaskForm({...taskForm, priority: e.target.value})}
                  className="border p-2 rounded-lg text-sm bg-white outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Low">Priority: Low</option>
                  <option value="Medium">Priority: Medium</option>
                  <option value="High">Priority: High</option>
                </select>

                {/* Status Selection Added directly in Add Task Form */}
                <select 
                  value={taskForm.status} 
                  onChange={e => setTaskForm({...taskForm, status: e.target.value})}
                  className="border p-2 rounded-lg text-sm bg-white outline-none focus:ring-1 focus:ring-blue-500 md:col-span-2"
                >
                  <option value="Pending">Status: Pending</option>
                  <option value="In Progress">Status: In Progress</option>
                  <option value="Completed">Status: Completed</option>
                </select>
              </div>

              <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition">
                + Add Task
              </button>
            </form>

            {/* Tasks List (Existing Tasks) */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-700">Existing Tasks</h4>
              {tasks.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No tasks created under this project yet.</p>
              ) : (
                tasks.map(t => (
                  <div key={t.id} className="p-3 bg-white border border-slate-200 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{t.title}</p>
                      <div className="flex gap-3 text-xs text-slate-500 mt-1">
                        <span>Due: {t.due_date}</span>
                        <span className={`font-semibold ${
                          t.priority === 'High' ? 'text-rose-600' : 
                          t.priority === 'Medium' ? 'text-amber-600' : 'text-slate-600'
                        }`}>
                          Priority: {t.priority}
                        </span>
                      </div>
                    </div>
                    <select 
                      value={t.status} 
                      onChange={(e) => handleTaskStatusChange(t.id, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded-lg border outline-none ${
                        t.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        t.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}