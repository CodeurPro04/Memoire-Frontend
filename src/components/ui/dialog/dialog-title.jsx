"use client";

import React from "react";

const DialogTitle = React.forwardRef(({ 
  className = "", 
  ...props 
}, ref) => {
  return (
    <h2
      ref={ref}
      className={`text-lg font-semibold leading-none tracking-tight text-slate-900 ${className}`}
      {...props}
    />
  );
});

DialogTitle.displayName = "DialogTitle";

export default DialogTitle;