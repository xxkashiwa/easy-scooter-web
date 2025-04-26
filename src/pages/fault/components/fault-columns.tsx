import { Column } from '@/components/data-table';
import { Fault as FaultType } from '@/services/types';
import { formatDate } from '@/utils/date-formatter';

export const getFaultColumns = (): Column<FaultType>[] => [
  {
    header: 'ID',
    accessor: 'id',
    className: 'font-medium',
  },
  {
    header: 'Type',
    accessor: 'type',
  },
  {
    header: 'Priority',
    accessor: 'priority',
    render: item => (
      <span
        className={`font-medium ${
          item.priority === 'high'
            ? 'text-red-500'
            : item.priority === 'medium'
              ? 'text-yellow-500'
              : 'text-blue-500'
        }`}
      >
        {item.priority}
      </span>
    ),
  },
  {
    header: 'Status',
    accessor: 'status',
    render: item => (
      <span
        className={`font-medium ${
          item.status === 'resolved'
            ? 'text-green-500'
            : item.status === 'pending'
              ? 'text-yellow-500'
              : 'text-gray-500'
        }`}
      >
        {item.status}
      </span>
    ),
  },
  {
    header: 'Created At',
    accessor: 'createdAt',
    render: item => formatDate(item.createdAt),
  },
  {
    header: 'User',
    accessor: 'userName',
    render: item => item.userName || 'Unknown',
  },
];
