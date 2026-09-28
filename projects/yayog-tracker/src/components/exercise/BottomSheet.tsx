import { useId, type ReactNode } from "react";

interface BottomSheetProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

// Modal <dialog> anchored to the bottom of the screen, shown as soon as it
// mounts — render it conditionally to open/close it. Calls onClose on ✕,
// Escape, or a tap on the backdrop.
export function BottomSheet({ title, onClose, children }: BottomSheetProps) {
  const titleId = useId();
  return (
    <dialog
      // The `open` attribute alone would give a non-modal dialog (no backdrop,
      // no Escape, page still interactive); showModal() is what makes it modal.
      ref={(el) => el?.showModal()}
      className="yg-sheet"
      aria-labelledby={titleId}
      onClose={onClose}
      // The backdrop is the dialog element itself, outside its content.
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="yg-sheet-body">
        <div className="yg-sheet-head">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="yg-x" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
