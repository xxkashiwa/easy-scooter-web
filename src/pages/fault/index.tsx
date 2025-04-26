import DataTable from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { resolveFault } from '@/services/fault-service';
import { Fault as FaultType } from '@/services/types';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getFaultColumns } from './components/fault-columns';
import FaultDetailDialog from './components/fault-detail-dialog';
import useFaultStore from './fault-store';

const Fault: React.FC = () => {
  const { faults, fetchFaults } = useFaultStore();
  const [selectedFaultIndex, setSelectedFaultIndex] = useState<number | null>(
    null
  );
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  useEffect(() => {
    fetchFaults().catch(error => {
      console.error('Failed to fetch faults:', error);
    });
  }, [fetchFaults]);

  const handleViewDetail = (index: number) => {
    setSelectedFaultIndex(index);
    setDetailDialogOpen(true);
  };

  const handleDelete = async (fault: FaultType) => {
    try {
      await resolveFault(fault.id);
      toast.success('resolved fault successfully');
      fetchFaults();
    } catch (e) {
      toast.error(`Failed to resolve fault.${e} `);
    }
  };

  const columns = getFaultColumns();
  const selectedFault =
    selectedFaultIndex !== null ? faults[selectedFaultIndex] : null;

  return (
    <div className="container mx-auto p-4">
      <DataTable
        data={faults}
        columns={columns}
        title="Scooter Faults"
        emptyState={
          <div className="p-4 text-center text-gray-500">No faults found</div>
        }
        actions={(fault, index) => (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewDetail(index)}
              className="text-blue-500 hover:text-blue-700"
            >
              Detail
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(fault)}
              className="text-red-500 hover:text-red-700"
            >
              Resolve
            </Button>
          </div>
        )}
      />

      {/* Fault Detail Dialog */}
      <FaultDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        selectedFault={selectedFault}
      />
    </div>
  );
};

export default Fault;
