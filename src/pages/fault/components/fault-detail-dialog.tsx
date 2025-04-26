import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Fault as FaultType } from '@/services/types';
import { formatDate } from '@/utils/date-formatter';
import React from 'react';

interface FaultDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFault: FaultType | null;
}

const FaultDetailDialog: React.FC<FaultDetailDialogProps> = ({
  open,
  onOpenChange,
  selectedFault,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Fault Detail</DialogTitle>
          <DialogDescription>
            View detailed information about this fault report
          </DialogDescription>
        </DialogHeader>

        {selectedFault && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-medium">ID:</span>
              <span className="col-span-3">{selectedFault.id}</span>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-medium">Type:</span>
              <span className="col-span-3">{selectedFault.type}</span>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-medium">Priority:</span>
              <span
                className={`col-span-3 font-medium ${
                  selectedFault.priority === 'high'
                    ? 'text-red-500'
                    : selectedFault.priority === 'medium'
                      ? 'text-yellow-500'
                      : 'text-blue-500'
                }`}
              >
                {selectedFault.priority}
              </span>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-medium">Status:</span>
              <span
                className={`col-span-3 font-medium ${
                  selectedFault.status === 'open'
                    ? 'text-red-500'
                    : selectedFault.status === 'in_progress'
                      ? 'text-yellow-500'
                      : 'text-green-500'
                }`}
              >
                {selectedFault.status}
              </span>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-medium">Created At:</span>
              <span className="col-span-3">
                {formatDate(selectedFault.createdAt)}
              </span>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-medium">User:</span>
              <span className="col-span-3">
                {selectedFault.userName || 'Unknown'}
              </span>
            </div>

            {selectedFault.scooterId && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-medium">Scooter ID:</span>
                <span className="col-span-3">{selectedFault.scooterId}</span>
              </div>
            )}

            {selectedFault.rentalId && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-medium">Rental ID:</span>
                <span className="col-span-3">{selectedFault.rentalId}</span>
              </div>
            )}

            {selectedFault.detail && (
              <div className="grid grid-cols-4 items-start gap-4">
                <span className="inline-flex h-full items-center justify-end text-right font-medium">
                  Details:
                </span>
                <div className="col-span-3 rounded-md bg-gray-50 p-3">
                  {selectedFault.detail}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FaultDetailDialog;
