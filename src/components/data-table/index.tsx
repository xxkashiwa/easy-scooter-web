/* eslint-disable @typescript-eslint/no-explicit-any */
import HeaderWithDot from '@/components/header-with-dot';
import { ReactNode } from 'react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
  render?: (item: T) => ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  actions?: (item: T, index: number) => ReactNode;
  className?: string;
  tableClassName?: string;
  headerClassName?: string;
  rowClassName?: (item: T, index: number) => string | undefined;
  emptyState?: ReactNode;
}

function DataTable<T>({
  data,
  columns,
  title,
  actions,
  className = 'flex h-[calc(66vh)] flex-col rounded-xl bg-white p-4 shadow-md',
  tableClassName = 'w-full border-collapse',
  headerClassName = 'border-b bg-gray-50',
  rowClassName,
  emptyState = (
    <div className="p-4 text-center text-gray-500">No data available</div>
  ),
}: DataTableProps<T>) {
  return (
    <div className={className}>
      {title && <HeaderWithDot className="mb-4">{title}</HeaderWithDot>}
      <div className="flex-1 overflow-auto">
        <table className={tableClassName}>
          <thead className="sticky top-0 bg-white">
            <tr className={headerClassName}>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-4 py-2 text-left ${column.className || ''}`}
                >
                  {column.header}
                </th>
              ))}
              {actions && <th className="px-4 py-2 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)}>
                  {emptyState}
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`border-b hover:bg-gray-50 ${
                    rowClassName ? rowClassName(item, rowIndex) : ''
                  }`}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-4 py-2 ${column.className || ''}`}
                    >
                      {column.render
                        ? column.render(item)
                        : typeof column.accessor === 'function'
                          ? column.accessor(item)
                          : String((item as any)[column.accessor] ?? '')}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-2 text-center">
                      {actions(item, rowIndex)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
