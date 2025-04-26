import { Input } from '@/components/ui/input';
import React from 'react';

interface ScooterFormProps {
  scooterData: {
    type: string;
    location: string;
    pricePerHour: string;
  };
  handleChange: (field: string, value: string) => void;
}

const ScooterForm: React.FC<ScooterFormProps> = ({
  scooterData,
  handleChange,
}) => {
  return (
    <div className="flex flex-row gap-4">
      <div className="flex-1">
        <label htmlFor="type" className="mb-2 block text-sm font-medium">
          Type
        </label>
        <Input
          id="type"
          type="text"
          value={scooterData.type}
          onChange={e => handleChange('type', e.target.value)}
          placeholder="Enter scooter type"
        />
      </div>
      <div className="flex-1">
        <label htmlFor="location" className="mb-2 block text-sm font-medium">
          Location
        </label>
        <Input
          id="location"
          type="text"
          value={scooterData.location}
          readOnly
          className="bg-gray-100"
        />
      </div>
      <div className="flex-1">
        <label
          htmlFor="pricePerHour"
          className="mb-2 block text-sm font-medium"
        >
          Price per Hour
        </label>
        <Input
          id="pricePerHour"
          type="number"
          min="0"
          step="0.01"
          value={scooterData.pricePerHour}
          onChange={e => handleChange('pricePerHour', e.target.value)}
          placeholder="Enter price per hour"
        />
      </div>
    </div>
  );
};

export default ScooterForm;
