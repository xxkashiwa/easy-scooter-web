import { getDailyStats } from '@/services/revenue-stats-service';
import { DailyStats } from '@/services/types';
import React, { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { toast } from 'sonner';

const DailyIncome: React.FC = () => {
  // Format today's date as YYYY-MM-DD
  const formatDateToYYYYMMDD = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState<string>(
    formatDateToYYYYMMDD(new Date()) // Default to today in YYYY-MM-DD format
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDailyStats = async () => {
      try {
        setLoading(true);
        // Pass the YYYY-MM-DD format directly to the API
        const stats = await getDailyStats(selectedDate);
        setDailyStats(stats);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch daily stats:', err);
        const errorMessage =
          'Failed to load daily income data. Please try again later.';
        setError(errorMessage);
        toast.error(errorMessage);
        // Clear all data when there's an error
        setDailyStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyStats();
  }, [selectedDate]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = event.target.value; // Format: YYYY-MM-DD
    setSelectedDate(dateValue); // Directly set the YYYY-MM-DD string
  };

  // Get max date (today)
  const today = new Date();
  const maxDate = formatDateToYYYYMMDD(today); // Format: YYYY-MM-DD for input element

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        Loading daily revenue data...
      </div>
    );
  }

  if (error && !dailyStats) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-8 p-4">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">Daily Income</h1>

        {/* Date Picker */}
        <div className="flex items-center space-x-2">
          <label htmlFor="date-picker" className="font-medium">
            Select Date:
          </label>
          <input
            id="date-picker"
            type="date"
            className="rounded-md border border-gray-300 px-3 py-2"
            max={maxDate}
            onChange={handleDateChange}
            defaultValue={selectedDate}
          />
        </div>
        <div className="text-sm text-gray-500">
          Selected date: {selectedDate}
        </div>
      </div>

      {dailyStats && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-white p-4 shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Total Revenue
              </h3>
              <p className="text-2xl font-bold">
                £{dailyStats.totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Total Rentals
              </h3>
              <p className="text-2xl font-bold">{dailyStats.retalCount}</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Avg Revenue/Rental
              </h3>
              <p className="text-2xl font-bold">
                £
                {dailyStats.retalCount > 0
                  ? (dailyStats.totalRevenue / dailyStats.retalCount).toFixed(2)
                  : '0.00'}
              </p>
            </div>
          </div>

          {/* Rental Breakdown Bar Chart */}
          <div className="w-full">
            <div className="rounded-lg bg-white p-4 shadow">
              <h2 className="mb-4 text-lg font-medium">Rentals by Period</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: '1 Hour',
                        value: dailyStats.revenueByPeriod['1hr'].count,
                      },
                      {
                        name: '4 Hours',
                        value: dailyStats.revenueByPeriod['4hrs'].count,
                      },
                      {
                        name: '1 Day',
                        value: dailyStats.revenueByPeriod['1day'].count,
                      },
                      {
                        name: '1 Week',
                        value: dailyStats.revenueByPeriod['1week'].count,
                      },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="value"
                      fill="#82ca9d"
                      name="Number of Rentals"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DailyIncome;
