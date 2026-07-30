import { Edit2, Trash2, Circle, ArrowUp, ArrowDown } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export const CategoryCard = ({ category, onEdit, onDelete, onMoveUp, onMoveDown, canMoveUp, canMoveDown }: CategoryCardProps) => {
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[category.icon] || Circle;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${category.color}20` }}
        >
          <IconComponent className="w-6 h-6" style={{ color: category.color }} />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-gray-800 truncate">{category.name}</p>
          <p className="text-xs text-gray-400">
            {category.type === 'income' ? '收入' : '支出'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onMoveUp}
          disabled={!canMoveUp}
          className={`p-2 rounded-lg transition-all duration-200 ${
            canMoveUp
              ? 'text-gray-400 hover:text-primary-500 hover:bg-primary-50'
              : 'text-gray-200 cursor-not-allowed'
          }`}
          aria-label="上移"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <button
          onClick={onMoveDown}
          disabled={!canMoveDown}
          className={`p-2 rounded-lg transition-all duration-200 ${
            canMoveDown
              ? 'text-gray-400 hover:text-primary-500 hover:bg-primary-50'
              : 'text-gray-200 cursor-not-allowed'
          }`}
          aria-label="下移"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(category)}
          className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-all duration-200"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(category.id)}
          className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};