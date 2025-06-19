import { useEffect, useState } from 'react';
import AdminCreateUser from './AdminCreateUser';
import AdminSidebar from '../../components/common/AdminSidebar';
import { BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,CartesianGrid } from 'recharts';
import AdminUsers from './AdminUsers';
import AdminEvents from './AdminEvents';
import api from '../../services/api';

const AdminDashboard = () => {
  const [userStats, setUserStats] = useState(null);
  const [activeUsers, setActiveUsers] = useState(null);
  const [blockedUsers, setBlockedUsers] = useState(null);
  const [archivedUsers, setArchivedUsers] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);
  const [activePanel, setActivePanel] = useState('dashboard');

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const [statsRes, activeRes, blockedRes, archivedRes, onlineRes] = await Promise.all([
          api.get('/users/stats'),
          api.get('/users/active'),
          api.get('/users/blocked'),
          api.get('/users/archived'),
          api.get('/users/online'),
        ]);

        setUserStats(statsRes.data);
        setActiveUsers(activeRes.data.active_users);
        setBlockedUsers(blockedRes.data.blocked_users);
        setArchivedUsers(archivedRes.data.archived_users);
        setOnlineUsers(onlineRes.data);
        
        console.log('Online users:', onlineRes.data);
      } catch (error) {
        console.error('Error fetching user stats: ', error); 
      }
    };

    fetchUserStats();
    const interval = setInterval(fetchUserStats, 10000);

    return () => clearInterval(interval);
  }, []);

  const chartData = userStats
    ? [
        { role: 'Admins', count: userStats.admins },
        { role: 'Event Organizers', count: userStats.organizers },
        { role: 'Alumni', count: userStats.alumni },
      ]
    : [];

  const formatRole = (role) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'organizer': return 'Event Organizer';
      case 'alumni': return 'Alumni';
      default: return role;
    }
  };

   const renderPanel = () => {
    switch (activePanel) {
      case 'dashboard':
         return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {userStats !== null ? userStats.total_users : 'Loading...'}
          </p>
          <p className="text-xs text-green-600 mt-1">Live Data</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {activeUsers !== null ? activeUsers : 'Loading...'}
          </p>
          <p className='text-xs text-green-600 mt-1'>Live Data</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Blocked Users</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {blockedUsers !== null ? blockedUsers : 'Loading...'}
          </p>
          <p className='text-xs text-green-600 mt-1'>Live Data</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Archived Users</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {archivedUsers !== null ? archivedUsers : 'Loading...'}
          </p>
          <p className='text-xs text-green-600 mt-1'>Live Data</p>
        </div> 
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-lg font-semibold mb-4">Users by Role</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="role" />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value) => [value, 'Count']}/>
              <Bar dataKey="count" name="Count" fill="#2563EB" /> 
            </BarChart>
          </ResponsiveContainer>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">New user registered</span>
              <span className="text-xs text-gray-500">2 min ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button onClick={() => setActivePanel('create-user')} className="w-full text-left p-3 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors">
              Create New User
            </button>
            <button className="w-full text-left p-3 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors">
              Generate Report
            </button>
          </div>
        </div>
        <div className="lg:col-span-2 flex justify-center">
          <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center w-full max-w-sm">
            <h3 className="text-sm font-medium text-green-500">Online Users</h3>
            {onlineUsers ? (
              <ul className="mt-2">
                {onlineUsers.map(user => (
                  <li key={user.id} className="text-gray-800 text-sm">
                    {user.firstname} {user.middle_initial}. {user.lastname} - {formatRole(user.role)}
                  </li>
                ))}
              </ul>
              ) : (
              <p className="text-sm text-gray-500 mt-2">Loading...</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
      case 'users':
        return <AdminUsers />;
      case 'events':
        return <AdminEvents />;
      case 'create-user':
        return <AdminCreateUser token={localStorage.getItem("token")}/>;
      default:
        return <div className="p-6">Select a panel to view details.</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar onPanelChange={setActivePanel}/>
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {renderPanel()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;