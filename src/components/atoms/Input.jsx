import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  icon,
  disabled = false,
  required = false,
  className = '',
  ...props 
}) => {
  return (
    <div className={`${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
className={`
            block w-full rounded-xl border-2 transition-all duration-200 font-medium
            ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3
${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-200 focus:border-gold-500 focus:ring-gold-500'
            }
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            placeholder-gray-400 text-gray-900
            shadow-soft hover:shadow-card focus:shadow-glow
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <ApperIcon name="AlertCircle" className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  )
}

export default Input