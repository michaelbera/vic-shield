import type { PropsWithChildren } from 'react'

export default function Container({
  children,
  className,
  innerClassName,
}: { className?: string; innerClassName?: string } & PropsWithChildren) {
  return (
    <div className={`flex flex-col w-full items-center ${className}`}>
      <div className={`w-full max-w-screen-xl ${innerClassName}`}>
        {children}
      </div>
    </div>
  )
}
