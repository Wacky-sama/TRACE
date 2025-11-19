import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserSlash,
  faUserMinus,
  faUserCheck,
  faRefresh,
  faMagnifyingGlass,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../hooks/useTheme";
import HighlightText from "../../components/HighlightText"

const AdminUsers = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [archivedUsers, setArchivedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const [pendingRes, approvedRes, archivedRes] = await Promise.all([
        api.get("/users/pending-alumni"),
        api.get("/users/registered-users"),
        api.get("/users/archived-users")
      ]);
      setPendingUsers(pendingRes.data);
      setApprovedUsers(approvedRes.data.users);
      setArchivedUsers(archivedRes.data.users);
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
        toast.error("User not found. It may have already been deleted.");
        await fetchUsers();
      } else if (error.response?.status === 400) {
        console.error(error.response.data.detail || "Bad request.");
      } else {
        toast.error(`Could not ${action} the user. Try again.`);
      }
      console.error(`Failed to ${action} user:`, error);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleArchive = async (userId) => {
    if (!window.confirm("Are you sure you want to archive this user? This action can be undone."))
      return;

    setActionLoadingId(userId);
    try {
      await api.delete(`/users/${userId}/archive`);
      await fetchUsers();
      toast.success("User archived successfully!");
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("User not found. It may have already been archived.");
        await fetchUsers();
      } else {
        toast.error("Could not archive the user. Try again.");
      }
      console.error("Failed to archive user:", error);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleUnarchive = async (userId) => {
    if (!window.confirm("Are you sure you want to unarchive this user?"))
      return;

    setActionLoadingId(userId);
    try {
      await api.patch(`/users/${userId}/unarchive`);
      await fetchUsers();
      toast.success("User unarchived successfully!");
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("User not found. It may have already been deleted.");
        await fetchUsers();
      } else {
        toast.error("Could not unarchive the user. Try again.");
      }
      console.error("Failed to unarchive user:", error);
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

  // Card view for mobile
  const renderCards = (users, showActions = false) => (
    <div className="grid grid-cols-1 gap-4 md:hidden">
      {users.length ? (
        users.map((user) => (
          <div
            key={user.id}
            className={`border rounded-lg p-4 shadow ${
              isDark
                ? "bg-gray-800 border-gray-700 text-gray-200"
                : "bg-white border-gray-200 text-gray-900"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-lg font-bold">
                  <HighlightText 
                    text={`${user.firstname} ${user.middle_initial}. ${user.lastname}`}
                    highlight={searchTerm}
                  />
                </h4>
                <p className="text-sm opacity-75">
                  @<HighlightText text={user.username} highlight={searchTerm} />
                </p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="font-semibold w-28">Email:</span>
                <span className="flex-1 break-all">
                  <HighlightText text={user.email} highlight={searchTerm} />
                </span>
              </div>
              <div className="flex">
                <span className="font-semibold w-28">Course:</span>
                <span>
                  <HighlightText text={user.course || "-"} highlight={searchTerm} />
                </span>
              </div>
              <div className="flex">
                <span className="font-semibold w-28">Batch:</span>
                <span>
                  <HighlightText text={user.batch_year || "-"} highlight={searchTerm} />
                </span>
              </div>
              <div className="flex">
                <span className="font-semibold w-28">Contact:</span>
                <span>
                  <HighlightText text={user.contact_number || "-"} highlight={searchTerm} />
                </span>
              </div>
              <div className="flex">
                <span className="font-semibold w-28">Sex:</span>
                <span>
                  <HighlightText text={user.sex} highlight={searchTerm} />
                </span>
              </div>
              <div className="flex">
                <span className="font-semibold w-28">Present:</span>
                <span className="flex-1">
                  <HighlightText text={user.present_address || "-"} highlight={searchTerm} />
                </span>
              </div>
              <div className="flex">
                <span className="font-semibold w-28">Permanent:</span>
                <span className="flex-1">
                  <HighlightText text={user.permanent_address || "-"} highlight={searchTerm} />
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              {showActions ? (
                <>
                  <button
                    disabled={actionLoadingId === user.id}
                    onClick={() => handleAction(user.id, "approve")}
                    className={`flex-1 px-3 py-2 rounded text-white font-medium ${
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
                    className={`flex-1 px-3 py-2 rounded text-white font-medium ${
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
                  {!user.deleted_at && (
                    <button
                      title="Archive User"
                      onClick={() => handleArchive(user.id)}
                      className="flex items-center justify-center flex-1 px-3 py-2 text-red-500 border border-red-500 rounded hover:bg-red-50"
                    >
                      <FontAwesomeIcon icon={faUserMinus} className="mr-2" />
                      Archive
                    </button>
                  )}
                  {user.deleted_at && (
                    <button
                      title="Unarchive User"
                      onClick={() => handleUnarchive(user.id)}
                      className="flex items-center justify-center flex-1 px-3 py-2 text-yellow-500 border border-yellow-500 rounded hover:bg-yellow-50"
                    >
                      <FontAwesomeIcon icon={faRefresh} className="mr-2" />
                      Unarchive
                    </button>
                  )}
                  {!user.deleted_at && user.is_active && (
                    <button
                      title="Block User"
                      onClick={() => handleBlock(user.id)}
                      className="flex items-center justify-center flex-1 px-3 py-2 text-blue-500 border border-blue-500 rounded hover:bg-blue-50"
                    >
                      <FontAwesomeIcon icon={faUserSlash} className="mr-2" />
                      Block
                    </button>
                  )}
                  {!user.deleted_at && !user.is_active && (
                    <button
                      title="Unblock User"
                      onClick={() => handleUnblock(user.id)}
                      className="flex items-center justify-center flex-1 px-3 py-2 text-green-500 border border-green-500 rounded hover:bg-green-50"
                    >
                      <FontAwesomeIcon icon={faUserCheck} className="mr-2" />
                      Unblock
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))
      ) : (
        <div
          className={`p-8 text-center border rounded-lg ${
            isDark
              ? "bg-gray-800 border-gray-700 text-gray-400"
              : "bg-white border-gray-200 text-gray-500"
          }`}
        >
          No users found.
        </div>
      )}
    </div>
  );

  // Table view for desktop
  const renderTable = (users, showActions = false, isArchivedTable = false) => (
    <div className="hidden overflow-x-auto md:block">
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
              <th key={header} className="p-3 text-left align-middle">
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
                <td className="p-3">
                  <HighlightText text={user.username} highlight={searchTerm} />
                </td>
                <td className="p-3">
                  <HighlightText text={user.email} highlight={searchTerm} />
                </td>
                <td className="p-3">
                  <HighlightText text={user.lastname} highlight={searchTerm} />
                </td>
                <td className="p-3">
                  <HighlightText text={user.firstname} highlight={searchTerm} />
                </td>
                <td className="p-3">
                  <HighlightText text={`${user.middle_initial || "-"}.`} highlight={searchTerm} />
                </td>
                <td className="p-3">
                  <HighlightText text={user.course || "-"} highlight={searchTerm} />
                </td>
                <td className="p-3">
                  <HighlightText text={user.batch_year || "-"} highlight={searchTerm} />
                </td>
                <td className="p-3">
                  <HighlightText text={user.contact_number || "-"} highlight={searchTerm} />
                </td>
                <td className="p-3">
                  <HighlightText text={user.sex} highlight={searchTerm} />
                </td>
                <td className="p-3">
                  <HighlightText text={user.present_address || "-"} highlight={searchTerm} />
                </td>
                <td className="p-3">
                  <HighlightText text={user.permanent_address || "-"} highlight={searchTerm} />
                </td>
                <td className={`flex items-center gap-2 p-3 ${isArchivedTable ? 'justify-center' : ''}`}>
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
                      {!user.deleted_at && (
                        <button
                          title="Archive User"
                          onClick={() => handleArchive(user.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FontAwesomeIcon icon={faUserMinus} />
                        </button>
                      )}
                      {user.deleted_at && (
                        <button
                          title="Unarchive User"
                          onClick={() => handleUnarchive(user.id)}
                          className="text-yellow-500 hover:text-yellow-700"
                        >
                          <FontAwesomeIcon icon={faRefresh} />
                        </button>
                      )}
                      {!user.deleted_at && user.is_active && (
                        <button
                          title="Block User"
                          onClick={() => handleBlock(user.id)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FontAwesomeIcon icon={faUserSlash} />
                        </button>
                      )}
                      {!user.deleted_at && !user.is_active && (
                        <button
                          title="Unblock User"
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
              <td
                colSpan="12"
                className={`p-4 text-center ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const filterUsers = (users) =>
    users
      .filter((u) => ["alumni"].includes(u.role))
      .filter((u) =>
        `${u.firstname} ${u.lastname} ${u.username} ${u.email} ${u.course || ""} ${u.batch_year || ""}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div
      className={`${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      } min-h-screen p-4 md:p-6`}
    >
      <h2 className="mb-4 text-2xl font-bold md:text-3xl">Users</h2>
      <p className="mb-4 text-sm md:text-base">
        On this page, you can approve or decline, search, archive and unarchive, block and unblock users.
      </p>
      
      <div className="relative flex items-center mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by name, username, email, course, or batch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`border rounded px-3 py-2 pr-20 w-full transition-colors ${
              isDark
                ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-3">
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className={`p-1 rounded hover:bg-opacity-10 transition-colors ${
                  isDark
                    ? "text-gray-400 hover:bg-white hover:text-gray-300"
                    : "text-gray-500 hover:bg-black hover:text-gray-600"
                }`}
                title="Clear search"
              >
                <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
              </button>
            )}
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className={isDark ? "text-gray-400" : "text-gray-500"}
            />
          </div>
        </div>
      </div>

      {searchTerm && (
        <p className={`mb-4 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Showing results for: <span className="font-semibold">"{searchTerm}"</span>
        </p>
      )}

      <div className="mb-6 border-t"></div>

      <h3 className="mb-4 text-xl font-bold">Pending Alumni Approvals</h3>
      {renderTable(filterUsers(pendingUsers), true)}
      {renderCards(filterUsers(pendingUsers), true)}

      <h3 className="mt-6 mb-4 text-xl font-bold">Registered Users</h3>
      {renderTable(filterUsers(approvedUsers))}
      {renderCards(filterUsers(approvedUsers))}

      <h3 className="mt-6 mb-4 text-xl font-bold">Archived Users</h3>
      {renderTable(filterUsers(archivedUsers), false, true)}
      {renderCards(filterUsers(archivedUsers), false, true)}
    </div>
  );
};

export default AdminUsers;