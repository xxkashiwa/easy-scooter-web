import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Fault as FaultType } from '@/services/types';
import { formatDate } from '@/utils/date-formatter';
import React, { useMemo, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

interface FaultDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFault: FaultType | null;
}

const FaultDetailDialog: React.FC<FaultDetailDialogProps> = ({
  open,
  onOpenChange,
  selectedFault,
}) => {
  // State for controlling the lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Process the base64 image data if it exists
  const imageData = useMemo(() => {
    if (selectedFault?.image) {
      // Check if the image data already has a data URL prefix
      if (selectedFault.image.startsWith('data:image/')) {
        return selectedFault.image;
      }
      // Otherwise, add the prefix (assuming it's a JPEG, but it could be adjusted based on actual format)
      return `data:image/jpeg;base64,${selectedFault.image}`;
    }
    return null;
  }, [selectedFault]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Fault Detail</DialogTitle>
            <DialogDescription>
              View detailed information about this fault report
            </DialogDescription>
          </DialogHeader>

          {selectedFault && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-medium">ID:</span>
                <span className="col-span-3">{selectedFault.id}</span>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-medium">Type:</span>
                <span className="col-span-3">{selectedFault.type}</span>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-medium">Priority:</span>
                <span
                  className={`col-span-3 font-medium ${
                    selectedFault.priority === 'high'
                      ? 'text-red-500'
                      : selectedFault.priority === 'medium'
                        ? 'text-yellow-500'
                        : 'text-blue-500'
                  }`}
                >
                  {selectedFault.priority}
                </span>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-medium">Status:</span>
                <span
                  className={`col-span-3 font-medium ${
                    selectedFault.status === 'open'
                      ? 'text-red-500'
                      : selectedFault.status === 'in_progress'
                        ? 'text-yellow-500'
                        : 'text-green-500'
                  }`}
                >
                  {selectedFault.status}
                </span>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-medium">Created At:</span>
                <span className="col-span-3">
                  {formatDate(selectedFault.createdAt)}
                </span>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-medium">User:</span>
                <span className="col-span-3">
                  {selectedFault.userName || 'Unknown'}
                </span>
              </div>

              {selectedFault.scooterId && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-right font-medium">Scooter ID:</span>
                  <span className="col-span-3">{selectedFault.scooterId}</span>
                </div>
              )}

              {selectedFault.rentalId && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-right font-medium">Rental ID:</span>
                  <span className="col-span-3">{selectedFault.rentalId}</span>
                </div>
              )}

              {selectedFault.detail && (
                <div className="grid grid-cols-4 items-start gap-4">
                  <span className="inline-flex h-full items-center justify-end text-right font-medium">
                    Details:
                  </span>
                  <div className="col-span-3 rounded-md bg-gray-50 p-3">
                    {selectedFault.detail}
                  </div>
                </div>
              )}

              {/* Image section - displayed horizontally */}
              {imageData && (
                <div className="mt-4 flex flex-col gap-2 border-t border-gray-200 pt-4">
                  <span className="font-medium">Image:</span>
                  <div className="w-full overflow-hidden rounded-md">
                    <img
                      src={imageData}
                      alt="Fault report image"
                      className="mx-auto max-h-[350px] w-auto cursor-pointer object-contain hover:opacity-90"
                      onClick={() => setLightboxOpen(true)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image lightbox for zooming and fullscreen viewing */}
      {imageData && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={[{ src: imageData }]}
          plugins={[Zoom]}
          zoom={{
            maxZoomPixelRatio: 5,
            scrollToZoom: true,
          }}
        />
      )}
    </>
  );
};

export default FaultDetailDialog;
