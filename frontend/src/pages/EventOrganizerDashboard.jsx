import { useEffect, useState } from 'react';
import EventOrganizerSidebar from "../components/common/EventOrganizerSidebar";
import axios from 'axios';

const EventOrganizerDashboard = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        const config = token ? {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        } : {};

        console.log('Fetching with token:', token ? 'Present' : 'Missing');
      } catch (error) {
        console.error('Error fetching data: ', error); 
      }
    };

    fetchData();
  }, []);

  return (
    <div>
       <EventOrganizerSidebar />
    </div>
  )
}

export default EventOrganizerDashboard;