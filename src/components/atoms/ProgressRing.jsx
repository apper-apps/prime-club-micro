import React from 'react'

const ProgressRing = ({ 
  value, 
  max = 100, 
  size = 'md',
  color = 'primary',
  showLabel = true,
  label,
  className = ''
}) => {
  const sizes = {
    sm: { width: 40, stroke: 3, text: 'text-xs' },
    md: { width: 60, stroke: 4, text: 'text-sm' },
    lg: { width: 80, stroke: 5, text: 'text-base' },
    xl: { width: 100, stroke: 6, text: 'text-lg' }
  }
  
  const colors = {
    primary: 'stroke-primary-600',
    success: 'stroke-green-500',
    warning: 'stroke-gold-500',
    danger: 'stroke-red-500'
  }
  
  const { width, stroke, text } = sizes[size]
  const radius = (width - stroke * 2) / 2
  const circumference = radius * 2 * Math.PI
  const percentage = Math.min((value / max) * 100, 100)
  const offset = circumference - (percentage / 100) * circumference
  
  return (
    <div className={`relative ${className}`}>
      <svg width={width} height={width} className="transform -rotate-90">
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${colors[color]} transition-all duration-500 ease-in-out`}
          strokeLinecap="round"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-semibold ${text}`}>
            {label || `${Math.round(percentage)}%`}
          </span>
        </div>
      )}
    </div>
  )
}

export default ProgressRing