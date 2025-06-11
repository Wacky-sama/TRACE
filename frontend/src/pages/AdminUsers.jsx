import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Users = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchPendingUsers = async () => {
    try {
      const response = await axios.get('http://192.168.10.2:8000/users/pending-alumni');
      setPendingUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users — backend might be on coffee break ☕️');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId, action) => {
    setActionLoadingId(userId);
    try {
      await axios.patch(`http://192.168.10.2:8000/users/${userId}/${action}`);
      setPendingUsers(prev => prev.filter(user => user.id !== userId));
      alert(`User ${action}d successfully! 🎉`);
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
      alert(`Oops! Could not ${action} the user. Try again.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Pending Alumni Approvals</h2>
      <div className="overflow-auto">
        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead className="bg-gray-100 text-left text-sm text-gray-700">
            <tr>
              <th className="p-3">Username</th>
              <th className="p-3">Email</th>
              <th className="p-3">Lastname</th>
              <th className="p-3">Firstname</th>
              <th className="p-3">M.I.</th>
              <th className="p-3">Course</th>
              <th className="p-3">Batch</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {pendingUsers.length ? (
              pendingUsers.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="p-3">{user.username}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.lastname}</td>
                  <td className="p-3">{user.firstname}</td>
                  <td className="p-3">{user.middle_initial || '-'}</td>
                  <td className="p-3">{user.course || '-'}</td>
                  <td className="p-3">{user.batch_year || '-'}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                  <td className="p-3">{user.is_approved ? 'Approved' : 'Pending'}</td>
                  <td className="p-3 space-x-2">
                    <button
                      disabled={actionLoadingId === user.id}
                      onClick={() => handleAction(user.id, 'approve')}
                      className={`px-3 py-1 rounded text-white ${
                        actionLoadingId === user.id ? 'bg-green-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                      }`}
                    >
                      {actionLoadingId === user.id ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      disabled={actionLoadingId === user.id}
                      onClick={() => handleAction(user.id, 'decline')}
                      className={`px-3 py-1 rounded text-white ${
                        actionLoadingId === user.id ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                      }`}
                    >
                      {actionLoadingId === user.id ? 'Declining...' : 'Decline'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="p-4 text-center text-gray-500">
                  No pending users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
