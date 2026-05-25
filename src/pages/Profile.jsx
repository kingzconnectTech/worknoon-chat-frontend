import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Mail, Briefcase, Clock, Shield, LayoutDashboard, UserPlus, LogOut } from 'lucide-react';

const ROLE_STYLES = {
  admin:    { label: 'Administrator', color: 'text-purple-400 bg-purple-500/15 border border-purple-500/20' },
  agent:    { label: 'Agent',         color: 'text-blue-400 bg-blue-500/15 border border-blue-500/20' },
  merchant: { label: 'Merchant',      color: 'text-amber-400 bg-amber-500/15 border border-amber-500/20' },
  designer: { label: 'Designer',      color: 'text-pink-400 bg-pink-500/15 border border-pink-500/20' },
  customer: { label: 'Customer',      color: 'text-green-400 bg-green-500/15 border border-green-500/20' },
};

const InfoRow = ({ icon: Icon, label, value, iconClass = 'text-muted' }) => (
  <div className="flex items-start gap-4">
    <div className="p-3 bg-white/5 rounded-xl flex-shrink-0">
      <Icon size={20} className={iconClass} />
    </div>
    <div className="min-w-0">
      <p className="text-sm text-muted mb-0.5">{label}</p>
      <p className="text-white font-medium break-all">{value}</p>
    </div>
  </div>
);

const Profile = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const roleInfo = ROLE_STYLES[user.role] || { label: user.role, color: 'text-muted bg-white/5' };
  const initials = user.name ? user.name.charAt(0).toUpperCase() : '?';
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const isAdmin = user.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex-1 flex flex-col items-center py-12 px-4 sm:px-6 overflow-y-auto scrollbar-custom">
      <div className="w-full max-w-3xl space-y-6">

        {/* Profile Header Card */}
        <div className="glass-card rounded-3xl overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-accent/50 via-purple-600/30 to-blue-600/20 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
          </div>

          {/* Avatar + Info */}
          <div className="px-8 pb-8 -mt-16 relative">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              {/* Avatar */}
              <div className="w-28 h-28 rounded-2xl border-4 border-card bg-slate-800 flex items-center justify-center overflow-hidden shadow-2xl flex-shrink-0">
                {user.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-white">{initials}</span>
                )}
              </div>

              {/* Name & Role */}
              <div className="flex-1 mb-1">
                <h1 className="text-2xl font-bold text-white leading-tight">{user.name}</h1>
                <p className="text-muted text-sm mt-0.5">{user.email}</p>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${roleInfo.color}`}>
                    <Shield size={12} />
                    {roleInfo.label}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Online
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 sm:mb-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-muted rounded-xl transition-colors text-sm font-medium border border-white/5"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Quick Actions — only for admin */}
        {isAdmin && (
          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-accent/20 rounded-xl">
                <LayoutDashboard size={20} className="text-accent" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Admin Controls</h2>
                <p className="text-muted text-sm">Manage your platform from the dashboard.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-3 p-4 bg-white/5 hover:bg-accent/10 border border-white/5 hover:border-accent/30 rounded-2xl transition-all group"
              >
                <div className="p-2.5 bg-accent/15 rounded-xl group-hover:bg-accent/25 transition-colors">
                  <LayoutDashboard size={20} className="text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Dashboard</p>
                  <p className="text-muted text-xs">View stats & activity</p>
                </div>
              </Link>

              <Link
                to="/dashboard"
                state={{ openAddUser: true }}
                className="flex items-center gap-3 p-4 bg-white/5 hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/30 rounded-2xl transition-all group"
              >
                <div className="p-2.5 bg-purple-500/15 rounded-xl group-hover:bg-purple-500/25 transition-colors">
                  <UserPlus size={20} className="text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Add User</p>
                  <p className="text-muted text-xs">Create agent, merchant or designer</p>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Info */}
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <h3 className="text-base font-semibold text-white">Contact Information</h3>
            <InfoRow icon={Mail}     label="Email Address"  value={user.email} />
            <InfoRow icon={Briefcase} label="Role / Department" value={`${roleInfo.label} Team`} />
          </div>

          {/* Activity */}
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <h3 className="text-base font-semibold text-white">Session Details</h3>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-500/10 rounded-xl flex-shrink-0">
                <span className="flex w-5 h-5 items-center justify-center">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-30" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                  </span>
                </span>
              </div>
              <div>
                <p className="text-sm text-muted mb-0.5">Current Status</p>
                <p className="text-white font-medium">Online</p>
              </div>
            </div>

            <InfoRow icon={Clock} label="Your Timezone" value={timezone} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
