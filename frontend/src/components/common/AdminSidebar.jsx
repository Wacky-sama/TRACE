import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseUser, faUsers, faCalendar, faChartSimple, faFile, faBell, faRightFromBracket,faBars } from '@fortawesome/free-solid-svg-icons';

const AdminSidebar = ({onPanelChange}) => {
  const [isOpen, setIsOpen] = useState(true);

  const navigationItems = [
    { icon: faHouseUser, label: 'Dashboard', panel: 'dashboard' },
    { icon: faUsers, label: 'Users', panel: 'users' },
    {icon: faCalendar, label: 'Events', panel: 'events'},
    { icon: faChartSimple, label: 'Analytics', panel: 'analytics' },
    { icon: faFile, label: 'Reports', panel: 'reports' },
    { icon: faBell, label: 'Notifications', panel: 'notifications' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className={`bg-gray-800 text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'} min-h-screen`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className={`flex items-center gap-3 ${!isOpen && 'justify-center'}`}>
          {isOpen && <span className="font-semibold text-lg">Admin Panel</span>}
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-300 hover:text-white transition-colors"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-4">
        <ul className="space-y-2 px-3">
          {navigationItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => onPanelChange(item.panel)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors group"
              >
                <FontAwesomeIcon 
                  icon={item.icon} 
                  className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" 
                />
                {isOpen && <span className="font-medium">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>

        {/* Horizontal line after Notifications */}
        <div className="mx-3 my-4 border-t border-gray-600"></div>

        {/* Logout */}
        <div className="px-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors group"
          >
            <FontAwesomeIcon 
              icon={faRightFromBracket} 
              className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" 
            />
            {isOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;