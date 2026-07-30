import { useEffect, useState } from 'react';
import { Calendar, TrendingUp, PieChart, BarChart3, ArrowUp, ArrowDown } from 'lucide-react';
import { useStore } from '../store/useStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Legend } from 'recharts';
import { formatCurrency, formatMonth } from '../utils/format';
import { Category } from '../types';

export const Statistics = () => {
  const { transactions, categories, currentMonth, setCurrentMonth, loading } = useStore();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [compareMonth, setCompareMonth] = useState('');

  useEffect(() => {
    setSelectedMonth(currentMonth);
  }, [currentMonth]);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
    setCurrentMonth(e.target.value);
  };

  const filteredTransactions = transactions.filter((t) => t.date.startsWith(selectedMonth));
  const compareTransactions = compareMonth ? transactions.filter((t) => t.date.startsWith(compareMonth)) : [];

  const monthlyIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const compareIncome = compareTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const compareExpense = compareTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const categoryStats = categories
    .filter((c) => c.type === 'expense')
    .map((category) => {
      const amount = filteredTransactions
        .filter((t) => t.categoryId === category.id)
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        name: category.name,
        amount,
        color: category.color,
        percentage: monthlyExpense > 0 ? Math.round((amount / monthlyExpense) * 100) : 0,
      };
    })
    .filter((stat) => stat.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const monthlyTrendData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(selectedMonth);
    date.setMonth(date.getMonth() - (5 - i));
    const monthKey = date.toISOString().slice(0, 7);
    const monthTransactions = transactions.filter((t) => t.date.startsWith(monthKey));
    const income = monthTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = monthTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return {
      month: `${date.getMonth() + 1}月`,
      income,
      expense,
      balance: income - expense,
    };
  });

  const generateMonthOptions = () => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = date.toISOString().slice(0, 7);
      options.push({ value, label: formatMonth(value) });
    }
    return options;
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number; color?: string }[] }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-gray-100">
          <p className="text-sm font-medium text-gray-800">{payload[0].name}</p>
          {payload.map((entry) => (
            <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
              {entry.name === 'income' ? '收入' : entry.name === 'expense' ? '支出' : '结余'}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">统计分析</h1>
          <p className="text-gray-500">查看你的财务数据</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="bg-transparent border-none outline-none text-gray-700 font-medium"
            >
              {generateMonthOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            <h2 className="text-lg font-semibold text-gray-800">月度对比</h2>
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-500 mb-2 block">选择对比月份</label>
            <select
              value={compareMonth}
              onChange={(e) => setCompareMonth(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 rounded-lg border-none outline-none text-gray-700"
            >
              <option value="">请选择</option>
              {generateMonthOptions()
                .filter((o) => o.value !== selectedMonth)
                .map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </select>
          </div>
          {compareMonth ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <span className="text-gray-600">收入</span>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-800">{formatCurrency(monthlyIncome)}</span>
                  <span className="font-medium text-gray-500">vs</span>
                  <span className="font-medium text-gray-800">{formatCurrency(compareIncome)}</span>
                  {compareIncome > 0 && (
                    <span className={`flex items-center gap-1 text-sm font-medium ${
                      monthlyIncome > compareIncome ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {monthlyIncome > compareIncome ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                      {Math.round(Math.abs((monthlyIncome - compareIncome) / compareIncome) * 100)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-pink-50 rounded-xl">
                <span className="text-gray-600">支出</span>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-800">{formatCurrency(monthlyExpense)}</span>
                  <span className="font-medium text-gray-500">vs</span>
                  <span className="font-medium text-gray-800">{formatCurrency(compareExpense)}</span>
                  {compareExpense > 0 && (
                    <span className={`flex items-center gap-1 text-sm font-medium ${
                      monthlyExpense < compareExpense ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {monthlyExpense < compareExpense ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
                      {Math.round(Math.abs((monthlyExpense - compareExpense) / compareExpense) * 100)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>选择一个月份进行对比</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-primary-500" />
            <h2 className="text-lg font-semibold text-gray-800">支出分类占比</h2>
          </div>
          {categoryStats.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={categoryStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="amount"
                    label={({ name, percent }) => `${name}: ${Math.round(percent * 100)}%`}
                    labelLine={{ strokeWidth: 1 }}
                  >
                    {categoryStats.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [formatCurrency(value as number), '金额']}
                    contentStyle={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>本月暂无支出记录</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-semibold text-gray-800">近6个月收支趋势</h2>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `¥${value / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="income" fill="#22C55E" name="收入" />
              <Bar dataKey="expense" fill="#F472B6" name="支出" />
              <Bar dataKey="balance" fill="#0D9488" name="结余" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {categoryStats.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">分类支出详情</h2>
          <div className="space-y-3">
            {categoryStats.map((stat) => (
              <div key={stat.name} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}>
                  <span className="text-sm font-bold" style={{ color: stat.color }}>{stat.percentage}%</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800">{stat.name}</span>
                    <span className="font-medium text-gray-600">{formatCurrency(stat.amount)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${stat.percentage}%`, backgroundColor: stat.color }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
