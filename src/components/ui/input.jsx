
import React from "react";

export const Input = React.forwardRef(({ 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  required,
  name,
  className = "",
  ...props 
}, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      name={name}
      className={`w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 focus:outline-none transition-colors ${className}`}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;