/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import rentalStore from '../../stores/rental-store';
import useBookingFormStore from './components/booking-form-store';
import EditOrderDialog from './components/edit-order-dialog';
import ManualBookingForm from './components/manual-booking-form';
import OrderTable from './components/order-table';

const OrderList: React.FC = () => {
  const { rentals, fetchRentals, createRental, updateRental, deleteRental } =
    rentalStore();
  const { formData, handleInputChange, resetForm } = useBookingFormStore();
  const [selectedRental, setSelectedRental] = useState<number | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  const handleEdit = (id: number) => {
    setSelectedRental(id);
    setEditDialogOpen(true);
  };
  const handleDelete = (id: number) => {
    try {
      deleteRental(id);
      toast.success('Rental deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete rental. Please try again.');
    }
  };

  const handleAddOrder = async () => {
    if (
      !formData.emailOrTel ||
      !formData.scooterId ||
      !formData.startTime ||
      !formData.period
    )
      return;
    // Reset form after submission
    try {
      await createRental(
        Number(formData.scooterId),
        formData.startTime,
        formData.period as '1hr' | '4hrs' | '1day' | '1week'
      );
      toast.success('Rental created successfully!');
      resetForm();
    } catch (error) {
      toast.error(`Failed to create rental. ${error}`);
    }
  };

  const handleUpdateOrder = async (
    id: number,
    startTime: string,
    period: string
  ) => {
    try {
      await updateRental(
        id,
        startTime,
        period as '1hr' | '4hrs' | '1day' | '1week'
      );
      toast.success('Rental updated successfully!');
      return Promise.resolve();
    } catch (error) {
      toast.error(`Failed to update rental. ${error}`);
      return Promise.reject(error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <OrderTable
        rentals={rentals}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <ManualBookingForm
        formData={formData}
        onChange={handleInputChange}
        onSubmit={handleAddOrder}
      />

      <EditOrderDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        rental={rentals.find(rental => rental.id === selectedRental) || null}
        onUpdate={handleUpdateOrder}
      />
    </div>
  );
};

export default OrderList;
