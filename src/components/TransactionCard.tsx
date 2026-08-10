import { Trash2, Circle } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Transaction, Category } from '../types';
import { formatCurrency, formatDate } from '../utils/format';

interface TransactionCardProps {
  transaction: Transaction;
  category: Category;
  onDelete: (id: string) => void;
}

export const TransactionCard = ({ transaction, category, onDelete }: TransactionCardProps) => {
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[category.icon] || Circle;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group">
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${category.color}20` }}
        >
          <IconComponent className="w-6 h-6" style={{ color: category.color }} />
        </div>
        <div>
          <p className="font-medium text-gray-800">{category.name}</p>
          <p className="text-sm text-gray-400">
            {formatDate(transaction.date)}
            {transaction.note ? ` · ${transaction.note}` : ''}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-lg font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-gray-800'}`}>
          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
        </span>
        <button
          onClick={() => onDelete(transaction.id)}
          className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
