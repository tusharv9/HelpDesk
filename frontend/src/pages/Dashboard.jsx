import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { CheckCircle, Clock, FileText, Inbox, ShieldAlert } from 'lucide-react';

export const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getTickets()
      .then(data => {
        setTickets(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch tickets');
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: '24px', color: 'var(--text-secondary)' }}>Loading dashboard...</div>;
  if (error) return <div style={{ padding: '24px', color: 'var(--danger)' }}>Error: {error}</div>;

  const total = tickets.length;
  const open = tickets.filter(t => t.status === 'Open').length;
  const inProgress = tickets.filter(t => t.status === 'InProgress').length;
  const resolved = tickets.filter(t => t.status === 'Resolved').length;
  const critical = tickets.filter(t => t.priority === 'Critical' || t.priority === 'High').length;

  const categories = {};
  tickets.forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + 1;
  });

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Helpdesk Command Center</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Real-time overview of system tickets, actions, and SLA compliance metrics.</p>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
            <FileText size={28} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Total Tickets</div>
            <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{total}</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--status-open-bg)', color: 'var(--status-open)' }}>
            <Inbox size={28} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Open</div>
            <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{open}</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--status-inprogress-bg)', color: 'var(--status-inprogress)' }}>
            <Clock size={28} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>In Progress</div>
            <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{inProgress}</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--status-resolved-bg)', color: 'var(--status-resolved)' }}>
            <CheckCircle size={28} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Resolved</div>
            <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{resolved}</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
            <ShieldAlert size={28} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>High/Critical</div>
            <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--danger)' }}>{critical}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        {/* Recent Tickets */}
        <div className="glass-card">
          <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Recent Tickets</h2>
          {tickets.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No tickets found. Click "Create Ticket" to get started!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {tickets.slice(0, 5).map(t => (
                <div key={t.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  borderRadius: '8px',
                  background: 'var(--card-item-bg)',
                  border: '1px solid var(--card-item-border)'
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>{t.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      ID: #{t.id} • Created by: {t.createdBy} • Cat: {t.category}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span className={`badge badge-${t.status.toLowerCase()}`}>{t.status}</span>
                    <span className={`badge badge-${t.priority.toLowerCase()}`} style={{ background: 'var(--badge-priority-bg)' }}>{t.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="glass-card">
          <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Category Breakdown</h2>
          {Object.keys(categories).length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No data available.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Object.entries(categories).map(([cat, count]) => {
                const percentage = total > 0 ? (count / total) * 100 : 0;
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 500 }}>{cat}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{count} ({Math.round(percentage)}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--category-progress-bg)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${percentage}%`, height: '100%', background: 'var(--primary)', borderRadius: '3px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
