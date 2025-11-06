"use client";

import React from "react";
import { useDialog } from "./dialog";

const DialogTrigger = React.forwardRef(({ 
  children, 
  asChild = false,
  ...props 
}, ref) => {
  const { onOpenChange } = useDialog();

  const handleClick = () => {
    if (onOpenChange) {
      onOpenChange(true);
    }
  };

  if (asChild) {
    return React.cloneElement(React.Children.only(children), {
      ref,
      onClick: handleClick,
      ...props,
    });
  }

  return (
    <button
      ref={ref}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
});

DialogTrigger.displayName = "DialogTrigger";

export default DialogTrigger;