import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { putScooter, putScooterAndPrice } from '@/services/scooter-service';
import React, { useEffect, useState } from 'react';
import useScooterStore from '../../scooter-store';

interface ScooterEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scooter: {
    id: number;
    type: string;
    status: string;
    pricePerHour: number;
  };
  //   onUpdate: (
  //     id: string,
  //     updatedScooter: { type: string; status: string; pricePerHour: number }
  //   ) => void;
}

const ScooterEditDialog: React.FC<ScooterEditDialogProps> = ({
  open,
  onOpenChange,
  scooter,
  //   onUpdate,
}) => {
  const [type, setType] = useState(scooter.type);
  const [status, setStatus] = useState(scooter.status);
  const [pricePerHour, setPricePerHour] = useState(scooter.pricePerHour);
  const { fetchPrice, scooterAndPrice } = useScooterStore();

  // Update form state when scooter prop changes
  useEffect(() => {
    setType(scooter.type);
    setStatus(scooter.status);
    setPricePerHour(scooter.pricePerHour);
  }, [scooter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // onUpdate(scooter.id, {
    //   type,
    //   status,
    //   pricePerHour: Number(pricePerHour),
    // });
    console.log('Updated scooter:', {
      id: scooter.id,
      type,
      status,
      pricePerHour: pricePerHour,
    });

    await putScooter(scooter.id, type, status, undefined, undefined);
    await putScooterAndPrice(
      scooterAndPrice.find(item => item.type === scooter.type)!.id,
      type,
      pricePerHour
    );
    await fetchPrice();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Scooter</DialogTitle>
          <DialogDescription>
            Update scooter information for ID: {scooter.id}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="type" className="text-right font-medium">
                Type
              </label>
              <Input
                id="type"
                className="col-span-3"
                value={type}
                onChange={e => setType(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="status" className="text-right font-medium">
                Status
              </label>
              <select
                id="status"
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring col-span-3 flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <option value="available">Available</option>
                <option value="in_use">In Use</option>
                <option value="maintenance">Maintenance</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="price" className="text-right font-medium">
                Price/Hour (¥)
              </label>
              <Input
                id="price"
                type="number"
                className="col-span-3"
                value={pricePerHour}
                onChange={e => setPricePerHour(Number(e.target.value))}
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Update Scooter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScooterEditDialog;
