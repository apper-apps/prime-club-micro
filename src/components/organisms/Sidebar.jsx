import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = ({ onClose }) => {
  const location = useLocation()
  
const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'Pipeline', href: '/pipeline', icon: 'GitBranch' },
    { name: 'Calendar', href: '/calendar', icon: 'Calendar' },
    { name: 'Deal Timeline', href: '/deal-timeline', icon: 'Calendar' },
    { name: 'Leaderboard', href: '/leaderboard', icon: 'Trophy' },
    { name: 'Leads', href: '/leads', icon: 'Users' },
  ]
return (
    <div className="flex flex-col w-70 bg-white border-r border-gray-200 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
<div className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-gradient-to-br from-primary-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-glow">
            <ApperIcon name="Crown" className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Prime Club</h1>
            <p className="text-gray-500 text-sm font-medium">CRM System</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="X" className="h-6 w-6" />
          </button>
        )}
      </div>
      
{/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || 
                          (item.href === '/dashboard' && location.pathname === '/')
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={({ isActive: linkActive }) => {
                const active = linkActive || isActive
                return `
flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${active 
                    ? 'bg-gradient-to-r from-primary-500 to-accent-600 text-white shadow-soft' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `
              }}
            >
              {({ isActive: linkActive }) => {
                const active = linkActive || isActive
                return (
                  <>
                    <ApperIcon 
                      name={item.icon} 
                      className={`mr-3 h-5 w-5 transition-colors ${
                        active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                      }`} 
                    />
                    <span className="font-medium">{item.name}</span>
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="ml-auto w-2 h-2 bg-white rounded-full shadow-sm"
                      />
                    )}
                  </>
                )
              }}
            </NavLink>
          )
        })}
      </nav>
      
{/* Footer */}
<div className="p-4 border-t border-gray-100">
        <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-4 border border-primary-100">
          <div className="flex items-center space-x-3">
<div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-soft">
              <ApperIcon name="Zap" className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-gray-900 text-sm font-semibold">Pro Features</p>
              <p className="text-gray-500 text-xs font-medium">Advanced Analytics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar