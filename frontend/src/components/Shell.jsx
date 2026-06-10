import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { getCurrentUser, getAuthToken } from '../services/api.js';
import { LayoutDashboard, ListTodo, PlusCircle, Terminal } from 'lucide-react';

export const Shell = ({ children }) => {
  const location = useLocation();
  const [user] = useState(getCurrentUser());
  const [tokenStatus, setTokenStatus] = useState('loading');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }, []);

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

  const basePath = location.pathname.startsWith('/helpdesk') ? '/helpdesk' : '';

  const isDashboardActive = location.pathname === '/' || location.pathname === '/helpdesk' || location.pathname === '/helpdesk/';
  const isTicketsActive = location.pathname.endsWith('/tickets') || location.pathname.includes('/ticket/') || location.pathname.includes('/update/');
  const isCreateActive = location.pathname.endsWith('/create');

  return (
    <div className="app-container">
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
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <NavLink
            to={basePath || "/"}
            className="btn"
            style={{
              justifyContent: 'flex-start',
              background: isDashboardActive ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
              color: isDashboardActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: isDashboardActive ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
            }}
          >
            <LayoutDashboard size={18} /> Command Center
          </NavLink>
          <NavLink
            to={`${basePath}/tickets`}
            className="btn"
            style={{
              justifyContent: 'flex-start',
              background: isTicketsActive ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
              color: isTicketsActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: isTicketsActive ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
            }}
          >
            <ListTodo size={18} /> Support Tickets
          </NavLink>
          <NavLink
            to={`${basePath}/create`}
            className="btn"
            style={{
              justifyContent: 'flex-start',
              background: isCreateActive ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
              color: isCreateActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: isCreateActive ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
            }}
          >
            <PlusCircle size={18} /> File Ticket
          </NavLink>
        </nav>

        <div className="glass-card" style={{ marginTop: 'auto', padding: '16px', background: 'var(--card-item-bg)', borderColor: 'var(--card-item-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Helpdesk Operator</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', marginTop: '16px', color: 'var(--text-muted)' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: tokenStatus === 'success' ? 'var(--success)' : tokenStatus === 'loading' ? 'var(--warning)' : 'var(--danger)'
            }} />
            <span>Session: {tokenStatus === 'success' ? 'Active' : tokenStatus}</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};
