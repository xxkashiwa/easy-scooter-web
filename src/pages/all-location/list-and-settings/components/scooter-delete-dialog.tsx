import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { deleteScooter } from '@/services/scooter-service';
import React from 'react';
import { toast } from 'sonner';
import useScooterStore from '../../scooter-store';

interface ScooterDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scooter: {
    id: number;
    type: string;
  };
}

const ScooterDeleteDialog: React.FC<ScooterDeleteDialogProps> = ({
  open,
  onOpenChange,
  scooter,
}) => {
  const { fetchScooters, fetchPrice } = useScooterStore();

  const handleDelete = async () => {
    try {
      await deleteScooter(scooter.id);
      toast.success(`Scooter #${scooter.id} has been deleted successfully`);

      // Refresh the scooters list and prices after deletion
      await fetchScooters();
      await fetchPrice();

      // Close the dialog
      onOpenChange(false);
    } catch (error) {
      toast.error(`Failed to delete scooter: ${error}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">Delete Scooter</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete scooter #{scooter.id} (
            {scooter.type})? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScooterDeleteDialog;
