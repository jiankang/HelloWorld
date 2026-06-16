import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, BarChart3, Settings, Sparkles } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/learn', icon: Sparkles, label: '学习' },
  { path: '/library', icon: BookOpen, label: '词库' },
  { path: '/stats', icon: BarChart3, label: '统计' },
  { path: '/settings', icon: Settings, label: '设置' },
];

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-lg border-t border-white/10 z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;

          return (
            <Link
              key={path}
              to={path}
              className={`
                flex flex-col items-center justify-center w-16 h-full
                transition-all duration-200 relative
                ${isActive
                  ? 'text-yellow-400'
                  : 'text-white/50 hover:text-white/80'
                }
              `}
            >
              <Icon
                size={22}
                className={`mb-1 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}
              />
              <span className="text-xs font-medium">{label}</span>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-1 w-8 h-1 bg-yellow-400 rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
