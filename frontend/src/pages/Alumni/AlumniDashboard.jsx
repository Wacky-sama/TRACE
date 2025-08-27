import { useEffect, useState } from 'react';
import AlumniEvents from './AlumniEvents';
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
      } catch (err) {
        console.error('Failed to fetch current user:', err);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchApprovedEvents = async () => {
      try {
        const res = await api.get('/events');
        setEvents(res.data);
      } catch (err) {
        console.error('Failed to fetch approved events:', err);
      }
    };

    fetchApprovedEvents();
  }, []);

  const renderPanel = () => {
    switch (activePanel) {
      case 'dashboard':
        return (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome, {currentUser?.firstname || 'Alumni'}!</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
                <h3 className="text-lg font-semibold text-gray-800">Upcoming Events</h3>
                <p className="text-sm text-gray-600 mt-2">{events.length} events available</p>
                <button onClick={() => setActivePanel('events')} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                  View Events
                </button>
              </div>
            </div>
          </>
        );
      case 'events':
        return <AlumniEvents />
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
