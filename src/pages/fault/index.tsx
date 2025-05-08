import DataTable from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { resolveFault } from '@/services/fault-service';
import { Fault as FaultType } from '@/services/types';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { getFaultColumns } from './components/fault-columns';
import FaultDeleteDialog from './components/fault-delete-dialog';
import FaultDetailDialog from './components/fault-detail-dialog';
import FaultPriorityDialog from './components/fault-priority-dialog';
import useFaultStore from './fault-store';

const Fault: React.FC = () => {
  const { faults, fetchFaults } = useFaultStore();
  const [selectedFaultIndex, setSelectedFaultIndex] = useState<number | null>(
    null
  );
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [priorityDialogOpen, setPriorityDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Split faults by priority
  const { highPriorityFaults, normalFaults } = useMemo(() => {
    const high = faults.filter(fault => fault.priority === 'high');
    const normal = faults.filter(fault => fault.priority !== 'high');
    return { highPriorityFaults: high, normalFaults: normal };
  }, [faults]);

  useEffect(() => {
    fetchFaults().catch(error => {
      console.error('Failed to fetch faults:', error);
    });
  }, [fetchFaults]);

  const handleViewDetail = (index: number, isHighPriority = false) => {
    // Calculate the actual index in the original faults array
    const actualIndex = isHighPriority
      ? faults.findIndex(f => f.id === highPriorityFaults[index].id)
      : faults.findIndex(f => f.id === normalFaults[index].id);

    setSelectedFaultIndex(actualIndex);
    setDetailDialogOpen(true);
  };

  const handleChangePriority = (index: number, isHighPriority = false) => {
    // Calculate the actual index in the original faults array
    const actualIndex = isHighPriority
      ? faults.findIndex(f => f.id === highPriorityFaults[index].id)
      : faults.findIndex(f => f.id === normalFaults[index].id);

    setSelectedFaultIndex(actualIndex);
    setPriorityDialogOpen(true);
  };

  const handleDeleteConfirmation = (index: number, isHighPriority = false) => {
    // Calculate the actual index in the original faults array
    const actualIndex = isHighPriority
      ? faults.findIndex(f => f.id === highPriorityFaults[index].id)
      : faults.findIndex(f => f.id === normalFaults[index].id);

    setSelectedFaultIndex(actualIndex);
    setDeleteDialogOpen(true);
  };

  const handleResolve = async (fault: FaultType) => {
    try {
      await resolveFault(fault.id);
      toast.success('Resolved fault successfully');
      fetchFaults();
    } catch (e) {
      toast.error(`Failed to resolve fault.${e} `);
    }
  };

  const columns = getFaultColumns();
  const selectedFault =
    selectedFaultIndex !== null ? faults[selectedFaultIndex] : null;

  return (
    <div className="container mx-auto space-y-8 p-4">
      {/* High Priority Faults Table */}
      {highPriorityFaults.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h2 className="mb-4 text-lg font-bold text-red-700">
            High Priority Faults ({highPriorityFaults.length})
          </h2>
          <DataTable
            data={highPriorityFaults}
            columns={columns}
            emptyState={<div></div>}
            actions={(fault, index) => (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetail(index, true)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Detail
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleChangePriority(index, true)}
                  className="text-purple-500 hover:text-purple-700"
                >
                  Priority
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleResolve(fault)}
                  className="text-green-500 hover:text-green-700"
                >
                  Resolve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteConfirmation(index, true)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </Button>
              </div>
            )}
          />
        </div>
      )}

      {/* Normal Faults Table */}
      <DataTable
        data={normalFaults}
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
              onClick={() => handleChangePriority(index)}
              className="text-purple-500 hover:text-purple-700"
            >
              Priority
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleResolve(fault)}
              className="text-green-500 hover:text-green-700"
            >
              Resolve
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeleteConfirmation(index)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
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

      {/* Fault Priority Dialog */}
      <FaultPriorityDialog
        open={priorityDialogOpen}
        onOpenChange={setPriorityDialogOpen}
        selectedFault={selectedFault}
        onSuccess={fetchFaults}
      />

      {/* Fault Delete Dialog */}
      <FaultDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        selectedFault={selectedFault}
        onSuccess={fetchFaults}
      />
    </div>
  );
};

export default Fault;
