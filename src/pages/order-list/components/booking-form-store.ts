import { useEffect, useState } from 'react';

export interface BookingFormData {
  emailOrTel: string;
  scooterId: string;
  startTime: string;
  period: string;
  endTime: string;
}

export const useBookingFormStore = () => {
  const [formData, setFormData] = useState<BookingFormData>({
    emailOrTel: '',
    scooterId: '',
    startTime: '',
    period: '',
    endTime: '',
  });

  // Calculate end time when startTime or period changes
  useEffect(() => {
    if (formData.startTime && formData.period) {
      const startDate = new Date(formData.startTime);
      const endDate = new Date(startDate);

      // Calculate end date based on period
      switch (formData.period) {
        case '1hr':
          endDate.setHours(endDate.getHours() + 1);
          break;
        case '4hrs':
          endDate.setHours(endDate.getHours() + 4);
          break;
        case '1day':
          endDate.setDate(endDate.getDate() + 1);
          break;
        case '1week':
          endDate.setDate(endDate.getDate() + 7);
          break;
        default:
          break;
      }

      // Format the end date to match datetime-local input format
      const endTimeFormatted = endDate.toISOString().slice(0, 16);
      setFormData(prev => ({ ...prev, endTime: endTimeFormatted }));
    }
  }, [formData.startTime, formData.period]);

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      emailOrTel: '',
      scooterId: '',
      startTime: '',
      period: '',
      endTime: '',
    });
  };

  return {
    formData,
    handleInputChange,
    resetForm,
  };
};

export default useBookingFormStore;
