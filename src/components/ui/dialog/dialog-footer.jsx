"use client";

import React from "react";

const DialogFooter = React.forwardRef(({ 
  className = "", 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}
      {...props}
    />
  );
});

DialogFooter.displayName = "DialogFooter";

export default DialogFooter;