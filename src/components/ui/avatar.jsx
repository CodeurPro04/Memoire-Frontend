// src/components/ui/avatar.jsx
import * as React from "react"

const Avatar = React.forwardRef(({ className, src, alt, fallback, ...props }, ref) => {
  return (
    <div 
      ref={ref}
      className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
      {...props}
    >
      {src && <img src={src} alt={alt} className="aspect-square h-full w-full" />}
      {fallback && (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
          {fallback}
        </div>
      )}
    </div>
  )
})
Avatar.displayName = "Avatar"

const AvatarImage = ({ className, ...props }) => (
  <img className={`aspect-square h-full w-full ${className}`} {...props} />
)

const AvatarFallback = ({ className, ...props }) => (
  <div 
    className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`} 
    {...props} 
  />
)

export { Avatar, AvatarImage, AvatarFallback }