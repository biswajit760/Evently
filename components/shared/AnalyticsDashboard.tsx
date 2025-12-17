// components/analytics/AnalyticsDashboard.tsx
"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Ticket, 
  DollarSign, 
  Activity,
  Calendar
} from "lucide-react";
import { useState } from "react";

// Types for better safety
interface AnalyticsProps {
  analytics: {
    totalViews: number;
    ticketsSold: number;
    totalRevenue: number;
    conversionRate: number;
    salesOverTime: Array<{ date: string; tickets: number; revenue: number }>;
  };
}

export default function AnalyticsDashboard({ analytics }: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState("7d");

  // Format currency for axis and tooltips
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(value);

  return (
    <div className="space-y-8 bg-gray-50 p-6 rounded-2xl min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row  items-start md:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Track your event metrics and revenue growth.</p>
        </div>
        
        {/* Mock Time Range Selector */}
        <div className="flex space-y-6 bg-white p-1 rounded-lg border shadow-sm">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                timeRange === range 
                  ? "bg-gray-900 text-white shadow" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid mt-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 space-y-4 border-2 border-gray-400 p-4">
        <StatCard 
          title="Total Views" 
          value={analytics.totalViews.toLocaleString()} 
          icon={Eye} 
          trend="+12.5%" 
          trendUp={true}
          color="blue"
        />
        <StatCard 
          title="Tickets Sold" 
          value={analytics.ticketsSold.toLocaleString()} 
          icon={Ticket} 
          trend="+4.2%" 
          trendUp={true}
          color="indigo"
        />
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(analytics.totalRevenue)} 
          icon={DollarSign} 
          trend="+8.1%" 
          trendUp={true}
          color="emerald"
        />
        <StatCard 
          title="Conversion Rate" 
          value={`${analytics.conversionRate}%`} 
          icon={Activity} 
          trend="-1.2%" 
          trendUp={false}
          color="rose"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid mt-4 grid-cols-1 lg:grid-cols-2 gap-8 ">
        
        {/* Sales Trend (Area Chart) */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Ticket Sales Trend</h2>
              <p className="text-sm text-gray-500">Daily ticket volume</p>
            </div>
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Ticket className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.salesOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#6B7280', fontSize: 12}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#6B7280', fontSize: 12}} 
                />
                <Tooltip content={<CustomTooltip type="tickets" />} />
                <Area 
                  type="monotone" 
                  dataKey="tickets" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorTickets)" 
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart (Bar Chart) */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Revenue Generated</h2>
              <p className="text-sm text-gray-500">Daily income breakdown</p>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.salesOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#6B7280', fontSize: 12}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#6B7280', fontSize: 12}} 
                  tickFormatter={(val) => `₹${val/1000}k`}
                />
                <Tooltip cursor={{fill: '#f3f4f6'}} content={<CustomTooltip type="revenue" />} />
                <Bar 
                  dataKey="revenue" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]} 
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub Components ---

const StatCard = ({ title, value, icon: Icon, trend, trendUp, color }: any) => {
  const colorStyles: any = {
    blue: "text-blue-600 bg-blue-50",
    indigo: "text-indigo-600 bg-indigo-50",
    emerald: "text-emerald-600 bg-emerald-50",
    rose: "text-rose-600 bg-rose-50",
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-lg ${colorStyles[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            trendUp ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
          }`}>
            {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend}
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label, type }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const formattedValue = type === 'revenue' 
      ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value)
      : value;

    return (
      <div className="bg-gray-900 text-white p-3 rounded-lg shadow-xl text-sm border border-gray-700">
        <div className="flex items-center gap-2 mb-1 text-gray-400">
          <Calendar className="w-3 h-3" />
          <span>{label}</span>
        </div>
        <div className="font-bold text-lg">
          {formattedValue} 
          <span className="text-xs font-normal text-gray-400 ml-1">
            {type === 'revenue' ? 'earned' : 'sold'}
          </span>
        </div>
      </div>
    );
  }
  return null;
};