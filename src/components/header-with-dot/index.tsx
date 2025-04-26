import { FC, ReactNode } from 'react';

interface HeaderWithDotProps {
  children: ReactNode;
  className?: string;
}

const HeaderWithDot: FC<HeaderWithDotProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="h-3 w-3 rounded-full bg-blue-600"></div>
      <h2 className="text-xl font-semibold">{children}</h2>
    </div>
  );
};

export default HeaderWithDot;
