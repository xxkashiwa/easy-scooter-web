import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { putFault } from '@/services/fault-service';
import { Fault as FaultType } from '@/services/types';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface FaultPriorityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFault: FaultType | null;
  onSuccess: () => void;
}

const FaultPriorityDialog: React.FC<FaultPriorityDialogProps> = ({
  open,
  onOpenChange,
  selectedFault,
  onSuccess,
}) => {
  const [selectedPriority, setSelectedPriority] = useState<string>(
    selectedFault?.priority || 'medium'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update the selectedPriority when the selectedFault changes
  React.useEffect(() => {
    if (selectedFault) {
      setSelectedPriority(selectedFault.priority);
    }
  }, [selectedFault]);

  const handlePriorityChange = async () => {
    if (!selectedFault) return;

    try {
      setIsSubmitting(true);
      await putFault(selectedFault.id, selectedPriority);
      toast.success('Priority updated successfully');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(`Failed to update priority: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Fault Priority</DialogTitle>
          <DialogDescription>
            Change the priority level of this fault report
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
              <span className="text-right font-medium">Current Priority:</span>
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
              <span className="text-right font-medium">New Priority:</span>
              <div className="col-span-3">
                <Select
                  value={selectedPriority}
                  onValueChange={setSelectedPriority}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <span className="text-blue-500">Low</span>
                    </SelectItem>
                    <SelectItem value="medium">
                      <span className="text-yellow-500">Medium</span>
                    </SelectItem>
                    <SelectItem value="high">
                      <span className="text-red-500">High</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
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
            onClick={handlePriorityChange}
            disabled={
              isSubmitting ||
              !selectedFault ||
              selectedPriority === selectedFault.priority
            }
          >
            {isSubmitting ? 'Updating...' : 'Update Priority'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FaultPriorityDialog;
