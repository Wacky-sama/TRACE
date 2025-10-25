import { userLogout } from "../../utils/storage";
import { useNavigate, NavLink } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouseUser,
  faCalendar,
  faBell,
  faRightFromBracket,
  faGear,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../context/UserContext";
import { formatFullname } from "../../utils/format";

const AlumniSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useUser();

  const navigationItems = [
    { icon: faHouseUser, label: "Dashboard", route: "/alumni/dashboard" },
    { icon: faCalendar, label: "Events", route: "/alumni/events" },
    { icon: faBell, label: "Notifications", route: "/alumni/notifications" },
    { icon: faGear, label: "Account Settings", route: "/alumni/settings" },
  ];

  const handleLogout = () => {
    userLogout();
    setCurrentUser(null);
    navigate("/login");
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

export default AlumniSidebar;
