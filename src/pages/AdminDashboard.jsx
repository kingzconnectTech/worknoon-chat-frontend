import { useEffect, useState } from 'react';
import { Users, Activity, MessageSquare, TrendingUp, UserPlus, Trash2, Loader2, X, Mail, Lock, User, Shield, Briefcase } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import useChatStore from '../store/useChatStore';
import useAuthStore from '../store/useAuthStore';

const ROLE_LABELS = {
  agent: { label: 'Agent', color: 'text-blue-400 bg-blue-500/15' },
  merchant: { label: 'Merchant', color: 'text-amber-400 bg-amber-500/15' },
  designer: { label: 'Designer', color: 'text-pink-400 bg-pink-500/15' },
};

const StatCard = ({ icon: Icon, title, value, trend }) => (
  <div className="glass-card p-6 rounded-3xl">
    <div className="flex items-start justify-between">
      <div className="p-3 bg-white/5 rounded-xl text-accent">
        <Icon size={24} />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-sm font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
          <TrendingUp size={14} />
          {trend}
        </div>
      )}
    </div>
    <div className="mt-4">
      <h3 className="text-3xl font-bold text-white">{value}</h3>
      <p className="text-muted mt-1 font-medium">{title}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, activeConversations: 0, totalMessages: 0 });
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'agent' });
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const { onlineUsers } = useChatStore();
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      console.log('=== Fetching /admin/users ===');
      const res = await api.get('/admin/users');
      console.log('Full response from /admin/users:', res);
      console.log('res.data:', res.data);
      console.log('res.data.data:', res.data.data);
      console.log('Users to set:', res.data.data.users);
      setUsers(res.data.data.users);
    } catch (err) {
      console.error('Failed to load users', err);
      console.error('Error details:', err.response?.data);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
      api.get('/admin/stats')
        .then(r => {
          console.log('=== Fetching /admin/stats ===');
          console.log('Full response from /admin/stats:', r);
          console.log('r.data:', r.data);
          console.log('r.data.data:', r.data.data);
          setStats(r.data.data);
        })
        .catch(err => {
          console.error('Failed to load stats', err);
          console.error('Error details:', err.response?.data);
        });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (location.state?.openAddUser) {
      setShowModal(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setFormError('All fields are required.');
      return;
    }
    setCreating(true);
    try {
      await api.post('/admin/users', formData);
      setShowModal(false);
      setFormData({ name: '', email: '', password: '', role: 'agent' });
      fetchUsers();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Remove this user account?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      console.error('Failed to delete user', err);
    }
  };

  const handleStartChat = async (userId) => {
    try {
      const res = await api.post('/conversations', {
        participants: [userId],
        type: 'support'
      });
      useChatStore.getState().setActiveConversation(res.data.data.conversation);
      navigate('/');
    } catch (err) {
      console.error('Failed to start chat', err);
    }
  };

  const filteredUsers = filterRole === 'all' ? users : users.filter(u => u.role === filterRole);

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-muted">Manage users and monitor platform activity.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={Users} title="Total Users" value={stats.totalUsers || 0} trend="+12%" />
          <StatCard icon={Activity} title="Online Now" value={onlineUsers.length || 0} trend="+5%" />
          <StatCard icon={MessageSquare} title="Active Chats" value={stats.activeConversations || 0} trend="+18%" />
          <StatCard icon={TrendingUp} title="Total Messages" value={stats.totalMessages || 0} />
        </div>

        {/* Per-Role Conversation Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl">
            <div className="flex items-start justify-between">
              <div className="p-3 bg-blue-500/15 rounded-xl text-blue-400">
                <Briefcase size={24} />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-white">{stats.roleConversationCounts?.agent || 0}</h3>
              <p className="text-muted mt-1 font-medium">Agent Conversations</p>
            </div>
          </div>
          <div className="glass-card p-6 rounded-3xl">
            <div className="flex items-start justify-between">
              <div className="p-3 bg-amber-500/15 rounded-xl text-amber-400">
                <Briefcase size={24} />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-white">{stats.roleConversationCounts?.merchant || 0}</h3>
              <p className="text-muted mt-1 font-medium">Merchant Conversations</p>
            </div>
          </div>
          <div className="glass-card p-6 rounded-3xl">
            <div className="flex items-start justify-between">
              <div className="p-3 bg-pink-500/15 rounded-xl text-pink-400">
                <Briefcase size={24} />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-white">{stats.roleConversationCounts?.designer || 0}</h3>
              <p className="text-muted mt-1 font-medium">Designer Conversations</p>
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <div className="glass-card rounded-3xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Managed Users</h2>
              <p className="text-muted text-sm mt-1">Agents, merchants, and designers created by admin.</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Role filter tabs */}
              <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
                {['all', 'agent', 'merchant', 'designer'].map(r => (
                  <button
                    key={r}
                    onClick={() => setFilterRole(r)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${filterRole === r ? 'bg-accent text-white shadow' : 'text-muted hover:text-white'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent to-purple-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-accent/20 whitespace-nowrap"
              >
                <UserPlus size={18} />
                Add User
              </button>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex items-center justify-center py-16 text-muted">
              <Loader2 size={28} className="animate-spin mr-3" /> Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <Shield size={28} className="text-muted" />
              </div>
              <p className="text-white font-medium mb-1">No users yet</p>
              <p className="text-muted text-sm">Click "Add User" to create an agent, merchant, or designer.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map(u => {
                const roleInfo = ROLE_LABELS[u.role] || { label: u.role, color: 'text-muted bg-white/5' };
                return (
                  <div key={u._id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/8 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-accent font-bold text-sm uppercase">{u.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white">{u.name}</p>
                      <p className="text-muted text-sm truncate">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${roleInfo.color}`}>
                        {roleInfo.label}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${onlineUsers.includes(u._id) ? 'bg-green-500/15 text-green-400' : 'bg-white/5 text-muted'}`}>
                        {onlineUsers.includes(u._id) ? 'Online' : 'Offline'}
                      </span>
                      <button
                        onClick={() => handleStartChat(u._id)}
                        className="p-2 rounded-xl text-muted hover:text-accent hover:bg-accent/10 transition-colors opacity-0 group-hover:opacity-100"
                        title="Chat with user"
                      >
                        <MessageSquare size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="p-2 rounded-xl text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove user"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card rounded-3xl p-8 w-full max-w-md relative">
            <button
              onClick={() => { setShowModal(false); setFormError(''); setFormData({ name: '', email: '', password: '', role: 'agent' }); }}
              className="absolute top-5 right-5 p-2 rounded-xl text-muted hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-1">Add User</h3>
              <p className="text-muted text-sm">Create an agent, merchant, or designer account.</p>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-muted" />
                  </div>
                  <input
                    type="text"
                    placeholder="Jane Smith"
                    className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-muted" />
                  </div>
                  <input
                    type="email"
                    placeholder="user@worknoon.com"
                    className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-muted" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300 ml-1">Role</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-muted" />
                  </div>
                  <select
                    className="block w-full pl-11 pr-4 py-3 bg-card border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all appearance-none"
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="agent">Agent</option>
                    <option value="merchant">Merchant</option>
                    <option value="designer">Designer</option>
                  </select>
                </div>
              </div>

              {formError && (
                <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{formError}</p>
              )}

              <button
                type="submit"
                disabled={creating}
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-accent to-purple-500 hover:opacity-90 transition-all disabled:opacity-70 mt-2 shadow-lg shadow-accent/20"
              >
                {creating ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create User'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
