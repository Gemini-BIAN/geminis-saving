import { Wallet, Plus, BarChart3, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Wallet, label: '首页' },
    { path: '/add', icon: Plus, label: '记账' },
    { path: '/stats', icon: BarChart3, label: '统计' },
    { path: '/categories', icon: Settings, label: '分类' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 safe-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-all duration-200 ${
                isActive ? 'text-primary-600' : 'text-gray-400'
              }`}
            >
              <Icon className={`w-6 h-6 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
