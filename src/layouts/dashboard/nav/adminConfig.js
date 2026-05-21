import { FiHome, FiUsers, FiRefreshCw } from "react-icons/fi";
import { MdEventSeat, MdBook, MdPeople, MdBookmarkBorder, MdLogin, MdLogout } from "react-icons/md";
import { IoSchoolOutline } from "react-icons/io5";

// Admin Navigation Configuration - Smart Library System
const adminNavConfig = [
  {
    title: 'Dashboard',
    path: '/admin/dashboard',
    icon: <FiHome />,
  },
  {
    title: 'User Management',
    path: '/admin/users',
    icon: <MdPeople />,
  },
  {
    title: 'Student Management',
    path: '/admin/students',
    icon: <IoSchoolOutline />,
  },
  {
    title: 'Book Management',
    path: '/admin/books',
    icon: <MdBook />,
  },
  {
    title: 'Seat Management',
    path: '/admin/seats',
    icon: <MdEventSeat />,
  },
  {
    title: 'Check-In/Check-Out',
    path: '/admin/checkin-checkout',
    icon: <MdLogin />,
  },
  // {
  //   title: 'Reservations Management',
  //   path: '/admin/reservations',
  //   icon: <MdBookmarkBorder />,
  // },
  {
    title: 'Issue/Return Management',
    path: '/admin/issue-return',
    icon: <FiRefreshCw />,
  },
];

export default adminNavConfig;