import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuClick }) => {
return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-5 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            icon="Menu"
            onClick={onMenuClick}
            className="lg:hidden"
          />
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-coral-600 bg-clip-text text-transparent">
              Welcome back, Sarah
            </h2>
            <p className="text-gray-600 font-medium">Here's what's happening with your sales today</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <Button variant="ghost" size="sm" icon="Bell" className="relative">
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-coral-500 to-primary-600 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-soft">
                3
              </span>
            </Button>
          </motion.div>
          
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-gray-900">Sarah Johnson</p>
              <p className="text-xs text-gray-500 font-medium">Sales Manager</p>
            </div>
<Avatar name="Sarah Johnson" size="lg" className="ring-2 ring-gold-100" />
            <ApperIcon name="ChevronDown" className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header