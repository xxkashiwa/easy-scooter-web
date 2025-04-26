import { Button } from '@/components/ui/button';
import React from 'react';

interface ActionButtonsProps {
  isDisabled: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isDisabled,
  onCancel,
  onSubmit,
}) => {
  return (
    <div className="flex space-x-4 pt-4">
      <Button
        type="button"
        variant="outline"
        className="flex-1"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        className="flex-1 bg-blue-500 text-white hover:bg-blue-600"
        disabled={isDisabled}
        onClick={onSubmit}
      >
        Create Scooter
      </Button>
    </div>
  );
};

export default ActionButtons;
