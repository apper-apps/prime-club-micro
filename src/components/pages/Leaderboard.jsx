import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Avatar from '@/components/atoms/Avatar'
import ProgressRing from '@/components/atoms/ProgressRing'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { salesRepService, leadService } from '@/services/api'

const Leaderboard = () => {
  const [salesReps, setSalesReps] = useState([])
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [period, setPeriod] = useState('month') // month, quarter, year

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [repsData, leadsData] = await Promise.all([
        salesRepService.getAll(),
        leadService.getAll()
      ])
      setSalesReps(repsData)
      setLeads(leadsData)
    } catch (err) {
      setError('Failed to load leaderboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />
  if (salesReps.length === 0) return <Empty title="No sales reps found" />

  // Calculate enhanced metrics for each rep
  const repsWithMetrics = salesReps.map(rep => {
    const repLeads = leads.filter(lead => lead.assignedTo === rep.name)
    const closedDeals = repLeads.filter(lead => lead.stage === 'Closed')
    const totalRevenue = closedDeals.reduce((sum, lead) => sum + lead.value, 0)
    const winRate = repLeads.length > 0 ? (closedDeals.length / repLeads.length) * 100 : 0
    const avgDealSize = closedDeals.length > 0 ? totalRevenue / closedDeals.length : 0
    const quota = 500000 // Monthly quota
    const quotaAchievement = (totalRevenue / quota) * 100

    return {
      ...rep,
      totalLeads: repLeads.length,
      closedDeals: closedDeals.length,
      totalRevenue,
      winRate,
      avgDealSize,
      quotaAchievement
    }
  })

  // Sort by total revenue for ranking
  const rankedReps = repsWithMetrics.sort((a, b) => b.totalRevenue - a.totalRevenue)
  
  const hunterOfTheMonth = rankedReps[0]

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return 'Crown'
      case 2: return 'Medal'
      case 3: return 'Award'
      default: return 'User'
    }
  }

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'gold'
      case 2: return 'bg-gray-300'
      case 3: return 'bg-amber-500'
      default: return 'bg-gray-400'
    }
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
<div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Sales Leaderboard
          </h1>
          <p className="text-gray-600 mt-1">
            Track performance and celebrate your top performers
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { key: 'month', label: 'Month' },
              { key: 'quarter', label: 'Quarter' },
              { key: 'year', label: 'Year' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setPeriod(key)}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${period === key 
                    ? 'bg-primary-600 text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hunter of the Month */}
      {hunterOfTheMonth && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
>
          <Card padding="lg" className="bg-gradient-to-r from-primary-50 to-accent-50 border-2 border-primary-200">
            <div className="text-center mb-6">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-400 to-accent-600 rounded-full mb-4 shadow-lg hunter-badge"
              >
                <ApperIcon name="Crown" className="h-10 w-10 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Hunter of the Month</h2>
              <Badge variant="hunter" size="lg" className="mb-4">
                🏆 TOP PERFORMER
              </Badge>
            </div>

            <div className="flex items-center justify-center space-x-8">
              <Avatar 
                name={hunterOfTheMonth.name} 
                src={hunterOfTheMonth.photo}
                size="2xl" 
                className="border-4 border-gold-300 shadow-lg"
              />
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {hunterOfTheMonth.name}
                </h3>
                <div className="grid grid-cols-3 gap-6 text-center">
<div>
                    <div className="text-3xl font-bold text-primary-600">
                      {hunterOfTheMonth.closedDeals}
                    </div>
                    <div className="text-sm text-gray-600">Deals Closed</div>
                  </div>
<div>
                    <div className="text-3xl font-bold text-primary-600">
                      ${(hunterOfTheMonth.totalRevenue / 1000).toFixed(0)}K
                    </div>
                    <div className="text-sm text-gray-600">Revenue</div>
                  </div>
<div>
                    <div className="text-3xl font-bold text-primary-600">
                      {hunterOfTheMonth.winRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Win Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Full Leaderboard */}
      <Card padding="lg">
<div className="flex items-center mb-6">
          <ApperIcon name="Trophy" className="mr-3 h-6 w-6 text-primary-500" />
          <h2 className="text-xl font-bold text-gray-900">Team Rankings</h2>
        </div>

        <div className="space-y-4">
          {rankedReps.map((rep, index) => {
            const rank = index + 1
            return (
              <motion.div
                key={rep.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg
                  ${rank === 1 
                    ? 'bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200' 
                    : rank === 2
                    ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
                    : rank === 3
                    ? 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200'
                    : 'bg-white border-gray-200'
                  }
                `}
              >
                <div className="flex items-center space-x-6">
                  {/* Rank */}
                  <div className="flex items-center space-x-3">
                    <div className={`
w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg
                      ${rank === 1 ? 'bg-gradient-to-br from-primary-400 to-accent-600' :
                        rank === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                        rank === 3 ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                        'bg-gradient-to-br from-gray-300 to-gray-500'
                      }
                    `}>
                      {rank <= 3 ? (
                        <ApperIcon name={getRankIcon(rank)} className="h-6 w-6" />
                      ) : (
                        rank
                      )}
                    </div>
                  </div>

                  {/* Rep Info */}
                  <div className="flex items-center space-x-4 flex-1">
                    <Avatar 
                      name={rep.name} 
                      src={rep.photo} 
size="lg"
                      className={rank === 1 ? 'border-2 border-primary-300' : ''}
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        {rep.name}
                        {rank === 1 && (
                          <Badge variant="hunter" size="sm" className="ml-2">
                            Hunter
                          </Badge>
                        )}
                      </h3>
                      <p className="text-gray-600">Sales Representative</p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {rep.closedDeals}
                      </div>
                      <div className="text-sm text-gray-600">Deals</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ${(rep.totalRevenue / 1000).toFixed(0)}K
                      </div>
                      <div className="text-sm text-gray-600">Revenue</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {rep.winRate.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Win Rate</div>
                    </div>

                    <ProgressRing
                      value={rep.quotaAchievement}
                      max={100}
                      size="lg"
                      color={rep.quotaAchievement >= 100 ? "success" : rep.quotaAchievement >= 75 ? "warning" : "primary"}
                      label={`${rep.quotaAchievement.toFixed(0)}%`}
                    />
                  </div>
                </div>

                {/* Additional Stats Row */}
                <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{rep.totalLeads}</div>
                    <div className="text-xs text-gray-500">Total Leads</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      ${(rep.avgDealSize / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-gray-500">Avg Deal Size</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {rep.totalLeads > 0 ? Math.round(rep.totalRevenue / rep.totalLeads) : 0}
                    </div>
                    <div className="text-xs text-gray-500">Revenue/Lead</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {((rep.quotaAchievement - 100) > 0 ? '+' : '') + (rep.quotaAchievement - 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-500">vs Quota</div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

export default Leaderboard