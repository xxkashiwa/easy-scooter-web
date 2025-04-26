/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import ScooterActions from './scooter-actions';
import ScooterDeleteDialog from './scooter-delete-dialog';
import ScooterDetailsDialog from './scooter-details-dialog';
import ScooterEditDialog from './scooter-edit-dialog';
import ScooterInfo from './scooter-info';

interface ScooterCardProps {
  id: number;
  pricePerHour: number;
  type: string;
  rating: number;
  reviewCount: number;
  location: string;
  status: string;

  // onEdit?: (
  //   id: string,
  //   updatedScooter: { type: string; status: string; pricePerHour: number }
  // ) => void;
  // onDelete?: () => void;
}

const ScooterCard: React.FC<ScooterCardProps> = ({
  id,
  pricePerHour,
  type,
  rating,
  reviewCount,
  location,
  status,

  // onEdit,
  // onDelete,
}) => {
  // Add state for dialogs
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // const handleUpdate = (
  //   scooterId: string,
  //   updatedScooter: { type: string; status: string; pricePerHour: number }
  // ) => {
  //   if (onEdit) {
  //     onEdit(scooterId, updatedScooter);
  //   }
  // };

  return (
    <>
      <div className="flex w-full items-center rounded-2xl bg-[#d6e6f2] p-4 shadow-sm transition-shadow hover:shadow-md">
        {/* Left half - Scooter info */}
        <div className="w-1/2">
          <ScooterInfo
            id={id}
            type={type}
            rating={rating}
            reviewCount={reviewCount}
            pricePerHour={pricePerHour}
            location={location}
            status={status}
          />
        </div>

        {/* Right half - Buttons */}
        <div className="w-1/2">
          <ScooterActions
            onViewDetails={() => setShowDetailsDialog(true)}
            onEdit={() => setShowEditDialog(true)}
            onDelete={() => setShowDeleteDialog(true)}
          />
        </div>
      </div>

      {/* Scooter Details Dialog */}
      <ScooterDetailsDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        id={id}
        type={type}
        pricePerHour={pricePerHour}
        rating={rating}
        reviewCount={reviewCount}
        location={location}
        status={status}
      />

      {/* Scooter Edit Dialog */}
      <ScooterEditDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        scooter={{ id, type, status, pricePerHour }}
        // onUpdate={handleUpdate}
      />

      {/* Scooter Delete Dialog */}
      <ScooterDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        scooter={{ id, type }}
      />
    </>
  );
};

export default ScooterCard;
