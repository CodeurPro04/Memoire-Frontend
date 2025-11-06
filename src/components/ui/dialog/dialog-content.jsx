"use client";

import React from "react";
import { useDialog } from "./dialog";
import DialogOverlay from "./dialog-overlay";

const DialogContent = React.forwardRef(({ 
  children, 
  className = "",
  onInteractOutside,
  ...props 
}, ref) => {
  const { open, onOpenChange } = useDialog();

  React.useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && onOpenChange) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onOpenChange]);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      if (onInteractOutside) {
        onInteractOutside(event);
      } else if (onOpenChange) {
        onOpenChange(false);
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <DialogOverlay onClick={handleOverlayClick} />
      <div
        ref={ref}
        className={`fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-2xl md:w-full ${className}`}
        {...props}
      >
        {children}
      </div>
    </div>
  );
});

DialogContent.displayName = "DialogContent";

export default DialogContent;