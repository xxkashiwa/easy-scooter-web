import HeaderWithDot from '@/components/header-with-dot';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React from 'react';
import { BookingFormData } from './booking-form-store';

interface ManualBookingFormProps {
  formData: BookingFormData;
  onChange: (field: keyof BookingFormData, value: string) => void;
  onSubmit: () => void;
}

const ManualBookingForm: React.FC<ManualBookingFormProps> = ({
  formData,
  onChange,
  onSubmit,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="rounded-xl bg-white p-4 shadow-md">
      <HeaderWithDot className="mb-4">Manual Booking</HeaderWithDot>
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
        <div>
          <label className="mb-1 block">Email/Tel</label>
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 p-2"
            value={formData.emailOrTel}
            onChange={e => onChange('emailOrTel', e.target.value)}
            placeholder="Email or phone number"
          />
        </div>
        <div>
          <label className="mb-1 block">Scooter ID</label>
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 p-2"
            value={formData.scooterId}
            onChange={e => onChange('scooterId', e.target.value)}
            placeholder="Scooter ID"
          />
        </div>
        <div>
          <label className="mb-1 block">Start Time</label>
          <input
            type="datetime-local"
            className="w-full rounded-md border border-gray-300 p-2"
            value={formData.startTime}
            onChange={e => onChange('startTime', e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block">Period</label>
          <Select
            value={formData.period}
            onValueChange={value => onChange('period', value)}
          >
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
        <div>
          <label className="mb-1 block">End Time</label>
          <input
            type="datetime-local"
            className="w-full rounded-md border border-gray-300 bg-gray-100 p-2"
            value={formData.endTime}
            readOnly
            disabled
          />
        </div>

        <div className="col-span-3 flex justify-end">
          <Button type="submit" className="bg-blue-600 px-8">
            Add Order
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ManualBookingForm;
