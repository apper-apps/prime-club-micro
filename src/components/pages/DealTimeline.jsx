import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Draggable from "react-draggable";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import { leadService } from "@/services/api/leadService";
const DealTimeline = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [draggedDeal, setDraggedDeal] = useState(null);
  const timelineRef = useRef(null);

  // Sample deal data with month ranges - now stateful for drag updates
  const [deals, setDeals] = useState([
    { 
      id: 1,
      name: 'Canva Enterprise Deal',
      startMonth: 0, // January (0-indexed)
      endMonth: 2,   // March
      color: 'bg-blue-500'
    },
    { 
      id: 2,
      name: 'Notion Pro Plan Agreement',
      startMonth: 1, // February
      endMonth: 4,   // May
      color: 'bg-green-500'
    },
    { 
      id: 3,
      name: 'ClickUp Business Contract',
      startMonth: 2, // March
      endMonth: 5,   // June
      color: 'bg-purple-500'
    },
    { 
      id: 4,
      name: 'Ahrefs Pro Suite Negotiation',
      startMonth: 3, // April
      endMonth: 7,   // August
      color: 'bg-orange-500'
    },
    { 
      id: 5,
      name: 'Scribe Enterprise Deal',
      startMonth: 4, // May
      endMonth: 6,   // July
      color: 'bg-pink-500'
    },
    { 
      id: 6,
      name: 'Figma Business License',
      startMonth: 5, // June
      endMonth: 8,   // September
      color: 'bg-indigo-500'
    },
    { 
      id: 7,
      name: 'Slack Enterprise Grid',
      startMonth: 6, // July
      endMonth: 11,  // December
      color: 'bg-red-500'
    },
    { 
      id: 8,
      name: 'Zoom Enterprise Package',
      startMonth: 7, // August
      endMonth: 10,  // November
      color: 'bg-teal-500'
}
  ]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      await leadService.getAll(); // Keep for consistency but not using the data
    } catch (err) {
      setError('Failed to load deal timeline data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const getDealWidth = (startMonth, endMonth) => {
    const monthSpan = endMonth - startMonth + 1;
    return `${(monthSpan / 12) * 100}%`;
  };

  const getDealPosition = (startMonth) => {
    return `${(startMonth / 12) * 100}%`;
  };
// Convert pixel position to month with snapping
  const pixelToMonth = (pixelX, timelineWidth) => {
    const monthWidth = timelineWidth / 12;
    const month = Math.round(pixelX / monthWidth);
    return Math.max(0, Math.min(11, month));
  };

  // Handle drag for repositioning entire deal
  const handleDrag = (dealId, data) => {
    if (!timelineRef.current) return;
    
    const timelineWidth = timelineRef.current.offsetWidth;
    const newStartMonth = pixelToMonth(data.x, timelineWidth);
    
    setDeals(prevDeals => 
      prevDeals.map(deal => {
        if (deal.id === dealId) {
          const duration = deal.endMonth - deal.startMonth;
          const newEndMonth = Math.min(11, newStartMonth + duration);
          return {
            ...deal,
            startMonth: newStartMonth,
            endMonth: newEndMonth
          };
        }
        return deal;
      })
    );
};

  // Handle drag stop to finalize position
  const handleDragStop = (dealId, data) => {
    setDraggedDeal(null);
  };

  // Handle resize operations with direct mouse events
  const [resizing, setResizing] = useState({ dealId: null, side: null });

  const handleResizeMouseDown = (e, dealId, side) => {
    e.stopPropagation();
    e.preventDefault();
    setResizing({ dealId, side });
    
    const handleMouseMove = (moveEvent) => {
      if (!timelineRef.current) return;
      
      const timelineRect = timelineRef.current.getBoundingClientRect();
      const relativeX = moveEvent.clientX - timelineRect.left;
      const timelineWidth = timelineRect.width;
      const newMonth = pixelToMonth(relativeX, timelineWidth);
      
      setDeals(prevDeals =>
        prevDeals.map(deal => {
          if (deal.id === dealId) {
            if (side === 'left') {
              const newStartMonth = Math.min(newMonth, deal.endMonth);
              return { ...deal, startMonth: Math.max(0, newStartMonth) };
            } else {
              const newEndMonth = Math.max(newMonth, deal.startMonth);
              return { ...deal, endMonth: Math.min(11, newEndMonth) };
            }
          }
          return deal;
        })
      );
    };

    const handleMouseUp = () => {
      setResizing({ dealId: null, side: null });
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Simple Header */}
      <div className="space-y-2">
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 via-coral-600 to-primary-800 bg-clip-text text-transparent">
          Deal Timeline
        </h1>
      </div>

      {/* Calendar View */}
      <Card padding="lg" className="overflow-hidden">
        {/* Month Headers */}
        <div className="grid grid-cols-12 gap-0 mb-8">
          {months.map((month, index) => (
            <motion.div
              key={month}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="text-center py-3 border-r border-gray-200 last:border-r-0"
            >
              <div className="text-sm font-semibold text-gray-700">{month}</div>
              <div className="text-xs text-gray-500 mt-1">2024</div>
            </motion.div>
))}
        </div>

        {/* Deal Timeline Bars */}
        <div ref={timelineRef} className="space-y-4 relative">
          {deals.map((deal, index) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative h-12 bg-gray-50 rounded-lg overflow-hidden"
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

              {/* Deal Bar - Desktop Draggable Version */}
              <div className="hidden md:block">
                <Draggable
                  axis="x"
                  bounds="parent"
                  position={{
                    x: (deal.startMonth / 12) * (timelineRef.current?.offsetWidth || 1000),
                    y: 0
                  }}
                  onDrag={(e, data) => handleDrag(deal.id, data)}
                  onStop={(e, data) => handleDragStop(deal.id, data)}
                  onStart={() => setDraggedDeal(deal.id)}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: getDealWidth(deal.startMonth, deal.endMonth) }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                    className={`absolute top-1 bottom-1 ${deal.color} rounded opacity-80 hover:opacity-100 transition-all cursor-move shadow-sm group`}
                    style={{
                      minWidth: '60px',
                      zIndex: draggedDeal === deal.id ? 10 : 1
                    }}
                  >
{/* Left resize handle */}
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-2 cursor-w-resize opacity-0 group-hover:opacity-100 hover:bg-white hover:bg-opacity-30 transition-opacity z-20"
                      onMouseDown={(e) => handleResizeMouseDown(e, deal.id, 'left')}
                    />

                    {/* Deal content */}
                    <div className="flex items-center h-full px-3 pointer-events-none">
                      <span className="text-white text-sm font-medium truncate">
                        {deal.name}
                      </span>
                    </div>

                    {/* Right resize handle */}
                    <div 
                      className="absolute right-0 top-0 bottom-0 w-2 cursor-e-resize opacity-0 group-hover:opacity-100 hover:bg-white hover:bg-opacity-30 transition-opacity z-20"
                      onMouseDown={(e) => handleResizeMouseDown(e, deal.id, 'right')}
                    />

                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-60 transition-opacity pointer-events-none">
                      <ApperIcon name="GripHorizontal" size={16} className="text-white" />
                    </div>
                  </motion.div>
                </Draggable>
              </div>

              {/* Deal Bar - Mobile Static Version */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: getDealWidth(deal.startMonth, deal.endMonth) }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                className={`absolute top-1 bottom-1 ${deal.color} rounded opacity-80 hover:opacity-100 transition-opacity cursor-pointer shadow-sm md:hidden`}
                style={{
                  left: getDealPosition(deal.startMonth),
                }}
              >
                <div className="flex items-center h-full px-3">
                  <span className="text-white text-sm font-medium truncate">
                    {deal.name}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Responsive Version */}
        <div className="md:hidden mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal List</h3>
          {deals.map((deal, index) => (
            <motion.div
              key={`mobile-${deal.name}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className={`w-4 h-4 rounded ${deal.color}`}></div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{deal.name}</div>
                <div className="text-sm text-gray-500">
                  {months[deal.startMonth]} - {months[deal.endMonth]} 2024
                </div>
              </div>
            </motion.div>
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