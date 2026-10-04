import { useId, type ReactNode } from "react";
import { IconButton } from "../ui/IconButton";

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
      className="mx-auto mt-auto mb-0 max-h-5/6 w-full max-w-lg overflow-y-auto overscroll-contain rounded-t-xl border-0 bg-sf p-0 font-normal text-tx backdrop:bg-black/60"
      aria-labelledby={titleId}
      onClose={onClose}
      // The backdrop is the dialog element itself, outside its content.
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+--spacing(5))] text-base leading-snug">
        <div className="flex items-start justify-between gap-3">
          <h2 id={titleId} className="text-2xl leading-tight font-extrabold">{title}</h2>
          <IconButton aria-label="Close" onClick={onClose}>
            ×
          </IconButton>
        </div>
        {children}
      </div>
    </dialog>
  );
}
