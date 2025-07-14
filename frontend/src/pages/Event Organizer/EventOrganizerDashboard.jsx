import { useEffect, useState } from 'react';
import EventOrganizerSidebar from "../../components/common/EventOrganizerSidebar";
import CreateEventForm from './CreateEventForm';
import api from '../../services/api';

const EventOrganizerDashboard = () => {
  const [activePanel, setActivePanel] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);

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

  const renderPanel = () => {
    switch (activePanel) {
      case 'dashboard':
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Event Organizer Dashboard</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white p-4 shadow rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Quick Actions</h3>
                <button  onClick={() => setActivePanel('create-event')} className="w-full text-left text-white px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors">
                  Create Event
                </button>
              </div>
            </div>
          </>
        );
      case 'create-event':
        return <CreateEventForm />
      default:
        return <div className="p-4">Select a panel to view details.</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <EventOrganizerSidebar onPanelChange={setActivePanel} user={currentUser}/>
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {renderPanel()}
        </div>
      </main>
    </div>
  );
};

export default EventOrganizerDashboard;
