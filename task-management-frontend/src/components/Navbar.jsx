import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
      <div className="flex gap-6 items-center">
        <h1 className="text-xl font-bold tracking-wide">TaskManager</h1>
        <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
        <Link to="/projects" className="hover:text-blue-400">Projects</Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-300">Hello, {user?.name}</span>
        <button 
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-medium transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}