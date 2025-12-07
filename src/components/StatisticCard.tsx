
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatisticCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUpward: boolean;
  };
  className?: string;
}

const StatisticCard: React.FC<StatisticCardProps> = ({ 
  title, 
  value, 
  icon: Icon,
  trend,
  className = ""
}) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start dark:border-gray-700 dark:bg-gray-900">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            
            {trend && (
              <div className={`flex items-center mt-2 text-sm ${trend.isUpward ? 'text-green-500' : 'text-red-500'}`}>
                <span className="mr-1">
                  {trend.isUpward ? '↑' : '↓'}
                </span>
                <span>{trend.value}% {trend.isUpward ? 'increase' : 'decrease'}</span>
              </div>
            )}
          </div>
          
          <div className="bg-marketplace-purple/10 p-3 rounded-full">
            <Icon className="h-6 w-6 text-marketplace-purple" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticCard;
