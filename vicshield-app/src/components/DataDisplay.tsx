import clsx from 'clsx'
import React from 'react'

export default function DataDisplay({
  data = {},
  title,
  className,
}: {
  data?: Record<string, any>
  title?: string
  className?: string
}) {
  return (
    <div tabIndex={0} className={clsx('rounded-xl', className)}>
      {!!title && <h2 className="card-title">{title}</h2>}
      <div className="flex flex-col">
        {Object.keys(data).map((key) => {
          if (data[key] === undefined || data[key] === null) return null
          const isComponent = React.isValidElement(data[key])
          return (
            <div
              className="flex items-center border-b-base-content/20 justify-between gap-2 border-b border-dashed py-2"
              key={key}
            >
              <label className="flex cursor-pointer items-center gap-2 select-none label">
                <span>{key}</span>
              </label>
              {isComponent ? (
                data[key]
              ) : (
                <span
                  className={clsx(
                    'badge badge-soft badge-xs font-mono',
                    typeof data[key] === 'number' ||
                      typeof data[key] === 'bigint'
                      ? 'badge-warning'
                      : '',
                  )}
                >
                  {data[key]}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
