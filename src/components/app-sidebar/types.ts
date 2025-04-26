import { ReactNode } from 'react';

export interface SubmenuItemType {
  label: string;
  path: string;
}

export interface SidebarItemType {
  icon: ReactNode;
  label: string;
  path: string;
  hasSubmenu?: boolean;
  expanded?: boolean;
  submenuItems?: SubmenuItemType[];
  defaultSubmenuPath?: string;
}
