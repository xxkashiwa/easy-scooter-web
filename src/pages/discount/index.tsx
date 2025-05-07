import HeaderWithDot from '@/components/header-with-dot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  getCurrentRentalConfig,
  postRentalConfig,
} from '@/services/rental-config-service';
import { RentalConfig } from '@/services/types';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const Discount: React.FC = () => {
  const [currentConfig, setCurrentConfig] = useState<RentalConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newConfig, setNewConfig] = useState<
    Omit<RentalConfig, 'id' | 'isActive'>
  >({
    baseHourlyRate: 0,
    oneHourRate: 0,
    fourHoursRate: 0,
    oneDayRate: 0,
    oneWeekRate: 0,
    studentDiscount: 0,
    oldDiscount: 0,
    description: '',
  });

  useEffect(() => {
    fetchCurrentConfig();
  }, []);

  const fetchCurrentConfig = async () => {
    try {
      setIsLoading(true);
      const config = await getCurrentRentalConfig();
      setCurrentConfig(config);
      // Initialize the form with current values
      setNewConfig({
        baseHourlyRate: config.baseHourlyRate,
        oneHourRate: config.oneHourRate,
        fourHoursRate: config.fourHoursRate,
        oneDayRate: config.oneDayRate,
        oneWeekRate: config.oneWeekRate,
        studentDiscount: config.studentDiscount || 0,
        oldDiscount: config.oldDiscount || 0,
        description: config.description,
      });
    } catch (error) {
      toast.error('Failed to fetch current discount settings');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      await postRentalConfig({
        ...newConfig,
        baseHourlyRate: 1.0,
        id: 0, // ID will be assigned by the server
        isActive: true,
      });
      toast.success('Discount settings updated successfully');
      await fetchCurrentConfig(); // Refresh current config after update
    } catch (error) {
      toast.error('Failed to update discount settings');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'description') {
      setNewConfig({ ...newConfig, [name]: value });
    } else {
      // Convert string to number for rate fields
      setNewConfig({ ...newConfig, [name]: parseFloat(value) || 0 });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <HeaderWithDot className="mb-6">Discount Management</HeaderWithDot>

      {/* Current Discount Settings */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <HeaderWithDot className="mb-4">
          Current Discount Settings
        </HeaderWithDot>
        {isLoading && !currentConfig ? (
          <p>Loading current settings...</p>
        ) : currentConfig ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-md bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-600">1 Hour Rate</h3>
              <p className="text-lg font-bold">
                £{currentConfig.oneHourRate.toFixed(2)}
              </p>
            </div>
            <div className="rounded-md bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-600">
                4 Hours Rate
              </h3>
              <p className="text-lg font-bold">
                £{currentConfig.fourHoursRate.toFixed(2)}
              </p>
            </div>
            <div className="rounded-md bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-600">1 Day Rate</h3>
              <p className="text-lg font-bold">
                £{currentConfig.oneDayRate.toFixed(2)}
              </p>
            </div>
            <div className="rounded-md bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-600">1 Week Rate</h3>
              <p className="text-lg font-bold">
                £{currentConfig.oneWeekRate.toFixed(2)}
              </p>
            </div>
            <div className="rounded-md bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-600">
                Student Rate
              </h3>
              <p className="text-lg font-bold">
                {currentConfig.studentDiscount.toFixed(2)}
              </p>
            </div>
            <div className="rounded-md bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-600">Old Rate</h3>
              <p className="text-lg font-bold">
                {currentConfig.oldDiscount.toFixed(2)}
              </p>
            </div>
            <div className="rounded-md bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-600">Description</h3>
              <p className="text-sm">{currentConfig.description}</p>
            </div>
          </div>
        ) : (
          <p>No active discount settings found.</p>
        )}
      </div>

      {/* New Discount Settings Form */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <HeaderWithDot className="mb-4">Update Discount Settings</HeaderWithDot>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label
                htmlFor="oneHourRate"
                className="mb-1 block text-sm font-medium"
              >
                1 Hour Rate (£)
              </label>
              <Input
                type="number"
                id="oneHourRate"
                name="oneHourRate"
                step="0.01"
                min="0"
                value={newConfig.oneHourRate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="fourHoursRate"
                className="mb-1 block text-sm font-medium"
              >
                4 Hours Rate (£)
              </label>
              <Input
                type="number"
                id="fourHoursRate"
                name="fourHoursRate"
                step="0.01"
                min="0"
                value={newConfig.fourHoursRate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="oneDayRate"
                className="mb-1 block text-sm font-medium"
              >
                1 Day Rate (£)
              </label>
              <Input
                type="number"
                id="oneDayRate"
                name="oneDayRate"
                step="0.01"
                min="0"
                value={newConfig.oneDayRate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="oneWeekRate"
                className="mb-1 block text-sm font-medium"
              >
                1 Week Rate (£)
              </label>
              <Input
                type="number"
                id="oneWeekRate"
                name="oneWeekRate"
                step="0.01"
                min="0"
                value={newConfig.oneWeekRate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="studentDiscount"
                className="mb-1 block text-sm font-medium"
              >
                Student Rate
              </label>
              <Input
                type="number"
                id="studentDiscount"
                name="studentDiscount"
                step="0.01"
                min="0"
                value={newConfig.studentDiscount}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="oldDiscount"
                className="mb-1 block text-sm font-medium"
              >
                Old Rate
              </label>
              <Input
                type="number"
                id="oldDiscount"
                name="oldDiscount"
                step="0.01"
                min="0"
                value={newConfig.oldDiscount}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium"
            >
              Description
            </label>
            <Input
              type="text"
              id="description"
              name="description"
              value={newConfig.description}
              onChange={handleInputChange}
              placeholder="Describe this discount configuration"
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            className="mt-4 bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Discount Settings'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Discount;
