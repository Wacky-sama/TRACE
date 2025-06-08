import { useState, useEffect } from 'react';
import {
  IoMenu, IoArrowBack, IoArrowDownCircle, IoArrowForwardCircle,
  IoPersonOutline, IoShieldCheckmarkOutline, IoLogOut
} from 'react-icons/io5';

function AdminDashboard() {
  const [activePanel, setActivePanel] = useState('user-management');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showUserManagementDropdown, setShowUserManagementDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const renderPanel = () => {
    switch (activePanel) {
      case 'user':
      case 'events':
        return <h2>Events Panel (Coming soon...)</h2>;
      case 'account-info':
        return <h2>Account Information Panel</h2>;
      case 'change-password':
        return <h2>Change Password Panel</h2>;
      case 'register-face':
        return <RegisterFacePage />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen font-sans relative">
      {!isSidebarOpen && (
        <button
          className="fixed top-4 left-4 text-3xl text-gray-800 z-[1001] md:hidden"
          onClick={() => setIsSidebarOpen(true)}
        >
          <IoMenu />
        </button>
      )}

      <aside className={`bg-gray-800 text-white p-5 transition-transform duration-300 fixed top-0 bottom-0 z-[999] w-64 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <button
          className="text-white text-2xl mb-6 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        >
          <IoArrowBack />
        </button>

        <ul className="space-y-4">
          {/* User Management */}
          <li>
            <span
              className={`cursor-pointer flex items-center ${activePanel === 'user-management' ? 'text-teal-400 font-bold' : ''}`}
              onClick={() => {
                setShowUserManagementDropdown(prev => !prev);
                setActivePanel('user-management');
              }}
            >
              {showUserManagementDropdown ? <IoArrowDownCircle className="mr-2" /> : <IoArrowForwardCircle className="mr-2" />}
              User Management
            </span>

            {showUserManagementDropdown && (
              <ul className="ml-6 mt-2 space-y-2">
                <li>
                  <a
                    href="#roles"
                    className={`flex items-center ${activePanel === 'roles' ? 'text-emerald-400 font-bold' : 'text-white'}`}
                    onClick={() => setActivePanel('roles')}
                  >
                    <IoShieldCheckmarkOutline className="mr-2" />
                    Roles
                  </a>
                </li>
                <li>
                  <a
                    href="#users"
                    className={`flex items-center ${activePanel === 'user' ? 'text-emerald-400 font-bold' : 'text-white'}`}
                    onClick={() => setActivePanel('user')}
                  >
                    <IoPersonOutline className="mr-2" />
                    Users
                  </a>
                </li>
              </ul>
            )}
          </li>

          {/* Events */}
          <li>
            <a
              href="#events"
              className={`block ${activePanel === 'events' ? 'text-teal-400 font-bold' : 'text-white'}`}
              onClick={() => setActivePanel('events')}
            >
              Events
            </a>
          </li>

          {/* Account */}
          <li>
            <span
              className={`cursor-pointer flex items-center ${['account', 'account-info', 'change-password', 'register-face'].includes(activePanel) ? 'text-teal-400 font-bold' : ''}`}
              onClick={() => {
                setShowAccountDropdown(prev => !prev);
                setActivePanel('account');
              }}
            >
              {showAccountDropdown ? <IoArrowDownCircle className="mr-2" /> : <IoArrowForwardCircle className="mr-2" />}
              Account
            </span>

            {showAccountDropdown && (
              <ul className="ml-6 mt-2 space-y-2">
                <li>
                  <a
                    href="#account-info"
                    className={`${activePanel === 'account-info' ? 'text-emerald-400 font-bold' : 'text-white'}`}
                    onClick={() => setActivePanel('account-info')}
                  >
                    Account Information
                  </a>
                </li>
                <li>
                  <a
                    href="#change-password"
                    className={`${activePanel === 'change-password' ? 'text-emerald-400 font-bold' : 'text-white'}`}
                    onClick={() => setActivePanel('change-password')}
                  >
                    Change Password
                  </a>
                </li>
              </ul>
            )}
          </li>

          <hr className="border-gray-500 my-4" />

          {/* Logout */}
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center text-white hover:text-red-400 transition-colors"
            >
              <IoLogOut className="mr-2" />
              Logout
            </button>
          </li>
        </ul>
      </aside>

      <main className="flex-1 bg-gray-100 p-6 overflow-auto">{renderPanel()}</main>
    </div>
  );
}

export default AdminDashboard;
