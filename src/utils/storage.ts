import { Transaction, Category } from '../types';
import { defaultCategories } from './mockData';

const TRANSACTIONS_KEY = 'finance_transactions';
const CATEGORIES_KEY = 'finance_categories';
const BACKUP_TRANSACTIONS_KEY = 'finance_transactions_backup';
const BACKUP_CATEGORIES_KEY = 'finance_categories_backup';
const SCHEMA_VERSION_KEY = 'finance_schema_version';
const CURRENT_SCHEMA_VERSION = 2;

function safeJsonParse<T>(data: string | null, fallback: T[]): T[] {
  if (!data) return fallback;
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

// 旧分类 ID 到新分类 ID 的映射
const CATEGORY_MIGRATIONS: Record<string, string> = {
  'cat-1': 'cat-ordering', // 旧「餐饮」→ 新「Ordering」(外食)
};

function migrateCategories(categories: Category[]): Category[] {
  return categories.map((c) => {
    // 如果分类 ID 在迁移表中，替换为新 ID
    if (CATEGORY_MIGRATIONS[c.id]) {
      return { ...c, id: CATEGORY_MIGRATIONS[c.id] };
    }
    return c;
  });
}

function migrateTransactions(transactions: Transaction[]): Transaction[] {
  return transactions.map((t) => {
    if (CATEGORY_MIGRATIONS[t.categoryId]) {
      return { ...t, categoryId: CATEGORY_MIGRATIONS[t.categoryId] };
    }
    return t;
  });
}

function ensureNewCategories(existing: Category[]): Category[] {
  // 确保所有默认分类都存在（id 匹配）
  const existingIds = new Set(existing.map((c) => c.id));
  const merged = [...existing];
  for (const def of defaultCategories) {
    if (!existingIds.has(def.id)) {
      merged.push(def);
    }
  }
  return merged;
}

function runMigrations() {
  const version = parseInt(localStorage.getItem(SCHEMA_VERSION_KEY) || '1', 10);

  if (version >= CURRENT_SCHEMA_VERSION) return;

  // 迁移分类
  const savedCategories = safeJsonParse<Category>(localStorage.getItem(CATEGORIES_KEY), []);
  if (savedCategories.length > 0) {
    let migrated = migrateCategories(savedCategories);
    migrated = ensureNewCategories(migrated);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(migrated));
  }

  // 迁移交易
  const savedTransactions = safeJsonParse<Transaction>(localStorage.getItem(TRANSACTIONS_KEY), []);
  if (savedTransactions.length > 0) {
    const migrated = migrateTransactions(savedTransactions);
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(migrated));
  }

  localStorage.setItem(SCHEMA_VERSION_KEY, String(CURRENT_SCHEMA_VERSION));
}

runMigrations();

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
    version: CURRENT_SCHEMA_VERSION,
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