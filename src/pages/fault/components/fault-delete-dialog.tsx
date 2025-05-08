import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { deleteFault } from '@/services/fault-service';
import { Fault as FaultType } from '@/services/types';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface FaultDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFault: FaultType | null;
  onSuccess: () => void;
}

const FaultDeleteDialog: React.FC<FaultDeleteDialogProps> = ({
  open,
  onOpenChange,
  selectedFault,
  onSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!selectedFault) return;

    try {
      setIsDeleting(true);
      await deleteFault(selectedFault.id);
      toast.success('Fault deleted successfully');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(`Failed to delete fault: ${error}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this fault report? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {selectedFault && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-medium">Fault ID:</span>
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

            {selectedFault.detail && (
              <div className="grid grid-cols-4 items-start gap-4">
                <span className="text-right font-medium">Details:</span>
                <div className="col-span-3 rounded-md bg-gray-50 p-2">
                  <p className="line-clamp-2 text-sm text-gray-700">
                    {selectedFault.detail}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting || !selectedFault}
            variant="destructive"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FaultDeleteDialog;
