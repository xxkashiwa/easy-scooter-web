import React from 'react';
import RatingStars from '../../../../lib/scooter-utils/rating-stars';
import {
  getFormattedStatusText,
  getStatusColor,
} from '../../../../lib/scooter-utils/status-utils';

interface ScooterInfoProps {
  id: number;
  type: string;
  rating: number;
  reviewCount: number;
  pricePerHour: number;
  location: string;
  status: string;
}

const ScooterInfo: React.FC<ScooterInfoProps> = ({
  id,
  type,
  rating,
  reviewCount,
  pricePerHour,
  location,
  status,
}) => {
  return (
    <div className="flex w-full">
      {/* Left side - ID, type and rating */}
      <div className="flex-1 pr-2">
        <div className="text-lg font-bold">NO. {id}</div>
        <div className="mb-1 text-sm text-gray-700">{type}</div>
        <div className="flex items-center text-xs">
          <RatingStars rating={rating} />
          <span className="ml-1 text-gray-600">({reviewCount})</span>
        </div>
      </div>

      {/* Right side - Price, location and status */}
      <div className="inline-flex flex-1 items-center gap-2">
        {/* Price and location */}
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

        {/* Status badge */}
        <div className="flex flex-row items-center">
          <div
            className={`text-md inline-block rounded-full px-5 py-3 font-medium ${getStatusColor(status)}`}
          >
            {getFormattedStatusText(status)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScooterInfo;
