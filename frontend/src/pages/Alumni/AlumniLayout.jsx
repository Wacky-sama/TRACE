import AlumniSidebar from '../../components/common/AlumniSidebar';
import { Outlet } from 'react-router-dom';

const AlumniLayout = ({ user }) => (
  <div className="flex min-h-screen">
    <AlumniSidebar user={user} />
    <div className="flex-1 bg-gray-100">
      <Outlet />
    </div>
  </div>
);

export default AlumniLayout;