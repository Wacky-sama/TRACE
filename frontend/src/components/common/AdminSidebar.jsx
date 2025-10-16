import { adminLogout } from "../../utils/storage";
import { useNavigate, NavLink } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouseUser,
  faUsers,
  faCalendar,
  faChartSimple,
  faFile,
  faBell,
  faRightFromBracket,
  faGear,
  faBars,
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../context/UserContext";
import { formatFullname } from "../../utils/format";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState([]);
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useUser();

  const navigationItems = [
    { icon: faHouseUser, label: "Dashboard", route: "/admin/dashboard" },
    {
      key: "users",
      icon: faUsers,
      label: "Users",
      dropdown: true,
      children: [
        { label: "View Users", route: "/admin/users" },
        { label: "Create User", route: "/admin/create-user" },
      ],
    },
    {
      key: "events",
      icon: faCalendar,
      label: "Events",
      dropdown: true,
      children: [
        { label: "View Events", route: "/admin/events" },
        { label: "Create Event", route: "/admin/create-event" },
      ],
    },
    { icon: faChartSimple, label: "Analytics", route: "/admin/analytics" },
    { icon: faFile, label: "Reports", route: "/admin/reports" },
    { icon: faBell, label: "Notifications", route: "/admin/notifications" },
    { icon: faGear, label: "Account Settings", route: "/admin/settings" },
  ];

  const handleLogout = () => {
    adminLogout();
    setCurrentUser(null);
    navigate("/admin-login");
  };

  const toggleDropdown = (key) => {
    setOpenDropdowns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <div
      className={`bg-gray-800 text-white transition-[width] duration-300 ${
        isOpen ? "w-60" : "w-16"
      } min-h-screen shrink-0`}
    >
      <div
        className={`flex items-center p-4 border-b border-gray-700 ${
          isOpen ? "justify-between" : "justify-center"
        }`}
      >
        {isOpen && currentUser && (
          <div className="w-full text-center">
            <div className="text-sm font-semibold text-white">
              <p className="font-semibold">{formatFullname(currentUser)}</p>
              <p className="text-sm text-gray-400 capitalize">
                {currentUser.role}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-300 hover:text-white"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      <nav className="mt-4">
        <ul className="px-3 space-y-2">
          {navigationItems.map((item) => (
            <li key={item.label}>
              {!item.dropdown ? (
                <NavLink
                  to={item.route}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group 
                     ${
                       isActive
                         ? "bg-gray-700 text-white"
                         : "text-gray-300 hover:bg-gray-700 hover:text-white"
                     }`
                  }
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="w-5 h-5 text-gray-400 group-hover:text-white"
                  />
                  {isOpen && <span className="font-medium">{item.label}</span>}
                </NavLink>
              ) : (
                <>
                  <button
                    onClick={() => toggleDropdown(item.key)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-colors group ${
                      openDropdowns.includes(item.key)
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon
                        icon={item.icon}
                        className="w-5 h-5 text-gray-400 group-hover:text-white"
                      />
                      {isOpen && (
                        <span className="font-medium">{item.label}</span>
                      )}
                    </div>
                    {isOpen && (
                      <FontAwesomeIcon
                        icon={
                          openDropdowns.includes(item.key)
                            ? faChevronDown
                            : faChevronRight
                        }
                        className="w-4 h-4 text-gray-400"
                      />
                    )}
                  </button>

                  {openDropdowns.includes(item.key) && isOpen && (
                    <ul className="mt-1 ml-10 space-y-1">
                      {item.children.map((subItem) => (
                        <li key={subItem.label}>
                          <NavLink
                            to={subItem.route}
                            className={({ isActive }) =>
                              `block px-2 py-1 text-sm rounded-md transition-colors ${
                                isActive
                                  ? "bg-gray-700 text-white"
                                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
                              }`
                            }
                          >
                            {subItem.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div className="mx-3 my-4 border-t border-gray-600"></div>

        {/* Logout */}
        <div className="px-3">
          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-3 px-3 py-2 text-gray-300 rounded-lg hover:bg-red-600 hover:text-white group"
          >
            <FontAwesomeIcon
              icon={faRightFromBracket}
              className="w-5 h-5 text-gray-400 group-hover:text-white"
            />
            {isOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;
