import { useEffect, useState } from 'react';
import AdminCreateUser from './AdminCreateUser';
import AdminSidebar from '../components/common/AdminSidebar';
import { BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,CartesianGrid } from 'recharts';
import Users from './Users';
import axios from 'axios';

const AdminDashboard = () => {
  const [userStats, setUserStats] = useState(null);
  const [activePanel, setActivePanel] = useState('dashboard');

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await axios.get('http://192.168.10.2:8000/users/stats');
        setUserStats(response.data);
      } catch (error) {
        console.error('Error fetching total users:', error);
      }
    };
    fetchUserStats();
    const interval = setInterval(fetchUserStats, 10000);

    return () => clearInterval(interval);
  }, []);

  const chartData = userStats
    ? [
        { role: 'Admins', count: userStats.admins },
        { role: 'Organizers', count: userStats.organizers },
        { role: 'Alumni', count: userStats.alumni },
      ]
    : [];

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
            {/* Maybe display session count here */}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-lg font-semibold mb-4">Users by Role</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" />
                <YAxis allowDecimals={false} />
                 <Tooltip />
                 <Bar dataKey="count" fill="#2563EB" /> 
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
            <button className="w-full text-left p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
              Generate Report
            </button>
            <button className="w-full text-left p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
              Send Notification
            </button>
          </div>
        </div>
      </div>
    </>
  );
      case 'users':
        return <Users />;
      case 'create-user':
        return <AdminCreateUser />;
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