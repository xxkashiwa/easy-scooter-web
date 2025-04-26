/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import React, { useState } from 'react';

interface ScooterCardProps {
  id: string;
  pricePerHour: number;
  type: string;
  rating: number;
  reviewCount: number;
  location: string;
  status: string;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ScooterCard: React.FC<ScooterCardProps> = ({
  id,
  pricePerHour,
  type,
  rating,
  reviewCount,
  location,
  status,
  onClick,
  onEdit,
  onDelete,
}) => {
  // Add state for dialog
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Generate stars based on rating
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  // Status color based on status
  const getStatusColor = () => {
    switch (status) {
      case 'Free':
        return 'bg-orange-500 text-white';
      case 'In Use':
        return 'bg-blue-500 text-white';
      case 'Maintenance':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-300 text-gray-700';
    }
  };

  return (
    <>
      <div className="flex w-full items-center rounded-2xl bg-[#d6e6f2] p-4 shadow-sm transition-shadow hover:shadow-md">
        {/* Left half - All scooter info */}
        <div className="flex w-1/2">
          {/* Left side of the left half */}
          <div className="flex-1 pr-2">
            <div className="text-lg font-bold">{id}</div>
            <div className="mb-1 text-sm text-gray-700">{type}</div>
            <div className="flex items-center text-xs">
              {renderStars()}
              <span className="ml-1 text-gray-600">({reviewCount})</span>
            </div>
          </div>

          {/* Right side of the left half - Restructured */}
          <div className="inline-flex flex-1 items-center gap-2">
            {/* First flex-col div for price and location */}
            <div className="mr-2 flex flex-col items-end">
              <div className="mb-1 text-xl font-semibold text-gray-900">
                ¥ {pricePerHour}/h
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1 h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                {location}
              </div>
            </div>

            {/* Second flex-row div for status */}
            <div className="flex flex-row items-center">
              <div
                className={`text-md inline-block rounded-full px-5 py-3 font-medium ${getStatusColor()}`}
              >
                {status}
              </div>
            </div>
          </div>
        </div>

        {/* Right half - Buttons */}
        <div className="flex w-1/2 items-center justify-end space-x-2">
          <button
            onClick={() => setShowDetailsDialog(true)}
            className="text-md rounded-lg bg-blue-100 p-5 font-semibold text-blue-800 transition-colors hover:bg-blue-200"
          >
            Detail
          </button>
          <button
            onClick={onEdit}
            className="text-md rounded-lg bg-green-100 p-5 font-semibold text-green-800 transition-colors hover:bg-green-200"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-md rounded-lg bg-red-100 p-5 font-semibold text-red-800 transition-colors hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Scooter Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scooter Details</DialogTitle>
            <DialogDescription>
              Detailed information about this scooter.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="font-medium">ID:</p>
              <p className="col-span-3">{id}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="font-medium">Type:</p>
              <p className="col-span-3">{type}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="font-medium">Price:</p>
              <p className="col-span-3">¥ {pricePerHour}/hour</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="font-medium">Rating:</p>
              <div className="col-span-3 flex items-center">
                {renderStars()}
                <span className="ml-2">({reviewCount} reviews)</span>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="font-medium">Location:</p>
              <p className="col-span-3">{location}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="font-medium">Status:</p>
              <div className="col-span-3">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getStatusColor()}`}
                >
                  {status}
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ScooterCard;
