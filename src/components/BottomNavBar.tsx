import { Layers, BookOpen, Code2, Award, User } from 'lucide-react';
import { ActiveTab } from '../core/types';

interface BottomNavBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isVisible: boolean;
}

export function BottomNavBar({ activeTab, onTabChange, isVisible }: BottomNavBarProps) {
  if (!isVisible) return null;

  const tabs = [
    { id: 'tree', icon: Layers, label: 'Trilha' },
    { id: 'book', icon: BookOpen, label: 'Livro' },
    { id: 'sandbox', icon: Code2, label: 'Sandbox' },
    { id: 'shop', icon: Award, label: 'Loja' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ] as const;

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-40 bg-base-100 dark:bg-base-900 border-t-2 border-base-900 dark:border-base-700 md:hidden pb-[env(safe-area-inset-bottom)] shadow-lg"
      aria-label="Bottom Navigation"
    >
      <div className="flex justify-around items-center h-14 px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as ActiveTab)}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 space-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg transition-all ${
                isActive 
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold' 
                  : 'text-base-500 hover:text-base-800 dark:text-base-400 dark:hover:text-base-200'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} className={isActive ? 'scale-110 transition-transform' : ''} />
              <span className="text-[10px] font-sans font-semibold tracking-tight leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
