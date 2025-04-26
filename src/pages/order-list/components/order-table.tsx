/* eslint-disable @typescript-eslint/no-explicit-any */
import DataTable, { Column } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Rental } from '@/services/types';
import { formatDateTime } from '@/utils/date-formatter';
import React from 'react';

interface OrderTableProps {
  rentals: Rental[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({
  rentals,
  onEdit,
  onDelete,
}) => {
  // Define columns for the data table
  const columns: Column<any>[] = [
    { header: 'ID', accessor: 'id' },
    {
      header: 'Time',
      accessor: 'startTime',
      render: (rental: Rental) => formatDateTime(rental.startTime),
    },
    { header: 'User', accessor: 'userId' },
    { header: 'Scooter ID', accessor: 'scooterId' },
    { header: 'Scooter Type', accessor: () => 'Standard' },
    { header: 'Period', accessor: 'period' },
    {
      header: 'Cost',
      accessor: 'cost',
      render: (rental: Rental) => `£${rental.cost.toFixed(2)}`,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (rental: Rental) => (
        <span
          className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
            rental.status === 'active'
              ? 'bg-green-100 text-green-800'
              : rental.status === 'completed'
                ? 'bg-blue-100 text-blue-800'
                : rental.status === 'paid'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-red-100 text-red-800'
          }`}
        >
          {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
        </span>
      ),
    },
  ];

  // Define action buttons for each row
  const renderActions = (rental: Rental) => (
    <div className="flex justify-center gap-2">
      <Button
        onClick={() => onEdit(rental.id)}
        size="sm"
        variant="secondary"
        className="px-2 select-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      </Button>
      <Button
        onClick={() => onDelete(rental.id)}
        size="sm"
        variant="destructive"
        className="px-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18"></path>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </Button>
    </div>
  );

  return (
    <DataTable
      data={rentals}
      columns={columns}
      title="Order List"
      actions={renderActions}
    />
  );
};

export default OrderTable;
