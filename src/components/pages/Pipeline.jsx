import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import PipelineColumn from '@/components/molecules/PipelineColumn'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { leadService } from '@/services/api'

const Pipeline = () => {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const stages = [
    'Connected',
    'Locked', 
    'Meeting Booked',
    'Meeting Done',
    'Negotiation',
    'Qualified',
    'Closed',
    'Lost'
  ]

  const loadLeads = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await leadService.getAll()
      setLeads(data)
    } catch (err) {
      setError('Failed to load pipeline data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeads()
  }, [])

  const handleDrop = async (leadId, newStage) => {
    try {
      const leadToUpdate = leads.find(lead => lead.Id === parseInt(leadId))
      if (!leadToUpdate || leadToUpdate.stage === newStage) return

      const updatedLead = await leadService.update(leadToUpdate.Id, {
        ...leadToUpdate,
        stage: newStage,
        lastActivity: new Date().toISOString()
      })

      setLeads(prevLeads =>
        prevLeads.map(lead =>
          lead.Id === updatedLead.Id ? updatedLead : lead
        )
      )

      toast.success(`${leadToUpdate.name} moved to ${newStage}`)
    } catch (err) {
      toast.error('Failed to update lead stage')
    }
  }

  const handleLeadClick = (lead) => {
    // Handle lead detail view
    console.log('Lead clicked:', lead)
  }

  if (loading) return <Loading type="skeleton" />
  if (error) return <Error message={error} onRetry={loadLeads} />

  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0)
  const activeDeals = leads.filter(lead => !['Closed', 'Lost'].includes(lead.stage)).length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Sales Pipeline
          </h1>
          <p className="text-gray-600 mt-1">
            {activeDeals} active deals • ${(totalValue / 1000).toFixed(0)}K total value
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="secondary" icon="Filter">
            Filter
          </Button>
          <Button icon="Plus">
            Add Lead
          </Button>
        </div>
      </div>

      {/* Pipeline Stats */}
      <Card padding="lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-1">
              {leads.length}
            </div>
            <div className="text-sm text-gray-600">Total Leads</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {leads.filter(lead => lead.stage === 'Closed').length}
            </div>
            <div className="text-sm text-gray-600">Closed Deals</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gold-600 mb-1">
              ${(totalValue / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-gray-600">Pipeline Value</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {leads.length > 0 ? ((leads.filter(lead => lead.stage === 'Closed').length / leads.length) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-sm text-gray-600">Win Rate</div>
          </div>
        </div>
      </Card>

      {/* Pipeline Board */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="flex items-center mb-6">
          <ApperIcon name="GitBranch" className="mr-3 h-6 w-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Pipeline Board</h2>
        </div>
        
        <div className="overflow-x-auto">
          <div className="flex space-x-6 min-w-max pb-4">
            {stages.map((stage) => {
              const stageLeads = leads.filter(lead => lead.stage === stage)
              return (
                <motion.div
                  key={stage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-80 flex-shrink-0"
                >
                  <PipelineColumn
                    stage={stage}
                    leads={stageLeads}
                    onLeadClick={handleLeadClick}
                    onDrop={handleDrop}
                  />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pipeline