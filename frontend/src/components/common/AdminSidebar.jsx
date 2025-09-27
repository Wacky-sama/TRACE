import { clearAuthData } from '../../utils/storage';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHouseUser, faUsers, faCalendar, faChartSimple, 
  faFile, faBell, faRightFromBracket, faGear, faBars 
} from '@fortawesome/free-solid-svg-icons';

const AdminSidebar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const navigationItems = [
    { icon: faHouseUser, label: 'Dashboard', route: '/admin/dashboard' },
    { icon: faUsers, label: 'Users', route: '/admin/users' },
    { icon: faCalendar, label: 'Events', route: '/admin/events'},
    { icon: faChartSimple, label: 'Analytics', route: '/admin/analytics' },
    { icon: faFile, label: 'Reports', route: '/admin/reports' },
    { icon: faBell, label: 'Notifications', route: '/admin/notifications' },
    { icon: faGear, label: 'Account Settings', route: '/admin/settings' }
  ];

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  return (
    <div className={`bg-gray-800 text-white transition-[width] duration-300 ${isOpen ? 'w-60' : 'w-16'} min-h-screen shrink-0`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {isOpen && user && (
          <div className="text-center w-full">
            <div className="font-semibold text-sm text-white">
              {user.firstname} {user.middle_initial ? `${user.middle_initial}. ` : ""}{user.lastname}
            </div>
            <div className="text-xs text-gray-400 capitalize">{user.role}</div>
          </div>
        )}
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      <nav className="mt-4">
        <ul className="space-y-2 px-3">
          {navigationItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => navigate(item.route)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white group"
              >
                <FontAwesomeIcon icon={item.icon} className="w-5 h-5 text-gray-400 group-hover:text-white" />
                {isOpen && <span className="font-medium">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>

        <div className="mx-3 my-4 border-t border-gray-600"></div>

        <div className="px-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white group"
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="w-5 h-5 text-gray-400 group-hover:text-white" />
            {isOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;