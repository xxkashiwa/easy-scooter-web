import HeaderWithDot from '@/components/header-with-dot';
import Map from '@/components/map';

const HomePage = () => {
  return (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <HeaderWithDot>Scooter Position</HeaderWithDot>
      </div>
      <div className="flex-1 p-4">
        <div className="h-full overflow-hidden rounded-lg bg-white shadow-md">
          <Map className="h-full w-full" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
