import { useEffect, useState } from 'react';
import api from '../../services/api';

// Hook to detect dark mode dynamically
function useDarkMode() {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

const AlumniDashboard = () => {
  const isDark = useDarkMode();
  const [events, setEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

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

  return (
    <div className={`flex min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Dashboard</h1>
          <h2 className={`text-xl mb-8 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            Welcome, {currentUser?.firstname}!
          </h2>

          {/* Upcoming/Approved Events */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.length === 0 ? (
              <div className={`p-6 rounded-lg shadow transition-colors ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
                <p className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>No upcoming events.</p>
              </div>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className={`p-6 rounded-lg shadow transition-colors ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
                >
                  <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}>{event.title}</h3>
                  <p className={`text-sm mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {event.description || "No description"}
                  </p>
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    Date: {event.date || "TBA"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AlumniDashboard;
