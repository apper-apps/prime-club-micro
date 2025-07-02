import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  
const variants = {
primary: "bg-gradient-to-r from-gold-500 to-teal-500 hover:from-gold-600 hover:to-teal-600 text-white shadow-soft hover:shadow-glow focus:ring-gold-500 font-semibold",
    secondary: "bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 shadow-soft hover:shadow-card focus:ring-gold-500 font-medium",
    outline: "border-2 border-gold-200 text-gold-600 hover:bg-gold-50 hover:border-gold-300 shadow-soft hover:shadow-card focus:ring-gold-500 font-medium",
    success: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-soft hover:shadow-glow focus:ring-green-500 font-semibold",
    warning: "bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white shadow-soft hover:shadow-glow focus:ring-gold-500 font-semibold",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-soft hover:shadow-glow focus:ring-red-500 font-semibold",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:ring-gray-500 font-medium rounded-xl"
  }
  
const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
    xl: "px-10 py-4 text-lg"
  }
  
  const disabledClasses = disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
  
  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" className="animate-spin -ml-1 mr-2 h-4 w-4" />
      )}
      {icon && iconPosition === 'left' && !loading && (
        <ApperIcon name={icon} className="-ml-1 mr-2 h-4 w-4" />
      )}
      {children}
      {icon && iconPosition === 'right' && !loading && (
        <ApperIcon name={icon} className="ml-2 -mr-1 h-4 w-4" />
      )}
    </motion.button>
  )
}

export default Button