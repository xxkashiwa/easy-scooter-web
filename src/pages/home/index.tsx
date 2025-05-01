/* eslint-disable @typescript-eslint/no-explicit-any */
import HeaderWithDot from '@/components/header-with-dot';
import ScooterMap from '../../lib/scooter-utils/scooter-map';

const HomePage = () => {
  return (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <HeaderWithDot>Scooter Position</HeaderWithDot>
      </div>
      <div className="flex-1 p-4">
        <div className="relative h-full overflow-hidden rounded-lg bg-white shadow-md">
          <ScooterMap className="h-full w-full" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
