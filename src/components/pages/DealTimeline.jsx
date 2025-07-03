import React, { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/formatters";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import { dealService } from "@/services/api/dealService";

const DealTimeline = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDeals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dealService.getAll();
      setDeals(data);
    } catch (err) {
      console.error('Failed to load deals:', err);
      setError('Failed to load deal timeline data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDeals} />;

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const getStatusColor = (status) => {
    const statusColors = {
      'connected': 'bg-blue-500',
      'meeting_booked': 'bg-purple-500',
      'meeting_done': 'bg-indigo-500',
      'qualified': 'bg-green-500',
      'proposal': 'bg-yellow-500',
      'negotiation': 'bg-orange-500',
      'locked': 'bg-red-500',
      'closed': 'bg-emerald-500'
    };
    return statusColors[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      'connected': 'Connected',
      'meeting_booked': 'Meeting Booked',
      'meeting_done': 'Meeting Done',
      'qualified': 'Qualified',
      'proposal': 'Proposal',
      'negotiation': 'Negotiation',
      'locked': 'Locked',
      'closed': 'Closed'
    };
    return statusLabels[status] || 'Unknown';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getDealWidth = (startMonth, endMonth) => {
    const monthSpan = endMonth - startMonth + 1;
    return `${(monthSpan / 12) * 100}%`;
  };

  const getDealPosition = (startMonth) => {
    return `${(startMonth / 12) * 100}%`;
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
          Deal Timeline
        </h1>
        <p className="text-gray-600">Track your deals throughout the year</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card padding="md" className="text-center">
          <div className="text-2xl font-bold text-primary-600">{deals.length}</div>
          <div className="text-sm text-gray-600">Total Deals</div>
        </Card>
        <Card padding="md" className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(deals.reduce((sum, deal) => sum + deal.value, 0))}
          </div>
          <div className="text-sm text-gray-600">Total Value</div>
        </Card>
        <Card padding="md" className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {deals.filter(deal => deal.status === 'closed').length}
          </div>
          <div className="text-sm text-gray-600">Closed Deals</div>
        </Card>
        <Card padding="md" className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {deals.filter(deal => deal.priority === 'high').length}
          </div>
          <div className="text-sm text-gray-600">High Priority</div>
        </Card>
      </div>

      {/* Timeline View */}
      <Card padding="lg" className="overflow-hidden">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">2024 Timeline</h2>
          <p className="text-sm text-gray-600">Visual representation of deal progression throughout the year</p>
        </div>

        {/* Month Headers */}
        <div className="grid grid-cols-12 gap-0 mb-6">
          {months.map((month, index) => (
            <div
              key={month}
              className="text-center py-2 border-r border-gray-200 last:border-r-0"
            >
              <div className="text-sm font-semibold text-gray-700">{month}</div>
              <div className="text-xs text-gray-500">2024</div>
            </div>
          ))}
        </div>

        {/* Deal Timeline Bars */}
        <div className="space-y-3">
          {deals.map((deal, index) => (
            <div
              key={deal.Id}
              className="relative h-16 bg-gray-50 rounded-lg overflow-hidden border"
            >
              {/* Month Grid Background */}
              <div className="absolute inset-0 grid grid-cols-12">
                {months.map((_, monthIndex) => (
                  <div 
                    key={monthIndex} 
                    className="border-r border-gray-200 last:border-r-0"
                  />
                ))}
              </div>

              {/* Deal Bar */}
              <div
                className={`absolute top-1 bottom-1 ${getStatusColor(deal.status)} rounded opacity-90 shadow-sm transition-all hover:opacity-100 hover:shadow-md`}
                style={{
                  left: getDealPosition(deal.startMonth),
                  width: getDealWidth(deal.startMonth, deal.endMonth),
                  minWidth: '80px'
                }}
              >
                <div className="flex items-center justify-between h-full px-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">
                      {deal.name}
                    </div>
                    <div className="text-white text-xs opacity-90 truncate">
                      {deal.company}
                    </div>
                  </div>
                  <div className="ml-2 text-white text-xs font-medium">
                    {formatCurrency(deal.value, true)}
                  </div>
                </div>
              </div>

              {/* Deal Info Overlay */}
              <div className="absolute top-1 right-1">
                <Badge variant="outline" className={`text-xs ${getPriorityColor(deal.priority)}`}>
                  {deal.priority.toUpperCase()}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Deal List - Mobile and Additional Info */}
      <Card padding="lg">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Deal Details</h2>
          <p className="text-sm text-gray-600">Complete list with status and timeline information</p>
        </div>

        <div className="space-y-4">
          {deals.map((deal) => (
            <div
              key={deal.Id}
              className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-4 mb-3 md:mb-0">
                <div className={`w-4 h-4 rounded ${getStatusColor(deal.status)}`}></div>
                <div>
                  <div className="font-medium text-gray-900">{deal.name}</div>
                  <div className="text-sm text-gray-600">{deal.company}</div>
                  <div className="text-xs text-gray-500">
                    {months[deal.startMonth]} - {months[deal.endMonth]} 2024
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Badge variant="outline" className="w-fit">
                  {getStatusLabel(deal.status)}
                </Badge>
                <Badge variant="outline" className={`w-fit ${getPriorityColor(deal.priority)}`}>
                  {deal.priority.toUpperCase()}
                </Badge>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(deal.value)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {deal.assignedTo}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Empty State */}
      {deals.length === 0 && (
        <Empty
          icon="Calendar"
          title="No deals in timeline"
          message="Start by adding deals to see your calendar view."
          actionLabel="Add First Deal"
        />
      )}
    </div>
  );
};

export default DealTimeline;