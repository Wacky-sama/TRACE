import React from 'react'

const AdminEvents = () => {
    const [pendingEvents, setPendingEvents] = useState([]);
    const [approvedEvents, setApprovedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState(null);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Pending Events Approvals</h2>
      <div className="overflow-auto">
        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead className="bg-gray-100 text-left text-sm text-gray-700">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Location</th>
              <th className="p-3">Description</th>
              <th className="p-3">Created By</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {pendingEvents.length ? (
              pendingEvents.map((event) => (
                <tr key={event.id} className="border-t">
                  <td className="p-3">{event.title}</td>
                  <td className="p-3">{event.location}</td>
                  <td className="p-3">{event.description || '-'}</td>
                  <td className="p-3">{event.created_by_name || event.created_by}</td>
                  <td className="p-3 capitalize">{event.status}</td>
                  <td className="p-3 space-x-2">
                    <button
                      disabled={actionLoadingId === event.id}
                      onClick={() => handleEventAction(event.id, 'approve')}
                      className={`px-3 py-1 rounded text-white ${
                        actionLoadingId === event.id ? 'bg-green-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                      }`}
                    >
                      {actionLoadingId === event.id ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      disabled={actionLoadingId === event.id}
                      onClick={() => handleEventAction(event.id, 'decline')}
                      className={`px-3 py-1 rounded text-white ${
                        actionLoadingId === event.id ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                      }`}
                    >
                      {actionLoadingId === event.id ? 'Declining...' : 'Decline'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No pending events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Approved Events Section goes here... (you can clean that up similarly later) */}
    </div>
  );
};

export default AdminEvents;
