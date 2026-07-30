import { useEffect, useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, Wallet, Calendar, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { StatCard } from '../components/StatCard';
import { TransactionCard } from '../components/TransactionCard';
import { formatCurrency, formatMonth } from '../utils/format';
import { Transaction, Category } from '../types';

export const Dashboard = () => {
  const { transactions, categories, currentMonth, setCurrentMonth, deleteTransaction, loading } = useStore();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  useEffect(() => {
    setSelectedMonth(currentMonth);
  }, [currentMonth]);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
    setCurrentMonth(e.target.value);
  };

  const filteredTransactions = transactions
    .filter((t) => t.date.startsWith(selectedMonth))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const monthlyIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyBalance = monthlyIncome - monthlyExpense;

  const recentTransactions = filteredTransactions.slice(0, 10);

  const getCategory = (categoryId: string): Category | undefined => {
    return categories.find((c) => c.id === categoryId);
  };

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
          <h1 className="text-2xl font-bold text-gray-800">财务概览</h1>
          <p className="text-gray-500">
            {formatMonth(selectedMonth)}的收支情况
          </p>
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
          <Link
            to="/add"
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">记一笔</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="总收入"
          value={formatCurrency(monthlyIncome)}
          icon={<ArrowUpCircle className="w-5 h-5 text-white" />}
          color="income"
        />
        <StatCard
          title="总支出"
          value={formatCurrency(monthlyExpense)}
          icon={<ArrowDownCircle className="w-5 h-5 text-white" />}
          color="expense"
        />
        <StatCard
          title="结余"
          value={formatCurrency(monthlyBalance)}
          icon={<Wallet className="w-5 h-5 text-white" />}
          color="balance"
        />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">近期交易</h2>
          <Link
            to="/stats"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            查看全部
          </Link>
        </div>
        
        {recentTransactions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Wallet className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>本月暂无交易记录</p>
            <Link
              to="/add"
              className="inline-block mt-4 text-primary-600 font-medium hover:text-primary-700"
            >
              记一笔
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((transaction: Transaction) => {
              const category = getCategory(transaction.categoryId);
              if (!category) return null;
              return (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  category={category}
                  onDelete={deleteTransaction}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
