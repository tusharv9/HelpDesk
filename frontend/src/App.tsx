import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { TicketList } from './pages/TicketList';
import { CreateTicket } from './pages/CreateTicket';
import { TicketDetails } from './pages/TicketDetails';
import { UpdateTicket } from './pages/UpdateTicket';
import { getCurrentUser, setCurrentUser, getAuthToken } from './services/api';
import { LayoutDashboard, ListTodo, PlusCircle, Terminal, Sun, Moon } from 'lucide-react';

export const App: React.FC = () => {
  const location = useLocation();
  const [user, setUser] = useState(getCurrentUser());
  const [tokenStatus, setTokenStatus] = useState<'loading' | 'success' | 'failed'>('loading');

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleRoleChange = async (role: string) => {
    let username = 'john_employee';
    if (role === 'SupportAgent') username = 'agent_smith';
    if (role === 'Admin') username = 'admin_boss';
    
    setCurrentUser(username, role);
    setUser({ username, role });
  };

  useEffect(() => {
    setTokenStatus('loading');
    getAuthToken()
      .then(token => {
        if (token) {
          setTokenStatus('success');
        } else {
          setTokenStatus('failed');
        }
      })
      .catch(() => setTokenStatus('failed'));
  }, [user]);

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--primary), var(--info))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 12px var(--primary-glow)'
            }}>
              <Terminal size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>Helpdesk</h2>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Microservice</span>
            </div>
          </div>
          
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <Link
            to="/"
            className="btn"
            style={{
              justifyContent: 'flex-start',
              background: location.pathname === '/' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
              color: location.pathname === '/' ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: location.pathname === '/' ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
            }}
          >
            <LayoutDashboard size={18} /> Command Center
          </Link>
          <Link
            to="/tickets"
            className="btn"
            style={{
              justifyContent: 'flex-start',
              background: location.pathname.startsWith('/tickets') || location.pathname.startsWith('/ticket/') ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
              color: location.pathname.startsWith('/tickets') || location.pathname.startsWith('/ticket/') ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: location.pathname.startsWith('/tickets') || location.pathname.startsWith('/ticket/') ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
            }}
          >
            <ListTodo size={18} /> Support Tickets
          </Link>
          <Link
            to="/create"
            className="btn"
            style={{
              justifyContent: 'flex-start',
              background: location.pathname === '/create' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
              color: location.pathname === '/create' ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: location.pathname === '/create' ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
            }}
          >
            <PlusCircle size={18} /> File Ticket
          </Link>
        </nav>

        {/* Identity & Role Selector */}
        <div className="glass-card" style={{ marginTop: 'auto', padding: '16px', background: 'var(--card-item-bg)', borderColor: 'var(--card-item-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '12px',
              color: 'var(--primary)'
            }}>
              {user.username.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>{user.username}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{user.role}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '2px' }}>Simulation Role</label>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={() => handleRoleChange('Employee')} className="btn btn-secondary" style={{ padding: '6px 8px', fontSize: '11px', flex: 1, background: user.role === 'Employee' ? 'var(--primary)' : 'var(--bg-tertiary)' }}>Emp</button>
              <button onClick={() => handleRoleChange('SupportAgent')} className="btn btn-secondary" style={{ padding: '6px 8px', fontSize: '11px', flex: 1, background: user.role === 'SupportAgent' ? 'var(--primary)' : 'var(--bg-tertiary)' }}>Agent</button>
              <button onClick={() => handleRoleChange('Admin')} className="btn btn-secondary" style={{ padding: '6px 8px', fontSize: '11px', flex: 1, background: user.role === 'Admin' ? 'var(--primary)' : 'var(--bg-tertiary)' }}>Admin</button>
            </div>
          </div>

          {/* Token Status indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', marginTop: '12px', color: 'var(--text-muted)' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: tokenStatus === 'success' ? 'var(--success)' : tokenStatus === 'loading' ? 'var(--warning)' : 'var(--danger)'
            }} />
            <span>JWT Status: {tokenStatus}</span>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tickets" element={<TicketList />} />
          <Route path="/create" element={<CreateTicket />} />
          <Route path="/ticket/:id" element={<TicketDetails />} />
          <Route path="/update/:id" element={<UpdateTicket />} />
        </Routes>
      </main>
    </div>
  );
};
