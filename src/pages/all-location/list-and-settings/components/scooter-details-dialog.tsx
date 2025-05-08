import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import React from 'react';
import QRCode from 'react-qr-code';
import RatingStars from '../../../../lib/scooter-utils/rating-stars';
import {
  getFormattedStatusText,
  getStatusColor,
} from '../../../../lib/scooter-utils/status-utils';

interface ScooterDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: number;
  type: string;
  pricePerHour: number;
  rating: number;
  reviewCount: number;
  location: string;
  status: string;
}

const ScooterDetailsDialog: React.FC<ScooterDetailsDialogProps> = ({
  open,
  onOpenChange,
  id,
  type,
  pricePerHour,
  rating,
  reviewCount,
  location,
  status,
}) => {
  // Convert scooter details to JSON format for QR code
  const scooterDetailsJson = JSON.stringify({
    id,
    type,
    pricePerHour,
    rating,
    reviewCount,
    location,
    status,
  }, null, 2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              <RatingStars rating={rating} />
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
                className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(status)}`}
              >
                {getFormattedStatusText(status)}
              </span>
            </div>
          </div>
          
          {/* QR Code Section */}
          <div className="mt-4 flex flex-col items-center justify-center gap-3">
            <p className="font-medium">Scooter QR Code</p>
            <div className="p-4 bg-white rounded-lg">
              <QRCode value={scooterDetailsJson} size={180} />
            </div>
            <p className="text-xs text-gray-500">Scan for scooter details</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScooterDetailsDialog;
