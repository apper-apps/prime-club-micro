import React from 'react'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const variants = {
default: "bg-gray-100 text-gray-800",
primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800",
    success: "bg-gradient-to-r from-success-100 to-success-200 text-success-800",
    warning: "bg-gradient-to-r from-gold-100 to-gold-200 text-gold-800",
    danger: "bg-gradient-to-r from-coral-100 to-coral-200 text-coral-800",
    info: "bg-gradient-to-r from-accent-100 to-accent-200 text-accent-800",
    hunter: "bg-gradient-to-r from-primary-400 to-accent-600 text-white shadow-lg hunter-badge"
  }
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1.5 text-sm",
    lg: "px-3 py-2 text-base"
  }
  
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge