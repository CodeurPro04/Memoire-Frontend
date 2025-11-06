"use client";

import React from "react";

const DialogDescription = React.forwardRef(({ 
  className = "", 
  ...props 
}, ref) => {
  return (
    <p
      ref={ref}
      className={`text-sm text-slate-600 ${className}`}
      {...props}
    />
  );
});

DialogDescription.displayName = "DialogDescription";

export default DialogDescription;