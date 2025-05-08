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
import { Rental } from '@/services/types';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface EditOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rental: Rental | null;
  onUpdate: (id: number, startTime: string, period: string) => Promise<void>;
}

const EditOrderDialog: React.FC<EditOrderDialogProps> = ({
  open,
  onOpenChange,
  rental,
  onUpdate,
}) => {
  const [startTime, setStartTime] = useState<string>('');
  const [period, setPeriod] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (rental) {
      // Format the date for datetime-local input
      const formattedStartTime = rental.startTime.slice(0, 16); // Format as YYYY-MM-DDThh:mm
      setStartTime(formattedStartTime);
      setPeriod(rental.period);
    }
  }, [rental]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rental) return;

    try {
      setIsSubmitting(true);
      await onUpdate(rental.id, startTime, period);
      toast.success('Order updated successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error(`Failed to update order: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Order</DialogTitle>
          <DialogDescription>
            Update start time and period for order #{rental?.id}
          </DialogDescription>
        </DialogHeader>

        {rental && (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="startTime" className="text-right font-medium">
                  Start Time
                </label>
                <input
                  id="startTime"
                  type="datetime-local"
                  className="col-span-3 w-full rounded-md border border-gray-300 p-2"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="period" className="text-right font-medium">
                  Period
                </label>
                <div className="col-span-3">
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1hr">1hr</SelectItem>
                      <SelectItem value="4hrs">4hrs</SelectItem>
                      <SelectItem value="1day">1day</SelectItem>
                      <SelectItem value="1week">1week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Order'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditOrderDialog;
