import { getWeeklyStats } from '@/services/revenue-stats-service';
import { PeriodStats } from '@/services/types';
import React, { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const WeeklyIncome: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [weeklyStats, setWeeklyStats] = useState<PeriodStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeeklyStats = async () => {
      try {
        setLoading(true);
        const stats = await getWeeklyStats();
        setWeeklyStats(stats);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch weekly stats:', err);
        setError('Failed to load weekly income data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyStats();
  }, []);

  // Prepare data for rental period breakdown chart
  const prepareRentalPeriodData = () => {
    if (!weeklyStats) return [];

    return [
      { name: '1 Hour', value: weeklyStats.revenueByPeriod['1hr'].revenue },
      { name: '4 Hours', value: weeklyStats.revenueByPeriod['4hrs'].revenue },
      { name: '1 Day', value: weeklyStats.revenueByPeriod['1day'].revenue },
      { name: '1 Week', value: weeklyStats.revenueByPeriod['1week'].revenue },
    ];
  };

  // Prepare data for daily revenue chart
  const prepareDailyRevenueData = () => {
    if (!weeklyStats?.dailyStats) return [];

    return weeklyStats.dailyStats.map(day => ({
      date: new Date(day.data).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
      revenue: day.totalRevenue,
      rentals: day.retalCount,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        Loading weekly revenue data...
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-8 p-4">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold">Weekly Income</h1>
        {weeklyStats && (
          <div className="text-sm text-gray-600">
            {new Date(weeklyStats.startDate).toLocaleDateString()} -{' '}
            {new Date(weeklyStats.endDate).toLocaleDateString()}
          </div>
        )}
      </div>

      {weeklyStats && (
        <>
          {/* Summary Stats Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-white p-4 shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Total Revenue
              </h3>
              <p className="text-2xl font-bold">
                ${weeklyStats.totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Total Rentals
              </h3>
              <p className="text-2xl font-bold">{weeklyStats.totalRentals}</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Daily Average
              </h3>
              <p className="text-2xl font-bold">
                ${weeklyStats.dailyAverage.toFixed(2)}
              </p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Avg Revenue/Rental
              </h3>
              <p className="text-2xl font-bold">
                $
                {weeklyStats.totalRentals > 0
                  ? (
                      weeklyStats.totalRevenue / weeklyStats.totalRentals
                    ).toFixed(2)
                  : '0.00'}
              </p>
            </div>
          </div>

          {/* Daily Revenue Line Chart */}
          <div className="rounded-lg bg-white p-4 shadow">
            <h2 className="mb-4 text-lg font-medium">Daily Revenue Trend</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={prepareDailyRevenueData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={value => [`$${value}`, 'Revenue']} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Rental Count Bar Chart */}
          <div className="rounded-lg bg-white p-4 shadow">
            <h2 className="mb-4 text-lg font-medium">Daily Rental Count</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={prepareDailyRevenueData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="rentals"
                    fill="#82ca9d"
                    name="Number of Rentals"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue by Rental Period Pie Chart */}
          <div className="rounded-lg bg-white p-4 shadow">
            <h2 className="mb-4 text-lg font-medium">
              Revenue by Rental Period
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepareRentalPeriodData()}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {prepareRentalPeriodData().map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={value => [`$${value}`, 'Revenue']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WeeklyIncome;
