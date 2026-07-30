import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'income' | 'expense' | 'balance';
}

export const StatCard = ({ title, value, icon, trend, color }: StatCardProps) => {
  const colorClasses = {
    income: {
      bg: 'bg-gradient-to-br from-green-50 to-emerald-100',
      iconBg: 'bg-green-500',
      text: 'text-green-600',
    },
    expense: {
      bg: 'bg-gradient-to-br from-pink-50 to-rose-100',
      iconBg: 'bg-pink-500',
      text: 'text-pink-600',
    },
    balance: {
      bg: 'bg-gradient-to-br from-primary-50 to-teal-100',
      iconBg: 'bg-primary-500',
      text: 'text-primary-600',
    },
  };

  const classes = colorClasses[color];

  return (
    <div className={`${classes.bg} rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 ${classes.iconBg} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
        {trend && (
          <div className={`text-sm font-medium ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </div>
        )}
      </div>
      <p className="text-gray-500 text-sm mb-1">{title}</p>
      <p className={`text-2xl font-bold ${classes.text}`}>{value}</p>
    </div>
  );
};
