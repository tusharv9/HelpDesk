import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Shell } from './components/Shell.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { TicketList } from './pages/TicketList.jsx';
import { CreateTicket } from './pages/CreateTicket.jsx';
import { TicketDetails } from './pages/TicketDetails.jsx';
import { UpdateTicket } from './pages/UpdateTicket.jsx';

export const App = () => {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }, []);

  return (
    <Shell>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="tickets" element={<TicketList />} />
        <Route path="create" element={<CreateTicket />} />
        <Route path="ticket/:id" element={<TicketDetails />} />
        <Route path="update/:id" element={<UpdateTicket />} />
      </Routes>
    </Shell>
  );
};

export default App;
