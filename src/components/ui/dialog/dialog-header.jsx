"use client";

import React from "react";

const DialogHeader = React.forwardRef(({ 
  className = "", 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}
      {...props}
    />
  );
});

DialogHeader.displayName = "DialogHeader";

export default DialogHeader;