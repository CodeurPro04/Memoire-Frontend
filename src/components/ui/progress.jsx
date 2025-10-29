import React from "react";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef(({ 
  className, 
  value = 0, 
  max = 100,
  showValue = false,
  size = "default",
  variant = "default",
  ...props 
}, ref) => {
  const percentage = Math.min(Math.max(value, 0), max);
  
  const sizeClasses = {
    sm: "h-1",
    default: "h-2",
    lg: "h-3"
  };

  const variantClasses = {
    default: "bg-slate-200",
    primary: "bg-blue-100",
    success: "bg-green-100",
    warning: "bg-amber-100",
    destructive: "bg-red-100"
  };

  const variantFillClasses = {
    default: "bg-slate-900",
    primary: "bg-blue-600",
    success: "bg-green-600",
    warning: "bg-amber-600",
    destructive: "bg-red-600"
  };

  return (
    <div className="w-full">
      <div
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden rounded-full",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full w-full flex-1 transition-all duration-500 ease-out",
            variantFillClasses[variant]
          )}
          style={{
            transform: `translateX(-${100 - (percentage / max) * 100}%)`,
          }}
        />
      </div>
      {showValue && (
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-slate-600">Progression</span>
          <span className="text-xs font-medium text-slate-900">
            {percentage}%
          </span>
        </div>
      )}
    </div>
  );
});

Progress.displayName = "Progress";

export { Progress };