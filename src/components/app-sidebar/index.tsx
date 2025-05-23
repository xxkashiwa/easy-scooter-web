import {
  AlertTriangle,
  Heart,
  Home,
  List,
  LogIn,
  MapPin,
  Wallet2,
} from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarItem from './sidebar-item';
import { SidebarItemType } from './types';

const Sidebar: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState<SidebarItemType[]>([
    { icon: <Home />, label: 'Home', path: '/' },
    { icon: <List />, label: 'Order List', path: '/order-list' },
    { icon: <AlertTriangle />, label: 'Fault', path: '/fault' },
    {
      icon: <MapPin />,
      label: 'Allocation',
      path: '/allocation',
      hasSubmenu: true,
      expanded: false,
      submenuItems: [
        { label: 'List and Settings', path: '/allocation/list-and-settings' },
        { label: 'No Parking Zones', path: '/allocation/no-parking-zone' },
      ],
      defaultSubmenuPath: '/allocation/list-and-settings',
    },
    {
      icon: <Wallet2 />,
      label: 'Income',
      path: '/income',
      hasSubmenu: true,
      expanded: false,
      submenuItems: [
        { label: 'Weekly Income', path: '/income/weekly-income' },
        { label: 'Daily Income', path: '/income/daily-income' },
      ],
      defaultSubmenuPath: '/income/weekly-income',
    },
    { icon: <Heart />, label: 'Discount', path: '/discount' },
  ]);

  // Check if current path is a submenu path and expand the parent menu
  useEffect(() => {
    const currentPath = location.pathname;

    const updatedItems = items.map(item => {
      // For items with submenu, check if we need to expand
      if (item.submenuItems) {
        // Check if any submenu path matches current path
        const isInSubmenu = item.submenuItems.some(
          submenu =>
            currentPath === submenu.path ||
            currentPath.startsWith(submenu.path + '/')
        );

        return { ...item, expanded: isInSubmenu };
      }
      return item;
    });

    setItems(updatedItems);
  }, [location.pathname]);

  const toggleSubmenu = (index: number) => {
    const newItems = [...items];

    // Close all other expanded menus first
    newItems.forEach((item, i) => {
      if (i !== index && item.expanded) {
        item.expanded = false;
      }
    });

    // Toggle the clicked menu
    newItems[index].expanded = !newItems[index].expanded;
    setItems(newItems);

    // If toggling to expanded and item has a default submenu path, navigate to it
    if (newItems[index].expanded && newItems[index].defaultSubmenuPath) {
      navigate(newItems[index].defaultSubmenuPath);
    }
  };

  const handleMenuItemClick = (item: SidebarItemType, index: number) => {
    if (item.hasSubmenu) {
      toggleSubmenu(index);
    } else {
      // If clicking a regular menu item, close all expanded menus
      const newItems = [...items];
      newItems.forEach(item => {
        if (item.expanded) {
          item.expanded = false;
        }
      });
      setItems(newItems);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen w-[200px] flex-col bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="p-4 text-xl font-bold text-blue-900">E-Scooter</div>
      <div className="flex flex-1 flex-col">
        {items.map((item, index) => (
          <SidebarItem
            key={item.path}
            item={item}
            index={index}
            onItemClick={handleMenuItemClick}
          />
        ))}
      </div>

      {/* Special Login Button */}
      <div
        onClick={handleLoginClick}
        className="m-4 flex cursor-pointer items-center gap-2 rounded-xl bg-blue-100 p-4 font-bold text-blue-900 shadow-sm transition-colors duration-200 hover:bg-blue-200"
      >
        <LogIn className="h-6 w-6" />
        <span>Login</span>
      </div>
    </div>
  );
};

export default Sidebar;
