export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US').format(number)
}

export const formatPercentage = (value) => {
  return `${value.toFixed(1)}%`
}

export const getStageColor = (stage) => {
  const colors = {
    'Connected': {
      bg: 'bg-blue-500',
      border: 'border-l-blue-500',
      variant: 'info'
    },
    'Locked': {
      bg: 'bg-yellow-500',
      border: 'border-l-yellow-500',
      variant: 'warning'
    },
    'Meeting Booked': {
      bg: 'bg-purple-500',
      border: 'border-l-purple-500',
      variant: 'primary'
    },
    'Meeting Done': {
      bg: 'bg-indigo-500',
      border: 'border-l-indigo-500',
      variant: 'primary'
    },
    'Negotiation': {
      bg: 'bg-orange-500',
      border: 'border-l-orange-500',
      variant: 'warning'
    },
    'Qualified': {
      bg: 'bg-teal-500',
      border: 'border-l-teal-500',
      variant: 'info'
    },
    'Closed': {
      bg: 'bg-green-500',
      border: 'border-l-green-500',
      variant: 'success'
    },
    'Lost': {
      bg: 'bg-red-500',
      border: 'border-l-red-500',
      variant: 'danger'
    }
  }
  
  return colors[stage] || colors['Connected']
}

export const formatDate = (date, options = {}) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  })
}

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatRelativeTime = (date) => {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now - past) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return formatDate(date)
}

export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}