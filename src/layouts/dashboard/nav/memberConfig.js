import { FiHome, FiBookOpen, FiUser } from "react-icons/fi";
import { MdEventSeat, MdBookmarkBorder } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";

// Student/Member Navigation Configuration - Smart Library System
const memberNavConfig = [
  {
    title: 'Dashboard',
    path: '/member/dashboard',
    icon: <FiHome />,
  },
  {
    title: 'Browse Books',
    path: '/member/browse-books',
    icon: <AiOutlineSearch />,
  },
  {
    title: 'Seat Booking',
    path: '/member/seat-booking',
    icon: <MdEventSeat />,
  },
  // {
  //   title: 'My Reservations',
  //   path: '/member/my-reservations',
  //   icon: <MdBookmarkBorder/>,
  // },
  {
    title: 'My Issued Books',
    path: '/member/my-issued-books',
    icon: <FiBookOpen />,
  },
  {
    title: 'My Profile',
    path: '/member/profile',
    icon: <FiUser />,
  },
];

export default memberNavConfig;