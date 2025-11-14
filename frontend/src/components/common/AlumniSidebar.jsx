/* eslint-disable no-unused-vars */
import { userLogout } from "../../utils/storage";
import { useNavigate, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouseUser,
  faCalendar,
  faBell,
  faRightFromBracket,
  faGear,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import useTokenWatcher from "../../hooks/useTokenWatcher";
import { useUser } from "../../hooks/useUser";
import api from "../../services/api";
import { formatFullname } from "../../utils/format";

const AlumniSidebar = () => {
  useTokenWatcher();
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);
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
    { icon: faHouseUser, label: "Dashboard", route: "/alumni/dashboard" },
    { icon: faCalendar, label: "Events", route: "/alumni/events" },
    { icon: faBell, label: "Notifications", route: "/alumni/notifications" },
    { icon: faGear, label: "Settings", route: "/alumni/settings" },
  ];

  const handleLogout = async () => {
    try{
      await api.post("/users/logout");
    } finally {
    userLogout();
    setCurrentUser(null);
    navigate("/login");
    }
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
            <motion.li
              key={item.label}
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
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="w-5 h-5 text-gray-400 group-hover:text-white"
                  />
                </motion.div>
                {isOpen && <span className="font-medium">{item.label}</span>}
              </NavLink>
            </motion.li>
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

export default AlumniSidebar;