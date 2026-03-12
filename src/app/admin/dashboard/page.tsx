"use client";

import { useStore } from "@/hooks/use-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, Utensils, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Mon', count: 45 },
  { name: 'Tue', count: 52 },
  { name: 'Wed', count: 48 },
  { name: 'Thu', count: 61 },
  { name: 'Fri', count: 55 },
  { name: 'Sat', count: 42 },
  { name: 'Sun', count: 38 },
];

export default function AdminDashboard() {
  const { orders } = useStore();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter(o => o.status === 'Pending').length;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="space-y-1">
        <p className="concierge-text text-accent">Kitchen Control</p>
        <h2 className="text-4xl font-black">Admin Overview</h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="concierge-text">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{orders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Lifetime across system</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="concierge-text">Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">124</div>
            <p className="text-xs text-muted-foreground mt-1">Active subscriptions</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="concierge-text">Pending</CardTitle>
            <Utensils className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Orders requiring action</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="concierge-text">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">₹{totalRevenue}</div>
            <p className="text-xs text-muted-foreground mt-1">Projected this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="concierge-text">Order Velocity</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                <XAxis dataKey="name" stroke="#000" fontSize={10} fontWeight="bold" />
                <YAxis stroke="#000" fontSize={10} fontWeight="bold" />
                <Tooltip 
                  cursor={{ fill: '#F2F2F2' }}
                  contentStyle={{ backgroundColor: '#F9F8F3', border: '1px solid #E5E5E5', borderRadius: '0' }}
                />
                <Bar dataKey="count" fill="#71171F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-xl font-bold">Kitchen Quick Guide</h3>
          <div className="grid gap-4">
            <div className="border border-border p-4 bg-secondary">
              <h4 className="font-bold uppercase tracking-tight text-sm">Breakfast Rush</h4>
              <p className="text-xs text-muted-foreground mt-1">High demand for Idli & Dosa expected between 08:00 - 09:30.</p>
            </div>
            <div className="border border-border p-4 bg-secondary">
              <h4 className="font-bold uppercase tracking-tight text-sm">Stock Alert</h4>
              <p className="text-xs text-muted-foreground mt-1">Sambar dal supply running low. Recommended reorder in 24h.</p>
            </div>
            <div className="border border-border p-4 bg-secondary">
              <h4 className="font-bold uppercase tracking-tight text-sm">Upcoming Event</h4>
              <p className="text-xs text-muted-foreground mt-1">Sunday Special Thali scheduled for next 48 hours.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}