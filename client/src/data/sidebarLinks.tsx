import { BsBoxes } from 'react-icons/bs';
import {
  FaBlog,
  FaBookOpen,
  FaBoxes,
  FaChartBar,
  FaComment,
  FaUserAlt,
} from 'react-icons/fa';
import { IoSettings } from 'react-icons/io5';

export type LinksType = {
  id: number;
  title: string;
  links: string[];
  icon: React.ReactNode;
};

export const sidebarLinks: LinksType[] = [
  {
    id: 1,
    title: 'page manager',
    links: ['categories', 'subcategories', 'sliders'],
    icon: <FaBookOpen />,
  },
  {
    id: 2,
    title: 'product manager',
    links: [
      'products',
      'active products',
      'inactive products',
      'stockout notice',
    ],
    icon: <BsBoxes />,
  },
  {
    id: 3,
    title: 'order manager',
    links: [
      'pending orders',
      'confirmed orders',
      'delivered orders',
      'sales orders',
      // 'cancelled orders',
    ],
    icon: <FaBoxes />,
  },
  {
    id: 4,
    title: 'review manager',
    links: ['pending reviews', 'approved reviews'],
    icon: <FaComment />,
  },
  {
    id: 5,
    title: 'blog manager',
    links: ['blogs'],
    icon: <FaBlog />,
  },
  {
    id: 6,
    title: 'accounting - in dev',
    links: ['account'],
    icon: <FaChartBar />,
  },
  {
    id: 7,
    title: 'user manager',
    links: ['all users', 'new users report', 'create admin', 'contacts'],
    icon: <FaUserAlt />,
  },

  {
    id: 8,
    title: 'site settings',
    links: ['settings'],
    icon: <IoSettings />,
  },
];
