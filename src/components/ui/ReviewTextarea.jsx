// src/components/ui/ReviewTextarea.jsx
import React from 'react';

export const ReviewTextarea = ({ value, onChange, className = '', maxLength, ...props }) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      className={className}
      maxLength={maxLength}
      {...props}
    />
  );
};

ReviewTextarea.displayName = 'ReviewTextarea';

export default ReviewTextarea;