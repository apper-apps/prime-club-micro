import React, { useState } from 'react'

const Avatar = ({ 
  src, 
  alt, 
  name, 
  size = 'md',
  className = '',
  ...props 
}) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(!!src)
  const sizes = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
    '2xl': 'h-20 w-20 text-2xl'
  }
  
  const getInitials = (name) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  
  const generateColor = (name) => {
    if (!name) return 'bg-gray-500'
const colors = [
      'bg-teal-500', 'bg-sage-500', 'bg-gold-500', 'bg-cream-500',
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-gray-500'
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }
  
const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  return (
    <div
      className={`
        inline-flex items-center justify-center rounded-full
        ${sizes[size]} ${className}
      `}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="h-full w-full rounded-full object-cover"
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
        />
      ) : (
        <div className={`
          h-full w-full rounded-full flex items-center justify-center
          text-white font-medium ${generateColor(name)}
        `}>
          {getInitials(name)}
        </div>
      )}
    </div>
  )
}

export default Avatar