import { cn } from '@/lib/utils';
import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SubmenuItemType } from './types';

interface SubmenuItemProps {
  item: SubmenuItemType;
}

const SubmenuItem: FC<SubmenuItemProps> = ({ item }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Link
      to={item.path}
      className={cn(
        'flex items-center py-4 pl-12 text-sm transition-colors duration-200',
        isActive(item.path) ? 'bg-blue-700' : 'hover:bg-blue-700'
      )}
    >
      {item.label}
    </Link>
  );
};

export default SubmenuItem;
