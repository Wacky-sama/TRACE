import { useEffect } from 'react';
import EventOrganizerSidebar from "../../components/common/EventOrganizerSidebar";
import api from '../../services/api';

const EventOrganizerDashboard = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/events/organizer-overview'); // or your relevant endpoint
        console.log('Fetched data:', res.data);
      } catch (error) {
        console.error('Error fetching organizer dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <EventOrganizerSidebar />
    </div>
  );
};

export default EventOrganizerDashboard;
