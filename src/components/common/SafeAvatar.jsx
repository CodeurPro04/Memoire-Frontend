import React, { useEffect, useState } from "react";
import defaultAvatar from "@/assets/default-avatar.png";

export default function SafeAvatar({
  src,
  alt,
  size = 80,
  className = "",
  showInitials = true,
  initials = "",
}) {
  const [imgSrc, setImgSrc] = useState(src || defaultAvatar);
  const [triedFallback, setTriedFallback] = useState(false);

  useEffect(() => {
    setImgSrc(src || defaultAvatar);
    setTriedFallback(false);
  }, [src]);

  const handleError = () => {
    if (!triedFallback) {
      setImgSrc(defaultAvatar);
      setTriedFallback(true);
    } else {
      setImgSrc(null);
    }
  };

  return (
    <div
      className={`rounded-full border-2 border-blue-100 shadow-md overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={alt}
          className="w-full h-full object-cover"
          onError={handleError}
          crossOrigin="anonymous"
        />
      ) : showInitials ? (
        <div className="w-full h-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
          {initials}
        </div>
      ) : null}
    </div>
  );
}
