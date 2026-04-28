"use client"

import * as React from "react"
import { cn } from "@/src/lib/utils"

const AvatarContext = React.createContext<{ hasImage: boolean; setHasImage: (val: boolean) => void }>({
  hasImage: false,
  setHasImage: () => {},
})

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [hasImage, setHasImage] = React.useState(false)

  return (
    <AvatarContext.Provider value={{ hasImage, setHasImage }}>
      <div
        ref={ref}
        className={cn(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted",
          className
        )}
        {...props}
      />
    </AvatarContext.Provider>
  )
})
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, src, ...props }, ref) => {
  const { setHasImage } = React.useContext(AvatarContext)

  React.useEffect(() => {
    if (src) {
      setHasImage(true)
    } else {
      setHasImage(false)
    }
  }, [src, setHasImage])

  if (!src) return null

  return (
    <img
      ref={ref}
      src={src}
      className={cn("aspect-square h-full w-full object-cover", className)}
      onError={() => setHasImage(false)}
      {...props}
    />
  )
})
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { hasImage } = React.useContext(AvatarContext)

  if (hasImage) return null

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground",
        className
      )}
      {...props}
    />
  )
})
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }
