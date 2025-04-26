/* eslint-disable @typescript-eslint/no-explicit-any */
import HeaderWithDot from '@/components/header-with-dot';
import React, { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import useScooterStore from '../scooter-store';
import ScooterCard from './components/scooter-card';

const ListAndSettings: React.FC = () => {
  const { scooters, fetchScooters } = useScooterStore();

  useEffect(() => {
    fetchScooters().catch(error => {
      console.error('Failed to fetch scooters:', error);
    });
  }, [fetchScooters]);

  // Function to convert location coordinates to text representation
  const formatLocation = (
    location: { lat: number; lng: number } | undefined
  ) => {
    if (!location) return '';
    return `${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}`;
  };

  // Split scooters into available and unavailable groups
  const { availableScooters, unavailableScooters } = useMemo(() => {
    const available = scooters.filter(
      scooter => scooter.status === 'available'
    );
    const unavailable = scooters.filter(
      scooter => scooter.status !== 'available'
    );
    return { availableScooters: available, unavailableScooters: unavailable };
  }, [scooters]);

  const handleScooterDetail = (id: number) => {
    console.log(`View detail for scooter ${id}`);
    toast.info(`Viewing details for scooter #${id}`);
    // Handle scooter detail view
  };

  const handleScooterEdit = (id: number) => {
    console.log(`Edit scooter ${id}`);
    toast.info(`Editing scooter #${id}`);
    // Handle scooter editing
  };

  const handleScooterDelete = (id: number) => {
    console.log(`Delete scooter ${id}`);
    toast.info(`Deleting scooter #${id}`);
    // Handle scooter deletion
  };

  // Render a single scooter card
  const renderScooterCard = (scooter: any) => (
    <ScooterCard
      key={scooter.id}
      id={`No.${scooter.id}`}
      pricePerHour={12} // Default price as it's not available in the API data
      type={scooter.type || 'Standard E-scooter'}
      rating={4} // Default rating as it's not available in the API data
      reviewCount={0} // Default review count as it's not available in the API data
      location={formatLocation(scooter.location)}
      status={
        scooter.status === 'available'
          ? 'Available'
          : scooter.status === 'in_use'
            ? 'In Use'
            : 'Maintenance'
      }
      onClick={() => handleScooterDetail(scooter.id)}
      onEdit={() => handleScooterEdit(scooter.id)}
      onDelete={() => handleScooterDelete(scooter.id)}
    />
  );

  return (
    <div className="container mx-auto flex h-full flex-col p-4">
      <div className="flex flex-1 flex-col space-y-4">
        {/* Available Scooters Table */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <HeaderWithDot className="mb-2">Available Scooters</HeaderWithDot>
          <div className="flex-1 overflow-y-auto rounded-lg border pr-2">
            <div className="flex flex-col space-y-3 p-3">
              {availableScooters.map(renderScooterCard)}
              {availableScooters.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  No available scooters
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Unavailable Scooters Table */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <HeaderWithDot className="mb-2">Unavailable Scooters</HeaderWithDot>
          <div className="flex-1 overflow-y-auto rounded-lg border pr-2">
            <div className="flex flex-col space-y-3 p-3">
              {unavailableScooters.map(renderScooterCard)}
              {unavailableScooters.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  No unavailable scooters
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListAndSettings;
