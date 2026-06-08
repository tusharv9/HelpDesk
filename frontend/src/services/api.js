const BASE_URL = 'http://localhost:5007/api';

export const getCurrentUser = () => {
  const user = localStorage.getItem('helpdesk_user');
  return user ? JSON.parse(user) : { username: 'john_doe', role: 'Operator' };
};

export const setCurrentUser = (username, role) => {
  localStorage.setItem('helpdesk_user', JSON.stringify({ username, role }));
  // Force token refresh on user change
  localStorage.removeItem('helpdesk_token');
};

export const getAuthToken = async () => {
  const cached = localStorage.getItem('helpdesk_token');
  const user = getCurrentUser();
  
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed.username === user.username && parsed.role === user.role) {
        return parsed.token;
      }
    } catch {
      localStorage.removeItem('helpdesk_token');
    }
  }

  try {
    const res = await fetch(`${BASE_URL}/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user.username, role: user.role }),
    });
    if (!res.ok) throw new Error('Auth failed');
    const data = await res.json();
    localStorage.setItem('helpdesk_token', JSON.stringify({
      username: user.username,
      role: user.role,
      token: data.token,
    }));
    return data.token;
  } catch (err) {
    console.error('Failed to retrieve authentication token', err);
    return null;
  }
};

const getHeaders = async () => {
  const token = await getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  getTickets: async (filters) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.assignedTo) params.append('assignedTo', filters.assignedTo);
    
    const headers = await getHeaders();
    const res = await fetch(`${BASE_URL}/ticket?${params.toString()}`, { headers });
    if (!res.ok) throw new Error(await res.text() || 'Failed to fetch tickets');
    return res.json();
  },

  getTicket: async (id) => {
    const headers = await getHeaders();
    const res = await fetch(`${BASE_URL}/ticket/${id}`, { headers });
    if (!res.ok) throw new Error(await res.text() || 'Failed to fetch ticket');
    return res.json();
  },

  createTicket: async (ticket) => {
    const headers = await getHeaders();
    const res = await fetch(`${BASE_URL}/ticket`, {
      method: 'POST',
      headers,
      body: JSON.stringify(ticket),
    });
    if (!res.ok) throw new Error(await res.text() || 'Failed to create ticket');
    return res.json();
  },

  updateTicket: async (id, ticket) => {
    const headers = await getHeaders();
    const res = await fetch(`${BASE_URL}/ticket/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(ticket),
    });
    if (!res.ok) throw new Error(await res.text() || 'Failed to update ticket');
    return res.json();
  },

  deleteTicket: async (id) => {
    const headers = await getHeaders();
    const res = await fetch(`${BASE_URL}/ticket/${id}`, {
      method: 'DELETE',
      headers,
    });
    if (!res.ok) throw new Error(await res.text() || 'Failed to delete ticket');
  },

  updateStatus: async (id, status) => {
    const headers = await getHeaders();
    const res = await fetch(`${BASE_URL}/ticket/${id}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error(await res.text() || 'Failed to update status');
    return res.json();
  },

  assignTicket: async (id, assignedTo) => {
    const headers = await getHeaders();
    const res = await fetch(`${BASE_URL}/ticket/${id}/assign`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ assignedTo }),
    });
    if (!res.ok) throw new Error(await res.text() || 'Failed to assign ticket');
    return res.json();
  },

  addComment: async (ticketId, commentText) => {
    const headers = await getHeaders();
    const res = await fetch(`${BASE_URL}/ticket/${ticketId}/comments`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ commentText }),
    });
    if (!res.ok) throw new Error(await res.text() || 'Failed to add comment');
    return res.json();
  },

  getComments: async (ticketId) => {
    const headers = await getHeaders();
    const res = await fetch(`${BASE_URL}/ticket/${ticketId}/comments`, { headers });
    if (!res.ok) throw new Error(await res.text() || 'Failed to fetch comments');
    return res.json();
  },

  getHistory: async (ticketId) => {
    const headers = await getHeaders();
    const res = await fetch(`${BASE_URL}/ticket/${ticketId}/history`, { headers });
    if (!res.ok) throw new Error(await res.text() || 'Failed to fetch history');
    return res.json();
  },
};
