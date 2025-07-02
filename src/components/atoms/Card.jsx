import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  hover = false, 
  padding = 'lg',
  className = '',
  onClick,
  ...props 
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  }
  
const baseClasses = `
    bg-white rounded-2xl shadow-soft border border-gray-100
    ${hover ? 'cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:border-gray-200' : ''}
    ${paddings[padding]}
    ${className}
  `
  
  if (hover) {
    return (
<motion.div
        whileHover={{ 
          y: -2,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
        className={baseClasses}
        onClick={onClick}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
  
  return (
    <div className={baseClasses} onClick={onClick} {...props}>
      {children}
    </div>
  )
}

export default Card