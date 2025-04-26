import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SubmenuItem from './submenu-item';
import { SidebarItemType } from './types';

interface SidebarItemProps {
  item: SidebarItemType;
  index: number;
  onItemClick: (item: SidebarItemType, index: number) => void;
}

const SidebarItem: FC<SidebarItemProps> = ({ item, index, onItemClick }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + '/')
    );
  };

  return (
    <div key={item.path} className="flex flex-col">
      <Link
        to={item.hasSubmenu ? item.defaultSubmenuPath || item.path : item.path}
        className={cn(
          'flex items-center gap-2 p-4 text-sm transition-colors duration-200',
          isActive(item.path)
            ? 'bg-blue-700 text-white'
            : 'text-blue-900 hover:bg-blue-600 hover:text-white'
        )}
        onClick={e => {
          if (item.hasSubmenu) {
            e.preventDefault();
          }
          onItemClick(item, index);
        }}
      >
        <span className="w-6">{item.icon}</span>
        <span>{item.label}</span>
        {item.hasSubmenu && (
          <ChevronDown
            className={cn(
              'ml-auto h-4 w-4 transition-transform duration-200',
              item.expanded ? 'rotate-180' : ''
            )}
          />
        )}
      </Link>

      {/* Submenu items with height transition animation */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          item.expanded ? 'max-h-40' : 'max-h-0'
        )}
      >
        <div className="bg-opacity-80 bg-blue-600 text-white">
          {item.submenuItems?.map(submenu => (
            <SubmenuItem key={submenu.path} item={submenu} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarItem;
