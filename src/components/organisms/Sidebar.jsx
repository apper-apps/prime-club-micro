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
    { name: 'Deal Timeline', href: '/deal-timeline', icon: 'Timeline' },
    { name: 'Leaderboard', href: '/leaderboard', icon: 'Trophy' },
    { name: 'Leads', href: '/leads', icon: 'Users' },
  ]
  
  return (
    <div className="flex flex-col w-70 bg-gradient-to-b from-primary-900 to-primary-800 shadow-premium">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-primary-700">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
            <ApperIcon name="Crown" className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Prime Club</h1>
            <p className="text-primary-200 text-sm">CRM System</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-primary-200 hover:text-white p-2"
          >
            <ApperIcon name="X" className="h-6 w-6" />
          </button>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
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
                  flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${active 
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg' 
                    : 'text-primary-200 hover:text-white hover:bg-primary-700/50'
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
                      className={`mr-3 h-5 w-5 ${active ? 'text-white' : 'text-primary-300'}`} 
                    />
                    {item.name}
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="ml-auto w-2 h-2 bg-gold-400 rounded-full"
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
      <div className="p-4 border-t border-primary-700">
        <div className="bg-primary-800/50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">Pro Features</p>
              <p className="text-primary-200 text-xs">Advanced Analytics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar