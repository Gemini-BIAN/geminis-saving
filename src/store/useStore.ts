import { create } from 'zustand';
import { Transaction, Category } from '../types';
import { loadTransactions, saveTransactions, loadCategories, saveCategories, runMigrationsAndEnsureDefaults } from '../utils/storage';
import { defaultCategories } from '../utils/mockData';
import { generateId } from '../utils/format';

interface StoreState {
  transactions: Transaction[];
  categories: Category[];
  currentMonth: string;
  loading: boolean;
  
  initData: () => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (orderedIds: string[]) => void;
  setCurrentMonth: (month: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  transactions: [],
  categories: [],
  currentMonth: new Date().toISOString().slice(0, 7),
  loading: true,

  initData: () => {
    const { transactions, categories } = runMigrationsAndEnsureDefaults();
    set({ transactions, categories, loading: false });
  },

  addTransaction: (transaction) => {
    set((state) => {
      const newTransaction: Transaction = {
        ...transaction,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      const updatedTransactions = [...state.transactions, newTransaction];
      saveTransactions(updatedTransactions);
      return { transactions: updatedTransactions };
    });
  },

  updateTransaction: (id, updates) => {
    set((state) => {
      const updatedTransactions = state.transactions.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      );
      saveTransactions(updatedTransactions);
      return { transactions: updatedTransactions };
    });
  },

  deleteTransaction: (id) => {
    set((state) => {
      const updatedTransactions = state.transactions.filter((t) => t.id !== id);
      saveTransactions(updatedTransactions);
      return { transactions: updatedTransactions };
    });
  },

  addCategory: (category) => {
    set((state) => {
      const newCategory: Category = {
        ...category,
        id: generateId(),
      };
      const updatedCategories = [...state.categories, newCategory];
      saveCategories(updatedCategories);
      return { categories: updatedCategories };
    });
  },

  updateCategory: (id, updates) => {
    set((state) => {
      const updatedCategories = state.categories.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      );
      saveCategories(updatedCategories);
      return { categories: updatedCategories };
    });
  },

  deleteCategory: (id) => {
    set((state) => {
      const updatedCategories = state.categories.filter((c) => c.id !== id);
      saveCategories(updatedCategories);
      return { categories: updatedCategories };
    });
  },

  reorderCategories: (orderedIds) => {
    set((state) => {
      const orderedMap = new Map(orderedIds.map((id, index) => [id, index]));
      const updatedCategories = [...state.categories].sort((a, b) => {
        const ai = orderedMap.get(a.id);
        const bi = orderedMap.get(b.id);
        if (ai === undefined && bi === undefined) return 0;
        if (ai === undefined) return 1;
        if (bi === undefined) return -1;
        return ai - bi;
      });
      saveCategories(updatedCategories);
      return { categories: updatedCategories };
    });
  },

  setCurrentMonth: (month) => {
    set({ currentMonth: month });
  },
}));
