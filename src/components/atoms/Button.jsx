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
primary: "bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white shadow-soft hover:shadow-glow focus:ring-primary-500 font-semibold",
    secondary: "bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 shadow-soft hover:shadow-card focus:ring-primary-500 font-medium",
    outline: "border-2 border-primary-200 text-primary-600 hover:bg-primary-50 hover:border-primary-300 shadow-soft hover:shadow-card focus:ring-primary-500 font-medium",
    success: "bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white shadow-soft hover:shadow-glow focus:ring-success-500 font-semibold",
    warning: "bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white shadow-soft hover:shadow-glow focus:ring-gold-500 font-semibold",
    danger: "bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white shadow-soft hover:shadow-glow focus:ring-coral-500 font-semibold",
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