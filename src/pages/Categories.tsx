import { useState } from 'react';
import { Plus, X, Check, UtensilsCrossed, Car, ShoppingBag, Gamepad2, Home, Heart, BookOpen, MoreHorizontal, Briefcase, Gift, TrendingUp, Laptop, Wallet } from 'lucide-react';
import { useStore } from '../store/useStore';
import { CategoryCard } from '../components/CategoryCard';
import { Category } from '../types';

const availableIcons = [
  { name: 'UtensilsCrossed', icon: UtensilsCrossed },
  { name: 'Car', icon: Car },
  { name: 'ShoppingBag', icon: ShoppingBag },
  { name: 'Gamepad2', icon: Gamepad2 },
  { name: 'Home', icon: Home },
  { name: 'Heart', icon: Heart },
  { name: 'BookOpen', icon: BookOpen },
  { name: 'MoreHorizontal', icon: MoreHorizontal },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'Gift', icon: Gift },
  { name: 'TrendingUp', icon: TrendingUp },
  { name: 'Laptop', icon: Laptop },
  { name: 'Wallet', icon: Wallet },
];

const availableColors = [
  '#F472B6', '#3B82F6', '#FBBF24', '#A855F7', '#0D9488',
  '#EF4444', '#14B8A6', '#6B7280', '#22C55E', '#F59E0B',
  '#8B5CF6', '#EC4899', '#0EA5E9', '#F97316', '#84CC16',
];

export const Categories = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useStore();
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: 'MoreHorizontal',
    color: '#6B7280',
    type: 'expense' as 'income' | 'expense',
  });

  const filteredCategories = categories.filter((c) => c.type === activeTab);

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        icon: category.icon,
        color: category.color,
        type: category.type,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        icon: 'MoreHorizontal',
        color: '#6B7280',
        type: activeTab,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      icon: 'MoreHorizontal',
      color: '#6B7280',
      type: activeTab,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, formData);
    } else {
      addCategory(formData);
    }
    handleCloseModal();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">分类管理</h1>
          <p className="text-gray-500">管理你的收支分类</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>添加分类</span>
        </button>
      </div>

      <div className="flex gap-2 bg-white rounded-xl p-2 shadow-sm">
        <button
          onClick={() => setActiveTab('expense')}
          className={`flex-1 py-3 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'expense'
              ? 'bg-pink-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          支出分类
        </button>
        <button
          onClick={() => setActiveTab('income')}
          className={`flex-1 py-3 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'income'
              ? 'bg-green-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          收入分类
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredCategories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={handleOpenModal}
            onDelete={deleteCategory}
          />
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <p className="text-gray-400 mb-4">暂无{activeTab === 'income' ? '收入' : '支出'}分类</p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700"
          >
            <Plus className="w-5 h-5" />
            添加分类
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {editingCategory ? '编辑分类' : '添加分类'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  分类名称
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="输入分类名称"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  图标
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {availableIcons.map((item) => {
                    const IconComponent = item.icon;
                    const isSelected = formData.icon === item.name;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: item.name })}
                        className={`p-3 rounded-xl transition-all duration-200 ${
                          isSelected
                            ? 'bg-primary-100 ring-2 ring-primary-500'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <IconComponent className={`w-5 h-5 ${isSelected ? 'text-primary-600' : 'text-gray-400'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  颜色
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-10 h-10 rounded-xl transition-all duration-200 ${
                        formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-3 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={!formData.name.trim()}
                  className={`flex-1 py-3 rounded-xl font-medium text-white transition-colors flex items-center justify-center gap-2 ${
                    formData.name.trim()
                      ? 'bg-primary-600 hover:bg-primary-700'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  <Check className="w-5 h-5" />
                  {editingCategory ? '保存修改' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
