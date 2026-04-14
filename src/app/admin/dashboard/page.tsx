"use client";

import { useStore } from "@/hooks/use-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, Utensils, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo } from "react";

export default function AdminDashboard() {
  const { orders, students, dashboardConfig } = useStore();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter(o => o.status === 'Pending').length;

  // Compute weekly order chart data from real orders
  const chartData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts: Record<string, number> = {};
    days.forEach(d => counts[d] = 0);

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    orders.forEach(o => {
      const d = new Date(o.createdAt);
      if (d >= weekAgo) {
        counts[days[d.getDay()]] += 1;
      }
    });

    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(name => ({
      name,
      count: counts[name],
    }));
  }, [orders]);

  const alerts = dashboardConfig?.alerts ?? [
    { title: "Getting Started", message: "Visit /seed to initialize your database with default data." },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="space-y-1">
        <p className="concierge-text text-accent">Kitchen Control</p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Admin Overview</h2>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <Card className="border-border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="concierge-text text-xs sm:text-[12px]">Total Orders</CardTitle>
            <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold">{orders.length}</div>
            <p className="text-xs sm:text-xs text-muted-foreground mt-1 hidden sm:block">Lifetime across system</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="concierge-text text-xs sm:text-[12px]">Members</CardTitle>
            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold">{students.length}</div>
            <p className="text-xs sm:text-xs text-muted-foreground mt-1 hidden sm:block">Registered students</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="concierge-text text-xs sm:text-[12px]">Pending</CardTitle>
            <Utensils className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs sm:text-xs text-muted-foreground mt-1 hidden sm:block">Orders requiring action</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="concierge-text text-xs sm:text-[12px]">Revenue</CardTitle>
            <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold">{totalRevenue}</div>
            <p className="text-xs sm:text-xs text-muted-foreground mt-1 hidden sm:block">Total collected</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
        <Card className="border-border shadow-none">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="concierge-text">Order Velocity (This Week)</CardTitle>
          </CardHeader>
          <CardContent className="h-60 sm:h-80 p-2 sm:p-6 pt-0 sm:pt-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(38, 18%, 86%)" />
                <XAxis dataKey="name" stroke="hsl(30, 10%, 10%)" fontSize={10} fontWeight="bold" />
                <YAxis stroke="hsl(30, 10%, 10%)" fontSize={10} fontWeight="bold" />
                <Tooltip
                  cursor={{ fill: 'hsl(40, 25%, 93%)' }}
                  contentStyle={{ backgroundColor: 'hsl(40, 30%, 99%)', border: '1px solid hsl(38, 18%, 86%)', borderRadius: '0.5rem' }}
                />
                <Bar dataKey="count" fill="hsl(36, 70%, 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-lg sm:text-xl font-bold">Kitchen Quick Guide</h3>
          <div className="grid gap-3 sm:gap-4">
            {alerts.map((alert, i) => (
              <div key={i} className="border border-border p-3 sm:p-4 bg-secondary">
                <h4 className="font-bold text-xs sm:text-sm">{alert.title}</h4>
                <p className="text-xs sm:text-xs text-muted-foreground mt-1">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
