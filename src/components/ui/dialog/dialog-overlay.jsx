"use client";

import React from "react";

const DialogOverlay = React.forwardRef(({ 
  className = "", 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 ${className}`}
      {...props}
    />
  );
});

DialogOverlay.displayName = "DialogOverlay";

export default DialogOverlay;