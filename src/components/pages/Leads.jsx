import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Avatar from '@/components/atoms/Avatar'
import SearchBar from '@/components/molecules/SearchBar'
import FilterDropdown from '@/components/molecules/FilterDropdown'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { leadService } from '@/services/api'
import { formatCurrency, getStageColor } from '@/utils/formatters'

const Leads = () => {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [stageFilter, setStageFilter] = useState('all')
  const [repFilter, setRepFilter] = useState('all')
  const [selectedLeads, setSelectedLeads] = useState([])

  const stages = [
    'Connected', 'Locked', 'Meeting Booked', 'Meeting Done',
    'Negotiation', 'Qualified', 'Closed', 'Lost'
  ]

  const loadLeads = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await leadService.getAll()
      setLeads(data)
    } catch (err) {
      setError('Failed to load leads')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeads()
  }, [])

  // Filter leads based on search and filters
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStage = stageFilter === 'all' || lead.stage === stageFilter
    const matchesRep = repFilter === 'all' || lead.assignedTo === repFilter
    
    return matchesSearch && matchesStage && matchesRep
  })

  const salesReps = [...new Set(leads.map(lead => lead.assignedTo))].filter(Boolean)

  const stageFilterOptions = [
    { value: 'all', label: 'All Stages' },
    ...stages.map(stage => ({ value: stage, label: stage }))
  ]

  const repFilterOptions = [
    { value: 'all', label: 'All Reps' },
    ...salesReps.map(rep => ({ value: rep, label: rep }))
  ]

  const handleLeadSelect = (leadId) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    )
  }

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([])
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.Id))
    }
  }

  const handleBulkAction = async (action) => {
    if (selectedLeads.length === 0) return

    try {
      // Simulate bulk action
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success(`${action} applied to ${selectedLeads.length} leads`)
      setSelectedLeads([])
    } catch (err) {
      toast.error(`Failed to ${action.toLowerCase()} leads`)
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadLeads} />

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Leads Management
          </h1>
          <p className="text-gray-600 mt-1">
            {filteredLeads.length} of {leads.length} leads
          </p>
        </div>
        <Button icon="Plus">
          Add Lead
        </Button>
      </div>

      {/* Filters and Search */}
      <Card padding="lg">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search leads by name, company, or email..."
              className="flex-1 max-w-md"
            />
            
            <div className="flex gap-2">
              <FilterDropdown
                label="All Stages"
                options={stageFilterOptions}
                value={stageFilter}
                onChange={setStageFilter}
              />
              
              <FilterDropdown
                label="All Reps"
                options={repFilterOptions}
                value={repFilter}
                onChange={setRepFilter}
              />
            </div>
          </div>

          {selectedLeads.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {selectedLeads.length} selected
              </span>
              <Button variant="secondary" size="sm" onClick={() => handleBulkAction('Assign')}>
                Assign
              </Button>
              <Button variant="secondary" size="sm" onClick={() => handleBulkAction('Update Stage')}>
                Update Stage
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleBulkAction('Delete')}>
                Delete
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Leads List */}
      <Card padding="none">
        {filteredLeads.length === 0 ? (
          <div className="p-6">
            <Empty
              icon="Users"
              title="No leads found"
              message={searchTerm || stageFilter !== 'all' || repFilter !== 'all' 
                ? "No leads match your current filters. Try adjusting your search criteria."
                : "Start building your pipeline by adding your first lead."
              }
              actionLabel="Add Lead"
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Lead</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Company</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Stage</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Value</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Assigned To</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Last Activity</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.map((lead, index) => {
                  const stageColor = getStageColor(lead.stage)
                  const isSelected = selectedLeads.includes(lead.Id)
                  const daysInStage = Math.floor((new Date() - new Date(lead.lastActivity)) / (1000 * 60 * 60 * 24))
                  
                  return (
                    <motion.tr
                      key={lead.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-primary-50' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleLeadSelect(lead.Id)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <Avatar name={lead.name} size="sm" />
                          <div>
                            <div className="font-medium text-gray-900">{lead.name}</div>
                            <div className="text-sm text-gray-500">{lead.email}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{lead.company}</div>
                        {lead.phone && (
                          <div className="text-sm text-gray-500">{lead.phone}</div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-1">
                          <Badge variant={stageColor.variant} size="sm">
                            {lead.stage}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {daysInStage}d in stage
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(lead.value)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Avatar name={lead.assignedTo} size="sm" />
                          <span className="text-sm text-gray-900">{lead.assignedTo}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {new Date(lead.lastActivity).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(lead.lastActivity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" icon="Eye">
                            View
                          </Button>
                          <Button variant="ghost" size="sm" icon="Edit">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" icon="MoreHorizontal">
                            More
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stages.slice(0, 4).map((stage) => {
          const stageLeads = filteredLeads.filter(lead => lead.stage === stage)
          const stageValue = stageLeads.reduce((sum, lead) => sum + lead.value, 0)
          
          return (
            <Card key={stage} padding="lg" hover>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stageLeads.length}
                </div>
                <div className="text-sm font-medium text-gray-700 mb-2">
                  {stage}
                </div>
                <div className="text-xs text-gray-500">
                  {formatCurrency(stageValue)}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default Leads