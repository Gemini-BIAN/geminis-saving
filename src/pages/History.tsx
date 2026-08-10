import { useMemo } from 'react';
import { ArrowLeft, Calendar, Search, Trash2, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { formatCurrency, formatDate } from '../utils/format';
import { Transaction, Category } from '../types';
import * as Icons from 'lucide-react';

interface GroupedTransactions {
  date: string;
  displayDate: string;
  transactions: Transaction[];
  dayTotal: number;
}

export const History = () => {
  const navigate = useNavigate();
  const { transactions, categories, deleteTransaction, loading } = useStore();

  const getCategory = (categoryId: string): Category | undefined => {
    return categories.find((c) => c.id === categoryId);
  };

  const groupedTransactions: GroupedTransactions[] = useMemo(() => {
    const sorted = [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const groups = new Map<string, Transaction[]>();
    sorted.forEach((t) => {
      const list = groups.get(t.date) || [];
      list.push(t);
      groups.set(t.date, list);
    });

    return Array.from(groups.entries()).map(([date, list]) => {
      const dayTotal = list
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        date,
        displayDate: formatDate(date),
        transactions: list,
        dayTotal,
      };
    });
  }, [transactions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/stats')}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">历史记录</h1>
          <p className="text-gray-500">按日期浏览全部收支明细</p>
        </div>
      </div>

      {groupedTransactions.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">暂无历史记录</p>
          <button
            onClick={() => navigate('/add')}
            className="mt-4 text-primary-600 font-medium hover:text-primary-700"
          >
            记一笔
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedTransactions.map((group) => (
            <div key={group.date} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary-500" />
                  <span className="font-semibold text-gray-800">{group.displayDate}</span>
                  <span className="text-xs text-gray-400">
                    {group.transactions.length} 笔
                  </span>
                </div>
                {group.dayTotal > 0 && (
                  <span className="text-sm font-medium text-gray-600">
                    支出 {formatCurrency(group.dayTotal)}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {group.transactions.map((transaction) => {
                  const category = getCategory(transaction.categoryId);
                  if (!category) return null;
                  const IconComponent =
                    (Icons as unknown as Record<
                      string,
                      React.ComponentType<{ className?: string }>
                    >)[category.icon] || Circle;

                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          <IconComponent
                            className="w-5 h-5"
                            style={{ color: category.color }}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{category.name}</p>
                          {transaction.note ? (
                            <p className="text-xs text-gray-400">{transaction.note}</p>
                          ) : (
                            <p className="text-xs text-gray-400">
                              {transaction.type === 'income' ? '收入' : '支出'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-semibold ${
                            transaction.type === 'income'
                              ? 'text-green-600'
                              : 'text-gray-800'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </span>
                        <button
                          onClick={() => deleteTransaction(transaction.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
