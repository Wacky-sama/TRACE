import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserSlash, faUserMinus, faUserCheck, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

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
  
  const handleSoftDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action can be undone.")) 
      return;

    setActionLoadingId(userId);
    try {
      await api.delete(`/users/${userId}/delete`);
      await fetchUsers();
      toast.success("User deleted successfully!");
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("User not found. It may have already been deleted.");
        await fetchUsers();
      } else {
        toast.error("Could not delete the user. Try again.");
      }
      console.error("Failed to delete user:", error);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleBlock = async (userId) => {
  if (!window.confirm("Are you sure you want to block this user?")) 
    return;

  setActionLoadingId(userId);
  try {
    await api.patch(`/users/${userId}/block`);
    // Backend sets is_active = False when blocking
    setApprovedUsers(prev => 
      prev.map(u => u.id === userId ? {...u, is_active: false} : u)
    );
    toast.success("User blocked successfully!");
  } catch (error) {
    if (error.response?.status === 404) {
      toast.error("User not found. It may have already been deleted.");
      await fetchUsers();
    } else {
      toast.error("Could not block the user. Try again.");
    }
    console.error("Failed to block user:", error);
  } finally {
    setActionLoadingId(null);
  }
};

const handleUnblock = async (userId) => {
  if (!window.confirm("Are you sure you want to unblock this user?")) 
    return;

  setActionLoadingId(userId);
  try {
    await api.patch(`/users/${userId}/unblock`);
    // Backend sets is_active = True when unblocking
    setApprovedUsers(prev =>
      prev.map(u => u.id === userId ? { ...u, is_active: true } : u)
    );
    toast.success("User unblocked successfully!");
  } catch (error) {
    if (error.response?.status === 404) {
      toast.error("User not found. It may have already been deleted.");
      await fetchUsers();
    } else {
      toast.error("Could not unblock the user. Try again.");
    }
    console.error("Failed to unblock user:", error);
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
              <td className="p-12 flex gap-2 items-center">
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
                    <button 
                      title="Soft Delete" 
                      disabled={actionLoadingId === user.id}
                      onClick={() => handleSoftDelete(user.id)}
                      className={`text-red-500 hover:text-red-700 ${
                        actionLoadingId === user.id ? "cursor-not-allowed opacity-50" : ""
                      }`}>
                      {actionLoadingId === user.id ? "..." : <FontAwesomeIcon icon={faUserMinus} />}
                    </button>
                    
                    {!user.is_active ? (
                      <button 
                        title="Unblock" 
                        disabled={actionLoadingId === user.id}
                        onClick={() => handleUnblock(user.id)}
                        className={`text-green-500 hover:text-green-700 ${
                          actionLoadingId === user.id ? "cursor-not-allowed opacity-50" : ""
                        }`}>
                        {actionLoadingId === user.id ? "..." : <FontAwesomeIcon icon={faUserCheck} />}
                      </button>
                    ) : (
                      <button 
                        title="Block" 
                        disabled={actionLoadingId === user.id}
                        onClick={() => handleBlock(user.id)}
                        className={`text-blue-500 hover:text-blue-700 ${
                          actionLoadingId === user.id ? "cursor-not-allowed opacity-50" : ""
                        }`}>
                        {actionLoadingId === user.id ? "..." : <FontAwesomeIcon icon={faUserSlash} />}
                      </button>
                    )}
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
      <div className="overflow-x-auto max-w-full">
        {renderTable(
          pendingUsers.filter((u) =>
            `${u.firstname} ${u.lastname} ${u.username}`.toLowerCase().includes(searchTerm.toLowerCase())
          ),
          true
        )}
      </div>

      <h3 className="text-2xl font-bold mb-6">Registered Users</h3>
      <div className="overflow-x-auto max-w-full">
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
