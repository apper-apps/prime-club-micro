import React, { useEffect, useState } from "react";
import { Resizable } from "react-resizable";
import { toast } from "react-toastify";
import { formatCurrency } from "@/utils/formatters";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { dealService } from "@/services/api/dealService";

const DealTimeline = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draggedDeal, setDraggedDeal] = useState(null);
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

  const handleDealResize = async (dealId, newWidth, containerWidth) => {
    const monthSpan = Math.max(1, Math.round((newWidth / containerWidth) * 12));
    const deal = deals.find(d => d.Id === dealId);
    if (!deal) return;

    const newEndMonth = Math.min(11, deal.startMonth + monthSpan - 1);
    
    try {
      const updatedDeal = { ...deal, endMonth: newEndMonth };
      await dealService.update(dealId, updatedDeal);
      
      setDeals(prevDeals => 
        prevDeals.map(d => d.Id === dealId ? updatedDeal : d)
      );
      
      toast.success(`Updated "${deal.name}" duration to ${monthSpan} month${monthSpan > 1 ? 's' : ''}`);
    } catch (error) {
      console.error('Failed to update deal:', error);
      toast.error('Failed to update deal duration');
    }
  };

  const handleDragStart = (dealId) => {
    setDraggedDeal(dealId);
  };

  const handleDragStop = () => {
    setDraggedDeal(null);
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
          Deal Timeline
        </h1>
        <p className="text-gray-600">Drag the edges of deal tiles to adjust duration</p>
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
<div className="space-y-3" id="timeline-container">
          {deals.map((deal, index) => (
            <div
              key={deal.Id}
              className="relative h-16 bg-gray-50 rounded-lg overflow-visible border"
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

              {/* Resizable Deal Bar */}
              <Resizable
                width={((deal.endMonth - deal.startMonth + 1) / 12) * 100}
                height={56}
                onResize={(e, direction, ref, delta, position) => {
                  const container = ref.parentElement;
                  const containerWidth = container.offsetWidth;
                  const newWidth = ref.offsetWidth;
                  
                  // Update visual feedback during resize
                  if (draggedDeal !== deal.Id) {
                    setDraggedDeal(deal.Id);
                  }
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                  const container = ref.parentElement;
                  const containerWidth = container.offsetWidth;
                  const newWidth = ref.offsetWidth;
                  
                  handleDealResize(deal.Id, newWidth, containerWidth);
                  handleDragStop();
                }}
                onResizeStart={() => handleDragStart(deal.Id)}
                minWidth={80}
                maxWidth="100%"
                enable={{
                  top: false,
                  right: true,
                  bottom: false,
                  left: true,
                  topRight: false,
                  bottomRight: false,
                  bottomLeft: false,
                  topLeft: false
                }}
                className="absolute"
                style={{
                  left: getDealPosition(deal.startMonth),
                  top: '4px',
                  height: '56px'
                }}
              >
                <div
                  className={`w-full h-full ${getStatusColor(deal.status)} rounded shadow-sm transition-all cursor-move
                    ${draggedDeal === deal.Id ? 'opacity-80 shadow-lg scale-105' : 'opacity-90 hover:opacity-100 hover:shadow-md'}
                  `}
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
                  
                  {/* Resize Handles */}
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-white bg-opacity-20 opacity-0 hover:opacity-100 cursor-ew-resize transition-opacity">
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded"></div>
                  </div>
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white bg-opacity-20 opacity-0 hover:opacity-100 cursor-ew-resize transition-opacity">
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded"></div>
                  </div>
                </div>
              </Resizable>

              {/* Deal Info Overlay */}
              <div className="absolute top-1 right-1 pointer-events-none">
                <Badge variant="outline" className={`text-xs ${getPriorityColor(deal.priority)}`}>
                  {deal.priority.toUpperCase()}
                </Badge>
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