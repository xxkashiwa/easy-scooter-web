import { FC, ReactNode } from 'react';
import Sidebar from './components/app-sidebar';
import { Toaster } from './components/ui/sonner';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 overflow-auto p-6">{children}</div>
      <Toaster position="top-center" richColors />
    </div>
  );
};

export default AppLayout;
