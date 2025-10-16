import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserSlash,
  faUserMinus,
  faUserCheck,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../context/ThemeProvider";

const AdminUsers = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const [pendingRes, approvedRes] = await Promise.all([
        api.get("/users/pending-alumni"),
        api.get("/users/registered-users"),
      ]);
      setPendingUsers(pendingRes.data);
      setApprovedUsers(approvedRes.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users. Backend is probably on a nap break.");
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
        toast.error("User  not found. It may have already been deleted.");
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
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action can be undone."
      )
    )
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
    if (!window.confirm("Are you sure you want to block this user?")) return;

    setActionLoadingId(userId);
    try {
      await api.patch(`/users/${userId}/block`);
      setApprovedUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_active: false } : u))
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
    if (!window.confirm("Are you sure you want to unblock this user?")) return;

    setActionLoadingId(userId);
    try {
      await api.patch(`/users/${userId}/unblock`);
      setApprovedUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_active: true } : u))
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
    <table
      className={`min-w-full border rounded-lg shadow transition-colors duration-300 ${
        isDark
          ? "bg-gray-800 border-gray-700 text-gray-200"
          : "bg-white border-gray-200 text-gray-900"
      }`}
    >
      <thead
        className={`${
          isDark ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-700"
        }`}
      >
        <tr>
          {[
            "Username",
            "Email",
            "Lastname",
            "Firstname",
            "M.I.",
            "Course",
            "Batch",
            "Contact No.",
            "Sex",
            "Present Address",
            "Permanent Address",
            "Actions",
          ].map((header) => (
            <th key={header} className="p-3">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="text-sm">
        {users.length ? (
          users.map((user) => (
            <tr
              key={user.id}
              className={`border-t ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <td className="p-3">{user.username}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.lastname}</td>
              <td className="p-3">{user.firstname}</td>
              <td className="p-3">{user.middle_initial || "-"}</td>
              <td className="p-3">{user.course || "-"}</td>
              <td className="p-3">{user.batch_year || "-"}</td>
              <td className="p-3">{user.contact_number || "-"}</td>
              <td className="p-3">{user.sex}</td>
              <td className="p-3">{user.present_address || "-"}</td>
              <td className="p-3">{user.permanent_address || "-"}</td>
              <td className="flex items-center gap-2 p-3">
                {showActions ? (
                  <>
                    <button
                      disabled={actionLoadingId === user.id}
                      onClick={() => handleAction(user.id, "approve")}
                      className={`px-3 py-1 rounded text-white ${
                        actionLoadingId === user.id
                          ? "bg-green-300"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {actionLoadingId === user.id ? "..." : "Approve"}
                    </button>
                    <button
                      disabled={actionLoadingId === user.id}
                      onClick={() => handleAction(user.id, "decline")}
                      className={`px-3 py-1 rounded text-white ${
                        actionLoadingId === user.id
                          ? "bg-red-300"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {actionLoadingId === user.id ? "..." : "Decline"}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      title="Delete"
                      onClick={() => handleSoftDelete(user.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FontAwesomeIcon icon={faUserMinus} />
                    </button>
                    {user.is_active ? (
                      <button
                        title="Block"
                        onClick={() => handleBlock(user.id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FontAwesomeIcon icon={faUserSlash} />
                      </button>
                    ) : (
                      <button
                        title="Unblock"
                        onClick={() => handleUnblock(user.id)}
                        className="text-green-500 hover:text-green-700"
                      >
                        <FontAwesomeIcon icon={faUserCheck} />
                      </button>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="12" className="p-4 text-center text-gray-500">
              No users found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div
      className={`flex flex-col min-h-screen p-6 transition-colors duration-300 ${
        isDark ? "bg-[hsl(var(--background))] text-[hsl(var(--foreground))]" : "bg-gray-50 text-gray-900"
      }`}
    >
      <h2 className="mb-4 text-2xl font-bold">Users</h2>
      <div className="flex items-center justify-end mb-4 space-x-2">
        <input
          type="text"
          placeholder="Search User"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`border rounded px-3 py-1 ${
            isDark
              ? "bg-gray-800 border-gray-700 text-gray-100"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        />
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className={isDark ? "text-gray-300" : "text-gray-600"}
        />
      </div>
      <div className="mb-6 border-t"></div>
      <h3 className="mb-4 text-xl font-bold">Pending Alumni Approvals</h3>
      {renderTable(pendingUsers, true)}
      <h3 className="mt-6 mb-4 text-xl font-bold">Registered Users</h3>
      {renderTable(approvedUsers.filter((u) => ["alumni"].includes(u.role)))}
    </div>
  );
};

export default AdminUsers;
