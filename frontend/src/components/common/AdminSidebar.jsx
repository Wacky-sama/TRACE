/* eslint-disable no-unused-vars */
import { userLogout } from "../../utils/storage";
import { useNavigate, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { ScanQrCode } from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";
import useTokenWatcher from "../../hooks/useTokenWatcher";
import { useUser } from "../../hooks/useUser";
import { formatFullname } from "../../utils/format";

const AdminSidebar = () => {
  useTokenWatcher();
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);
  const [openDropdowns, setOpenDropdowns] = useState([]);
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useUser();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    { icon: ScanQrCode, label: "QR Scanner", route: "/admin/qr-scanner" },
    { icon: faChartSimple, label: "Analytics", route: "/admin/analytics" },
    { icon: faFile, label: "Reports", route: "/admin/reports" },
    { icon: faBell, label: "Notifications", route: "/admin/notifications" },
    { icon: faGear, label: "Settings", route: "/admin/settings" },
  ];

  const handleLogout = () => {
    userLogout();
    setCurrentUser(null);
    navigate("/login");
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
              <p className="font-semibold">
                {formatFullname(currentUser)}
              </p>
              <p className="text-sm text-gray-400 capitalize">
                {currentUser.role}
              </p>
            </div>
          </div>
        )}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-300 hover:text-white"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <FontAwesomeIcon icon={faBars} />
        </motion.button>
      </div>

      <nav className="mt-4">
        <ul className="px-3 space-y-2">
          {navigationItems.map((item) => (
            <li key={item.label}>
              {!item.dropdown ? (
                <motion.div
                  whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(255, 255, 255, 0.1)" }}
                  transition={{ duration: 0.2 }}
                >
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
                    {item.icon && (
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {item.icon.displayName ? (
                          <item.icon className="w-5 h-5 text-gray-400 group-hover:text-white" />
                        ) : (
                          <FontAwesomeIcon
                            icon={item.icon}
                            className="w-5 h-5 text-gray-400 group-hover:text-white"
                          />
                        )}
                      </motion.div>
                    )}
                    {isOpen && <span className="font-medium">{item.label}</span>}
                  </NavLink>
                </motion.div>
              ) : (
                <>
                  <motion.button
                    onClick={() => toggleDropdown(item.key)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-colors group ${
                      openDropdowns.includes(item.key)
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                    whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(255, 255, 255, 0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <FontAwesomeIcon
                          icon={item.icon}
                          className="w-5 h-5 text-gray-400 group-hover:text-white"
                        />
                      </motion.div>
                      {isOpen && (
                        <span className="font-medium">{item.label}</span>
                      )}
                    </div>
                    {isOpen && (
                      <motion.div
                        animate={{ rotate: openDropdowns.includes(item.key) ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FontAwesomeIcon
                          icon={
                            openDropdowns.includes(item.key)
                              ? faChevronDown
                              : faChevronRight
                          }
                          className="w-4 h-4 text-gray-400"
                        />
                      </motion.div>
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {openDropdowns.includes(item.key) && isOpen && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-1 ml-10 space-y-1"
                      >
                        {item.children.map((subItem) => (
                          <motion.li
                            key={subItem.label}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
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
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </>
              )}
            </li>
          ))}
        </ul>

        <div className="mx-3 my-4 border-t border-gray-600"></div>

        <div className="px-3">
          <motion.button
            onClick={handleLogout}
            className="flex items-center w-full gap-3 px-3 py-2 text-gray-300 rounded-lg hover:bg-red-600 hover:text-white group"
            whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)" }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: -5 }} 
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FontAwesomeIcon
                icon={faRightFromBracket}
                className="w-5 h-5 text-gray-400 group-hover:text-white"
              />
            </motion.div>
            {isOpen && <span className="font-medium">Logout</span>}
          </motion.button>
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;