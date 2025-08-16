import * as React from "react";

interface SelectProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function Select({ children, value, onValueChange }: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onValueChange?.(value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === SelectTrigger) {
            return React.cloneElement(child, { 
              onClick: () => setIsOpen(!isOpen),
              children: selectedValue || child.props.children
            } as any);
          }
          if (child.type === SelectContent && isOpen) {
            return React.cloneElement(child, {
              onSelect: handleSelect
            } as any);
          }
        }
        return null;
      })}
    </div>
  );
}

export function SelectTrigger({ children, className }: SelectTriggerProps) {
  return (
    <button
      className={`flex items-center justify-between w-full px-3 py-2 border rounded-md ${className}`}
    >
      {children}
      <span>▼</span>
    </button>
  );
}

export function SelectContent({ children, className }: SelectContentProps) {
  return (
    <div className={`absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg ${className}`}>
      {children}
    </div>
  );
}

export function SelectItem({ value, children, className }: SelectItemProps) {
  return (
    <div
      className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${className}`}
    >
      {children}
    </div>
  );
}

export function SelectValue({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}