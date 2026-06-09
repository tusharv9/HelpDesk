import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { ArrowLeft, Save } from 'lucide-react';

export const UpdateTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const ticketId = Number(id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Hardware');
  const [priority, setPriority] = useState('Low');
  const [status, setStatus] = useState('Open');
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getTicket(ticketId)
      .then(t => {
        setTitle(t.title);
        setDescription(t.description);
        setCategory(t.category);
        setPriority(t.priority);
        setStatus(t.status);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load ticket properties.');
        setLoading(false);
      });
  }, [ticketId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !category) {
      setError('All fields are required.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.updateTicket(ticketId, { title, description, category, priority, status });
      navigate(`../ticket/${ticketId}`);
    } catch (err) {
      setError(err.message || 'Failed to update ticket.');
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '24px', color: 'var(--text-secondary)' }}>Loading ticket properties...</div>;
  if (error) return <div style={{ padding: '24px', color: 'var(--danger)' }}>Error: {error}</div>;

  return (
    <div className="fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <button onClick={() => navigate(`../ticket/${ticketId}`)} className="btn btn-secondary" style={{ marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back to Ticket
      </button>

      <div className="glass-card">
        <h1 style={{ fontSize: '24px', marginBottom: '24px', fontFamily: 'var(--font-display)' }}>Edit Ticket Properties</h1>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            color: 'var(--danger)',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Ticket Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Network">Network</option>
              <option value="Access/Identity">Access & Identity</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Priority Level</label>
            <select
              className="form-control"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-control"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Open">Open</option>
              <option value="InProgress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Problem Description</label>
            <textarea
              className="form-control"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{ resize: 'vertical' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={submitting}>
            <Save size={18} /> {submitting ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};
