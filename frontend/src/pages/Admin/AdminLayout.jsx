import AdminSidebar from '../../components/common/AdminSidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = ({ user }) => (
  <div className="flex min-h-screen">
    <AdminSidebar user={user} />
    <div className="flex-1 bg-gray-100">
      <Outlet />
    </div>
  </div>
);

export default AdminLayout;