import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import HeaderWithDot from '@/components/header-with-dot';
import { postScooter } from '@/services/scooter-service';

import ActionButtons from './action-buttons';
import MapContainer from './map-container';
import ScooterForm from './scooter-form';

const NewScooterPage: React.FC = () => {
  const navigate = useNavigate();

  const [scooterData, setScooterData] = useState({
    type: '',
    location: 'Select location on map',
    pricePerHour: '',
    coordinates: { lat: 0, lng: 0 },
  });
  const [mapHeight, setMapHeight] = useState('600px');

  const handleChange = (field: string, value: string) => {
    setScooterData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = (coordinates: { lat: number; lng: number }) => {
    // Format coordinates to 6 decimal places
    const formattedLat = coordinates.lat.toFixed(6);
    const formattedLng = coordinates.lng.toFixed(6);

    // Update location text and coordinates
    setScooterData(prev => ({
      ...prev,
      location: `${formattedLat}, ${formattedLng}`,
      coordinates: coordinates,
    }));
  };

  const handleCreateScooter = async () => {
    try {
      await postScooter(
        scooterData.type,
        { lat: scooterData.coordinates.lat, lng: scooterData.coordinates.lng },
        Number(scooterData.pricePerHour)
      );
      toast.success('Scooter created successfully!');
      navigate('/allocation/list-and-settings');
    } catch (error) {
      toast.error(`Failed to create scooter.${error}`);
    }
  };

  const handleCancel = () => {
    navigate('/allocation/list-and-settings');
  };

  // Calculate the remaining screen height for the map
  useEffect(() => {
    const calculateMapHeight = () => {
      const windowHeight = window.innerHeight;
      const headerHeight = 60; // Estimate for the header
      const inputSectionHeight = 150; // Estimate for the input section with margins
      const buttonsHeight = 80; // Estimate for the buttons section with padding
      const remainingHeight =
        windowHeight - headerHeight - inputSectionHeight - buttonsHeight;

      // Ensure minimum height of 400px
      setMapHeight(`${Math.max(400, remainingHeight)}px`);
    };

    calculateMapHeight();
    window.addEventListener('resize', calculateMapHeight);

    return () => {
      window.removeEventListener('resize', calculateMapHeight);
    };
  }, []);

  const isSubmitDisabled =
    !scooterData.type ||
    scooterData.location === 'Select location on map' ||
    !scooterData.pricePerHour ||
    scooterData.coordinates.lat === 0;

  return (
    <div className="container mx-auto max-w-6xl p-4">
      <HeaderWithDot className="mb-6">Add New Scooter</HeaderWithDot>

      <div className="mb-6 flex flex-col space-y-6">
        <ScooterForm scooterData={scooterData} handleChange={handleChange} />

        <MapContainer
          mapHeight={mapHeight}
          onLocationSelect={handleLocationSelect}
        />
      </div>

      <ActionButtons
        isDisabled={isSubmitDisabled}
        onCancel={handleCancel}
        onSubmit={handleCreateScooter}
      />
    </div>
  );
};

export default NewScooterPage;
