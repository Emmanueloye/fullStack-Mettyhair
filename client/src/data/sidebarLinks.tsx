import { BsBoxes } from 'react-icons/bs';
import {
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
    title: 'accounting - in dev',
    links: ['account'],
    icon: <FaChartBar />,
  },
  {
    id: 6,
    title: 'user manager',
    links: ['all users', 'new users report', 'create admin'],
    icon: <FaUserAlt />,
  },

  {
    id: 7,
    title: 'site settings',
    links: ['settings'],
    icon: <IoSettings />,
  },
];
