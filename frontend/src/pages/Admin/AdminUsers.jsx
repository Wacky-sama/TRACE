import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserSlash, faUserMinus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const AdminUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      const [pendingRes, approvedRes] = await Promise.all([
        api.get('/users/pending-alumni'),
        api.get('/users/registered-users'),
      ]);
      setPendingUsers(pendingRes.data);
      setApprovedUsers(approvedRes.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users. Backend is probably on a nap break.');
    }
  };

  useEffect(() => {
    fetchUsers().finally(() => setLoading(false));
  }, []);

  const handleAction = async (userId, action) => {
  setActionLoadingId(userId);
  try {
    await api.patch(`/users/${userId}/${action}`);
    await fetchUsers();
    toast.success(`User ${action}d successfully!`);
  } catch (error) {
    if (error.response?.status === 404) {
      toast.error("User not found. It may have already been deleted.");
      await fetchUsers();
    } else if (error.response?.status === 400) {
      toast.error(error.response.data.detail || "Bad request.");
    } else {
      toast.error(`Could not ${action} the user. Try again.`);
    }
    console.error(`Failed to ${action} user:`, error);
  } finally {
    setActionLoadingId(null);
  }
};
  
  const renderTable = (users, showActions = false) => (
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
          <th className="p-3">Contact No.</th>
          <th className="p-3">Sex</th>
          <th className="p-3">Present Address</th>
          <th className="p-3">Permanent Address</th>
          <th className="p-3">Role</th>
          {showActions ? <th className="p-3">Status</th> : <th className="p-3">Active</th>}
          <th className="p-3">Actions</th>
        </tr>
      </thead>
      <tbody className="text-sm">
        {users.length ? (
          users.map(user => (
            <tr key={user.id} className="border-t">
              <td className="p-3">{user.username}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.lastname}</td>
              <td className="p-3">{user.firstname}</td>
              <td className="p-3">{user.middle_initial || '-'}</td>
              <td className="p-3">{user.course || '-'}</td>
              <td className="p-3">{user.batch_year || '-'}</td>
              <td className="p-3">{user.contact_number || '-'}</td>
              <td className="p-3">{user.sex}</td>
              <td className="p-3">{user.present_address || '-'}</td>
              <td className="p-3">{user.permanent_address || '-'}</td>
              <td className="p-3 capitalize">{user.role}</td>
              <td className="p-3">
                {showActions ? (user.is_approved ? 'Approved' : 'Pending') : <span className="text-green-600">Online</span>}
              </td>
              <td className="p-3 flex gap-2 items-center">
                {showActions ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <button title="Delete" className="text-red-500 hover:text-red-700">
                      <FontAwesomeIcon icon={faUserMinus} />
                    </button>
                    <button title="Block" className="text-blue-500 hover:text-blue-700">
                      <FontAwesomeIcon icon={faUserSlash} />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="10" className="p-4 text-center text-gray-500">
              No users found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Users</h2>

      <div className="flex justify-end items-center mb-4 space-x-2">
        <input
          type="text"
          placeholder="Search User"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1"
        />
        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-600"/>
      </div>

      <div className="border-t border-gray-600 mb-6"></div>

      <h3 className="text-2xl font-bold mb-6">Pending Alumni Approvals</h3>
      <div className="overflow-auto mb-12">
        {renderTable(
          pendingUsers.filter((u) =>
            `${u.firstname} ${u.lastname} ${u.username}`.toLowerCase().includes(searchTerm.toLowerCase())
          ),
          true
        )}
      </div>

      <h3 className="text-2xl font-bold mb-6">Registered Users</h3>
      <div className="overflow-auto">
        {renderTable(
          approvedUsers
            .filter((u) => ['alumni'].includes(u.role))
            .filter((u) =>
              `${u.firstname} ${u.lastname} ${u.username}`.toLowerCase().includes(searchTerm.toLowerCase())
            )
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
