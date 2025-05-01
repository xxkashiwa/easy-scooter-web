/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect } from 'react';
import { toast } from 'sonner';
import rentalStore from '../../stores/rental-store';
import useBookingFormStore from './components/booking-form-store';
import ManualBookingForm from './components/manual-booking-form';
import OrderTable from './components/order-table';

const OrderList: React.FC = () => {
  const { rentals, fetchRentals, createRental, deleteRental } = rentalStore();
  const { formData, handleInputChange, resetForm } = useBookingFormStore();

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  const handleEdit = (id: number) => {
    // Implement edit functionality
    console.log('Editing rental', id);
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
    </div>
  );
};

export default OrderList;
