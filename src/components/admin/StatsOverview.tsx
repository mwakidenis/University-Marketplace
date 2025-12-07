
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Item {
  id: string;
  price: number;
}

interface StatsOverviewProps {
  items: Item[];
  usersCount: number;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ items, usersCount }) => {
  const totalValue = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{items.length}</div>
          <p className="text-xs text-muted-foreground">+0% from last month</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{usersCount}</div>
          <p className="text-xs text-muted-foreground">+0% from last month</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            KSH {totalValue.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">All active listings</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
