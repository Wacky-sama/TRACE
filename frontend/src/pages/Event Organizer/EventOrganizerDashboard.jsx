import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventOrganizerSidebar from "../../components/common/EventOrganizerSidebar";
import api from '../../services/api';

const EventOrganizerDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/events/organizer-overview');
        console.log('Fetched data:', res.data);
      } catch (error) {
        console.error('Error fetching organizer dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex">
      <EventOrganizerSidebar />
      <div className="p-6 w-full">
        <h2 className="text-2xl font-bold mb-4">Event Organizer Dashboard</h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Quick Actions</h3>
            <button
              onClick={() => navigate("/event-organizer/create-event")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventOrganizerDashboard;
