import React from 'react'
import Input from '@/components/atoms/Input'

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  className = '',
  ...props 
}) => {
  return (
    <Input
      type="search"
      icon="Search"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`max-w-md ${className}`}
      {...props}
    />
  )
}

export default SearchBar