import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { ArrowLeft, Save } from 'lucide-react';

export const CreateTicket = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Hardware');
  const [priority, setPriority] = useState('Low');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !category) {
      setError('All fields are required.');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      await api.createTicket({ title, description, category, priority });
      navigate('../tickets');
    } catch (err) {
      setError(err.message || 'Failed to create ticket. Verify authorization.');
      setSubmitting(false);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <button onClick={() => navigate('../tickets')} className="btn btn-secondary" style={{ marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back to Tickets
      </button>

      <div className="glass-card">
        <h1 style={{ fontSize: '24px', marginBottom: '24px', fontFamily: 'var(--font-display)' }}>Create Support Request</h1>
        
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
              placeholder="e.g. Printer offline on 2nd floor"
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
              <option value="Low">Low (General Query)</option>
              <option value="Medium">Medium (Affects daily operations)</option>
              <option value="High">High (Urgent blocker)</option>
              <option value="Critical">Critical (System Outage)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Problem Description</label>
            <textarea
              className="form-control"
              rows={5}
              placeholder="Please describe your issue in detail. Include any error messages or troubleshooting steps you've tried."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{ resize: 'vertical' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={submitting}>
            <Save size={18} /> {submitting ? 'Submitting...' : 'File Ticket'}
          </button>
        </form>
      </div>
    </div>
  );
};
