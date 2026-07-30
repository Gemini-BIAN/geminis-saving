import { Transaction, Category } from '../types';
import { generateId } from './format';

export const defaultCategories: Category[] = [
  { id: 'cat-1', name: '餐饮', icon: 'UtensilsCrossed', color: '#F472B6', type: 'expense' },
  { id: 'cat-2', name: '交通', icon: 'Car', color: '#3B82F6', type: 'expense' },
  { id: 'cat-3', name: '购物', icon: 'ShoppingBag', color: '#FBBF24', type: 'expense' },
  { id: 'cat-4', name: '娱乐', icon: 'Gamepad2', color: '#A855F7', type: 'expense' },
  { id: 'cat-5', name: '住房', icon: 'Home', color: '#0D9488', type: 'expense' },
  { id: 'cat-6', name: '医疗', icon: 'Heart', color: '#EF4444', type: 'expense' },
  { id: 'cat-7', name: '教育', icon: 'BookOpen', color: '#14B8A6', type: 'expense' },
  { id: 'cat-8', name: '其他', icon: 'MoreHorizontal', color: '#6B7280', type: 'expense' },
  { id: 'cat-9', name: '工资', icon: 'Briefcase', color: '#22C55E', type: 'income' },
  { id: 'cat-10', name: '奖金', icon: 'Gift', color: '#F59E0B', type: 'income' },
  { id: 'cat-11', name: '投资收益', icon: 'TrendingUp', color: '#3B82F6', type: 'income' },
  { id: 'cat-12', name: '兼职', icon: 'Laptop', color: '#8B5CF6', type: 'income' },
  { id: 'cat-13', name: '其他收入', icon: 'Wallet', color: '#6B7280', type: 'income' },
];

const today = new Date();
const thisMonth = today.getMonth();
const thisYear = today.getFullYear();

export const mockTransactions: Transaction[] = [
  { id: generateId(), type: 'income', amount: 15000, categoryId: 'cat-9', note: '6月工资', date: `${thisYear}-${String(thisMonth + 1).padStart(2, '0')}-01`, createdAt: new Date().toISOString() },
  { id: generateId(), type: 'expense', amount: 2500, categoryId: 'cat-5', note: '房租', date: `${thisYear}-${String(thisMonth + 1).padStart(2, '0')}-02`, createdAt: new Date().toISOString() },
  { id: generateId(), type: 'expense', amount: 45, categoryId: 'cat-1', note: '午餐', date: `${thisYear}-${String(thisMonth + 1).padStart(2, '0')}-02`, createdAt: new Date().toISOString() },
  { id: generateId(), type: 'expense', amount: 32, categoryId: 'cat-1', note: '晚餐', date: `${thisYear}-${String(thisMonth + 1).padStart(2, '0')}-02`, createdAt: new Date().toISOString() },
  { id: generateId(), type: 'expense', amount: 150, categoryId: 'cat-2', note: '加油', date: `${thisYear}-${String(thisMonth + 1).padStart(2, '0')}-03`, createdAt: new Date().toISOString() },
  { id: generateId(), type: 'expense', amount: 299, categoryId: 'cat-3', note: '网购衣服', date: `${thisYear}-${String(thisMonth + 1).padStart(2, '0')}-03`, createdAt: new Date().toISOString() },
  { id: generateId(), type: 'expense', amount: 88, categoryId: 'cat-4', note: '电影票', date: `${thisYear}-${String(thisMonth + 1).padStart(2, '0')}-04`, createdAt: new Date().toISOString() },
  { id: generateId(), type: 'expense', amount: 52, categoryId: 'cat-1', note: '早餐', date: `${thisYear}-${String(thisMonth + 1).padStart(2, '0')}-04`, createdAt: new Date().toISOString() },
  { id: generateId(), type: 'expense', amount: 200, categoryId: 'cat-7', note: '书籍', date: `${thisYear}-${String(thisMonth + 1).padStart(2, '0')}-05`, createdAt: new Date().toISOString() },
  { id: generateId(), type: 'income', amount: 2000, categoryId: 'cat-12', note: '兼职收入', date: `${thisYear}-${String(thisMonth + 1).padStart(2, '0')}-05`, createdAt: new Date().toISOString() },
  { id: generateId(), type: 'expense', amount: 120, categoryId: 'cat-1', note: '聚餐', date: `${thisYear}-${String(thisMonth + 1).padStart(2, '0')}-06`, createdAt: new Date().toISOString() },
  { id: generateId(), type: 'expense', amount: 50, categoryId: 'cat-6', note: '买药', date: `${thisYear}-${String(thisMonth + 1).padStart(2, '0')}-06`, createdAt: new Date().toISOString() },
  { id: generateId(), type: 'expense', amount: 35, categoryId: 'cat-1', note: '下午茶', date: `${thisYear}-${String(thisMonth + 1).padStart(2, '0')}-07`, createdAt: new Date().toISOString() },
  { id: generateId(), type: 'expense', amount: 588, categoryId: 'cat-3', note: '电子产品', date: `${thisYear}-${String(thisMonth + 1).padStart(2, '0')}-08`, createdAt: new Date().toISOString() },
  { id: generateId(), type: 'expense', amount: 18, categoryId: 'cat-2', note: '地铁充值', date: `${thisYear}-${String(thisMonth + 1).padStart(2, '0')}-08`, createdAt: new Date().toISOString() },
];
