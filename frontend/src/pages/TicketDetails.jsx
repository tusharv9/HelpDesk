import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api, getCurrentUser } from '../services/api.js';
import { ArrowLeft, MessageSquare, History, UserCheck, CheckCircle, AlertTriangle, Send } from 'lucide-react';

export const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const ticketId = Number(id);

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [newComment, setNewComment] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const [actionError, setActionError] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const currentUser = getCurrentUser();

  const loadAll = async () => {
    try {
      const ticketData = await api.getTicket(ticketId);
      setTicket(ticketData);
      setNewAssignee(ticketData.assignedTo || '');

      const commentsData = await api.getComments(ticketId);
      setComments(commentsData);

      const historyData = await api.getHistory(ticketId);
      setHistory(historyData);

      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load ticket details.');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId, currentUser.role, currentUser.username]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentSubmitting(true);
    setActionError('');

    try {
      const added = await api.addComment(ticketId, newComment);
      setComments([added, ...comments]);
      setNewComment('');
      
      const historyData = await api.getHistory(ticketId);
      setHistory(historyData);
    } catch (err) {
      setActionError(err.message || 'Failed to add comment.');
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    setActionError('');
    try {
      const updated = await api.updateStatus(ticketId, status);
      setTicket(updated);
      
      const historyData = await api.getHistory(ticketId);
      setHistory(historyData);
    } catch (err) {
      setActionError(err.message || 'Failed to update status.');
    }
  };

  const handleAssign = async () => {
    setActionError('');
    try {
      const updated = await api.assignTicket(ticketId, newAssignee.trim() || null);
      setTicket(updated);
      alert('Ticket assigned successfully!');
      
      const historyData = await api.getHistory(ticketId);
      setHistory(historyData);
    } catch (err) {
      setActionError(err.message || 'Failed to assign ticket.');
    }
  };

  if (loading) return <div style={{ padding: '24px', color: 'var(--text-secondary)' }}>Loading ticket details...</div>;
  if (error) return <div style={{ padding: '24px', color: 'var(--danger)' }}>Error: {error}</div>;
  if (!ticket) return <div style={{ padding: '24px', color: 'var(--text-muted)' }}>Ticket not found.</div>;

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={() => navigate('../tickets')} className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to List
        </button>
        <Link to={`../update/${ticket.id}`} className="btn btn-secondary" style={{ borderColor: 'var(--border-glow)' }}>
          Edit Ticket Properties
        </Link>
      </div>

      {actionError && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 16px',
          color: 'var(--danger)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertTriangle size={18} />
          <span>{actionError}</span>
        </div>
      )}

      {/* Ticket Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
        
        {/* Main Ticket Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>TICKET #{ticket.id}</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className={`badge badge-${ticket.status.toLowerCase()}`}>{ticket.status}</span>
                <span className={`badge badge-${ticket.priority.toLowerCase()}`} style={{ background: 'var(--badge-priority-bg)' }}>{ticket.priority}</span>
              </div>
            </div>
            
            <h1 style={{ fontSize: '28px', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>{ticket.title}</h1>
            
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '20px',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              borderBottom: '1px solid var(--border-light)',
              paddingBottom: '20px',
              marginBottom: '20px'
            }}>
              <div>Category: <strong style={{ color: 'var(--text-primary)' }}>{ticket.category}</strong></div>
              <div>Created By: <strong style={{ color: 'var(--text-primary)' }}>{ticket.createdBy}</strong></div>
              <div>Date: <strong style={{ color: 'var(--text-primary)' }}>{new Date(ticket.createdAt).toLocaleString()}</strong></div>
              {ticket.updatedAt && (
                <div>Updated: <strong style={{ color: 'var(--text-primary)' }}>{new Date(ticket.updatedAt).toLocaleString()}</strong></div>
              )}
            </div>

            <h3 style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Description</h3>
            <p style={{
              fontSize: '15px',
              lineHeight: 1.6,
              color: 'var(--text-primary)',
              whiteSpace: 'pre-line',
              background: 'var(--description-bg)',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid var(--border-light)'
            }}>{ticket.description}</p>
          </div>

          {/* Comments Section */}
          <div className="glass-card">
            <h2 style={{ fontSize: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MessageSquare size={20} style={{ color: 'var(--primary)' }} /> Comments ({comments.length})
            </h2>

            <form onSubmit={handleAddComment} style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Type a comment..."
                  className="form-control"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={commentSubmitting}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0 24px' }} disabled={commentSubmitting || !newComment.trim()}>
                  <Send size={16} />
                </button>
              </div>
            </form>

            {comments.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>No comments on this ticket yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {comments.map(c => (
                  <div key={c.id} style={{ display: 'flex', gap: '16px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      color: 'var(--primary)',
                      fontSize: '14px',
                      flexShrink: 0
                    }}>
                      {c.createdBy.substring(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600, fontSize: '14px' }}>{c.createdBy}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(c.createdAt).toLocaleString()}</span>
                      </div>
                      <p style={{ color: 'var(--text-primary)', fontSize: '14px', lineHeight: 1.5 }}>{c.commentText}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div className="glass-card">
            <h2 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={18} style={{ color: 'var(--primary)' }} /> Update Status
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => handleUpdateStatus('Open')}
                className={`btn ${ticket.status === 'Open' ? 'btn-primary' : 'btn-secondary'}`}
                disabled={ticket.status === 'Open'}
                style={{ justifyContent: 'flex-start' }}
              >
                Open
              </button>
              <button
                onClick={() => handleUpdateStatus('InProgress')}
                className={`btn ${ticket.status === 'InProgress' ? 'btn-primary' : 'btn-secondary'}`}
                disabled={ticket.status === 'InProgress' || (ticket.status !== 'Open' && ticket.status !== 'Resolved')}
                style={{ justifyContent: 'flex-start' }}
              >
                In Progress
              </button>
              <button
                onClick={() => handleUpdateStatus('Resolved')}
                className={`btn ${ticket.status === 'Resolved' ? 'btn-primary' : 'btn-secondary'}`}
                disabled={ticket.status === 'Resolved' || ticket.status !== 'InProgress'}
                style={{ justifyContent: 'flex-start' }}
              >
                Resolved
              </button>
              <button
                onClick={() => handleUpdateStatus('Closed')}
                className={`btn ${ticket.status === 'Closed' ? 'btn-primary' : 'btn-secondary'}`}
                disabled={ticket.status === 'Closed' || ticket.status === 'Open'}
                style={{ justifyContent: 'flex-start' }}
              >
                Closed
              </button>
            </div>
          </div>

          <div className="glass-card">
            <h2 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={18} style={{ color: 'var(--primary)' }} /> Assignment
            </h2>

            <div className="form-group">
              <label className="form-label">Assignee Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. agent_smith"
                value={newAssignee}
                onChange={(e) => setNewAssignee(e.target.value)}
              />
            </div>
            <button onClick={handleAssign} className="btn btn-primary" style={{ width: '100%' }}>
              Apply Assignment
            </button>
          </div>

          <div className="glass-card">
            <h2 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History size={18} style={{ color: 'var(--primary)' }} /> Audit Log
            </h2>
            
            {history.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No audit history recorded.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
                {history.map(h => (
                  <div key={h.id} style={{
                    fontSize: '12px',
                    borderBottom: '1px solid var(--border-light)',
                    paddingBottom: '10px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      <strong>{h.changedBy}</strong>
                      <span>{new Date(h.changedAt).toLocaleTimeString()}</span>
                    </div>
                    <div style={{ color: 'var(--text-primary)' }}>
                      Field: <strong style={{ color: 'var(--primary)' }}>{h.fieldName}</strong>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {h.oldValue ? `"${h.oldValue}" → "${h.newValue}"` : `Set to "${h.newValue}"`}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
