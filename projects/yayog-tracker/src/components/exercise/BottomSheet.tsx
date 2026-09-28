import { useEffect, useRef, type ReactNode } from "react";

interface BottomSheetProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

// Modal <dialog> anchored to the bottom of the screen. Closes on ✕, Escape,
// or a tap on the backdrop.
export function BottomSheet({ open, title, onClose, children }: BottomSheetProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="yg-sheet"
      onClose={onClose}
      // The backdrop is the dialog element itself, outside its content.
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="yg-sheet-body">
        <div className="yg-sheet-head">
          <h2>{title}</h2>
          <button type="button" className="yg-x" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
