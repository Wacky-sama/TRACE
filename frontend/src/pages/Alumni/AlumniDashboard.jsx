import { useEffect, useState } from 'react';
import api from '../../services/api';

const AlumniDashboard = () => {
  const [events, setEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [activePanel, setActivePanel] = useState('dashboard');

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await api.get('/users/me');
        setCurrentUser(res.data);
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchApprovedEvents = async () => {
      try {
        const res = await api.get('/events');
        setEvents(res.data);
      } catch (error) {
        console.error('Failed to fetch approved events:', error);
      }
    };

    fetchApprovedEvents();
  }, []);

  const renderPanel = () => {
    switch (activePanel) {
      case 'dashboard':
        return (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome, {currentUser?.firstname}!</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            </div>
          </>
        );
      default:
        return <div className="p-6">Under development.</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {renderPanel()}
        </div>
      </main>
    </div>
  );
};

export default AlumniDashboard;
