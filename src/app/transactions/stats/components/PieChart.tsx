"use client";
import React, { useState } from 'react';
import { useStore } from '@/lib/store/store';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { SeriesPieOptions } from 'highcharts';

const PieChart = () => {
  const { resolvedTheme } = useTheme();
  const { transactions, currentYear, currentMonth } = useStore();
  const [filter, setFilter] = useState('monthly'); // Default filter
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Calculate the total amount from all transactions
  const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  // Filter transactions based on the selected filter
  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const currentDate = new Date();
    switch (filter) {
      case 'weekly':
        return transactionDate >= new Date(currentDate.setDate(currentDate.getDate() - 7));
      case 'monthly':
        return transactionDate.getFullYear() === currentYear && transactionDate.getMonth() === currentMonth;
      case 'custom':
        const startDate = new Date(customStartDate);
        const endDate = new Date(customEndDate);
        return transactionDate >= startDate && transactionDate <= endDate;
      default:
        return true;
    }
  });

  // Group transactions by category and calculate the percentage for each category
  const categories = filteredTransactions.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = {
        name: category,
        y: 0,
        amount: 0,
      };
    }
    acc[category].y += (transaction.amount / totalAmount) * 100;
    acc[category].amount += transaction.amount;
    return acc;
  }, {} as { [key: string]: { name: string; y: number; amount: number } });

  // Convert the categories object to an array
  const data = Object.values(categories).map(category => ({
    name: category.name,
    y: category.y,
    sliced: category.amount === Math.max(...Object.values(categories).map(c => c.amount)),
    selected: category.amount === Math.max(...Object.values(categories).map(c => c.amount)),
  }));

  // Extract colors from Highcharts and filter out non-string colors
  const defaultColors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))', 'hsl(var(--chart-6))', 'hsl(var(--chart-7))', 'hsl(var(--chart-8))', 'hsl(var(--chart-9))', 'hsl(var(--chart-10))'];
  const colors = defaultColors.filter(color => typeof color === 'string') as string[];

  // Fallback to default colors if no valid colors are found
  const validColors = colors.length > 0 ? colors : defaultColors;

  // Map categories to their respective colors
  const categoryColors = data.reduce((acc, category, index) => {
    acc[category.name] = validColors[index % validColors.length];
    return acc;
  }, {} as { [key: string]: string });

  const options: Highcharts.Options = {
    chart: {
      type: 'pie',
      plotShadow: false,
      backgroundColor: 'transparent',
    },
    title: {
      text: '',
      align: 'center',
      style: {
        color: resolvedTheme === 'dark' ? '#ffffff' : '#000000',
      },
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
    accessibility: {
      point: {
        valueSuffix: '%',
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        clip: false,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          color: resolvedTheme === 'dark' ? '#ffffff' : '#000000',
          connectorWidth: 1,
          connectorPadding: 0,
          connectorShape: 'fixedOffset',
        },
        slicedOffset: 5,
        borderWidth: 0,
        borderRadius: 0,
        borderColor: resolvedTheme === 'dark' ? '#ffffff' : '#000000',
      },
    },
    series: [
      {
        name: 'Categories',
        colorByPoint: true,
        type: 'pie',
        data: data,
      } as SeriesPieOptions, // Cast the series to SeriesPieOptions
    ],
  };

  return (
    <div className="w-full mx-auto mt-3">
      <CardHeader className="space-y-2 flex justify-center items-center flex-col m-0 p-0">
        <CardTitle>Transaction Summary</CardTitle>
        <CardDescription>Overview of income and expenses</CardDescription>
      </CardHeader>
      <div className="flex flex-col lg:flex-row justify-center items-center w-full">
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="w-full">
            <HighchartsReact
              highcharts={Highcharts}
              options={options}
            />
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <div className="flex justify-center items-center flex-col gap-3 w-full mx-auto max-w-lg px-2.5">
            <div className="flex justify-center items-center gap-3">
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom</option>
              </select>
              {filter === 'custom' && (
                <div>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                  />
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                  />
                </div>
              )}
            </div>
            {Object.entries(categories).map(([category, { amount }]) => (
              <motion.div
                key={category}
                className="w-full flex items-center gap-2 text-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded bg-zinc-800 shrink-0">
                  <span className='text-white'>{category[0]}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between items-center gap-2">
                    <span className="truncate">{category}</span>
                    <span className="whitespace-nowrap">{((amount / totalAmount) * 100).toFixed(1)}%</span>
                  </div>
                  <div className='dark:bg-zinc-800 bg-zinc-200 rounded-full w-full'>
                    <div
                      className="h-1 rounded-full mt-1"
                      style={{
                        backgroundColor: categoryColors[category],
                        width: `${(amount / totalAmount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieChart;