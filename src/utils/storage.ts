import { Transaction, Category } from '../types';

const TRANSACTIONS_KEY = 'finance_transactions';
const CATEGORIES_KEY = 'finance_categories';
const BACKUP_TRANSACTIONS_KEY = 'finance_transactions_backup';
const BACKUP_CATEGORIES_KEY = 'finance_categories_backup';

function safeJsonParse<T>(data: string | null, fallback: T[]): T[] {
  if (!data) return fallback;
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export const loadTransactions = (): Transaction[] => {
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  const result = safeJsonParse<Transaction>(data, []);
  if (result.length > 0) return result;

  // 主数据为空，尝试从备份恢复
  const backup = localStorage.getItem(BACKUP_TRANSACTIONS_KEY);
  const backupResult = safeJsonParse<Transaction>(backup, []);
  if (backupResult.length > 0) {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(backupResult));
    return backupResult;
  }
  return [];
};

export const saveTransactions = (transactions: Transaction[]): void => {
  const data = JSON.stringify(transactions);
  // 先备份旧数据，再写入新数据
  const oldData = localStorage.getItem(TRANSACTIONS_KEY);
  if (oldData) {
    localStorage.setItem(BACKUP_TRANSACTIONS_KEY, oldData);
  }
  localStorage.setItem(TRANSACTIONS_KEY, data);
};

export const loadCategories = (): Category[] => {
  const data = localStorage.getItem(CATEGORIES_KEY);
  const result = safeJsonParse<Category>(data, []);
  if (result.length > 0) return result;

  // 主数据为空，尝试从备份恢复
  const backup = localStorage.getItem(BACKUP_CATEGORIES_KEY);
  const backupResult = safeJsonParse<Category>(backup, []);
  if (backupResult.length > 0) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(backupResult));
    return backupResult;
  }
  return [];
};

export const saveCategories = (categories: Category[]): void => {
  const data = JSON.stringify(categories);
  const oldData = localStorage.getItem(CATEGORIES_KEY);
  if (oldData) {
    localStorage.setItem(BACKUP_CATEGORIES_KEY, oldData);
  }
  localStorage.setItem(CATEGORIES_KEY, data);
};

export const exportData = (): string => {
  const data = {
    transactions: loadTransactions(),
    categories: loadCategories(),
    exportDate: new Date().toISOString(),
    version: 1,
  };
  return JSON.stringify(data, null, 2);
};

export const importData = (jsonString: string): { success: boolean; message: string } => {
  try {
    const data = JSON.parse(jsonString);
    if (!data.transactions || !data.categories) {
      return { success: false, message: '数据格式不正确，缺少交易或分类数据' };
    }
    if (!Array.isArray(data.transactions) || !Array.isArray(data.categories)) {
      return { success: false, message: '数据格式不正确，交易和分类必须是数组' };
    }
    saveTransactions(data.transactions);
    saveCategories(data.categories);
    return { success: true, message: `成功导入 ${data.transactions.length} 条交易和 ${data.categories.length} 个分类` };
  } catch {
    return { success: false, message: '数据解析失败，请确认是有效的 JSON 文件' };
  }
};