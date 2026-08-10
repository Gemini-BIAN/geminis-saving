import { useState } from 'react';
import { ArrowLeft, Check, Calendar, Circle, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import * as Icons from 'lucide-react';
import { Category } from '../types';

export const AddTransaction = () => {
  const navigate = useNavigate();
  const { categories, transactions, addTransaction } = useStore();

  const today = new Date().toISOString().slice(0, 10);

  // 找到最近一条交易的日期，作为补记参考
  const lastTransactionDate = transactions.length
    ? [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date
    : null;

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(today);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isUsingLastDate = lastTransactionDate === date && date !== today;

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !categoryId) {
      return;
    }

    setIsSubmitting(true);
    
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    addTransaction({
      type,
      amount: parseFloat(amount),
      categoryId,
      note,
      date,
    });
    
    setIsSubmitting(false);
    navigate('/');
  };

  const getCategory = (id: string): Category | undefined => {
    return categories.find((c) => c.id === id);
  };

  const selectedCategory = getCategory(categoryId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">记一笔</h1>
          <p className="text-gray-500">记录你的收支</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setType('expense');
              setCategoryId('');
            }}
            className={`flex-1 py-3 rounded-xl font-medium transition-all duration-200 ${
              type === 'expense'
                ? 'bg-pink-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            支出
          </button>
          <button
            onClick={() => {
              setType('income');
              setCategoryId('');
            }}
            className={`flex-1 py-3 rounded-xl font-medium transition-all duration-200 ${
              type === 'income'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            收入
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              金额
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">
                ¥
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full pl-12 pr-4 py-4 text-3xl font-bold text-gray-800 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              分类
            </label>
            <div className="grid grid-cols-4 gap-3">
              {filteredCategories.map((category) => {
                const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[category.icon] || Circle;
                const isSelected = categoryId === category.id;
                
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setCategoryId(category.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 ${
                      isSelected
                        ? 'ring-2 ring-offset-2'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    style={{
                      backgroundColor: isSelected ? `${category.color}15` : undefined,
                      ['--tw-ring-color' as string]: isSelected ? category.color : undefined,
                    }}
                  >
                    <IconComponent
                      className="w-6 h-6"
                      style={{ color: isSelected ? category.color : '#9CA3AF' }}
                    />
                    <span className={`text-xs font-medium ${isSelected ? 'text-gray-800' : 'text-gray-500'}`}>
                      {category.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                日期
              </label>
              {lastTransactionDate && (
                <button
                  type="button"
                  onClick={() => setDate(lastTransactionDate)}
                  className={`text-xs flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
                    isUsingLastDate
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  <History className="w-3 h-3" />
                  {isUsingLastDate ? '已使用上次日期' : `上次日期：${lastTransactionDate}`}
                </button>
              )}
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
              <Calendar className="w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-gray-800 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              备注
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="添加备注..."
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none resize-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <button
            type="submit"
            disabled={!amount || !categoryId || isSubmitting}
            className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
              amount && categoryId && !isSubmitting
                ? type === 'expense'
                  ? 'bg-pink-500 hover:bg-pink-600 shadow-md hover:shadow-lg'
                  : 'bg-green-500 hover:bg-green-600 shadow-md hover:shadow-lg'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Check className="w-5 h-5" />
                保存
              </>
            )}
          </button>
        </form>
      </div>

      {selectedCategory && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            {(() => {
              const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[selectedCategory.icon] || Circle;
              return (
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${selectedCategory.color}20` }}
                >
                  <IconComponent className="w-5 h-5" style={{ color: selectedCategory.color }} />
                </div>
              );
            })()}
            <div>
              <p className="font-medium text-gray-800">{selectedCategory.name}</p>
              <p className="text-xs text-gray-400">
                {type === 'income' ? '收入分类' : '支出分类'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
