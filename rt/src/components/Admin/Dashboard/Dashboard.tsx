import React from 'react';

interface DashboardProps {
  stats: {
    totalUsers: number;
    totalProducts: number;
    totalCategories: number;
    totalPricingRules: number;
    totalOrders?: number;
  };
  onSectionChange?: (section: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, onSectionChange }) => {
  const statsCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: '👥',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      title: 'Products',
      value: stats.totalProducts,
      icon: '🌸',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'from-pink-50 to-pink-100'
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: '🗂️',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100'
    },
    {
      title: 'Pricing Rules',
      value: stats.totalPricingRules,
      icon: '💰',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100'
    },
    {
      title: 'Orders',
      value: stats.totalOrders || 0,
      icon: '📦',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100'
    }
  ];

  const quickActions = [
    {
      title: 'Product Inventory',
      description: 'Products management',
      icon: '🌸',
      color: 'from-teal-500 to-cyan-600',
      action: 'flowers'
    },
    {
      title: 'Manage Categories',
      description: 'Organize product categories',
      icon: '🗂️',
      color: 'from-green-500 to-emerald-600',
      action: 'categories'
    },
    {
      title: 'View Analytics',
      description: 'Check business performance',
      icon: '📊',
      color: 'from-blue-500 to-indigo-600',
      action: 'reports'
    },
    {
      title: 'Manage Users',
      description: 'User account management',
      icon: '👥',
      color: 'from-purple-500 to-violet-600',
      action: 'users'
    },
    {
      title: 'Order Management',
      description: 'Track and manage orders',
      icon: '📦',
      color: 'from-orange-500 to-amber-600',
      action: 'orders'
    },
    {
      title: 'Pricing Rules',
      description: 'Configure pricing and discounts',
      icon: '💰',
      color: 'from-yellow-500 to-yellow-600',
      action: 'pricing'
    },
    {
      title: 'Loyalty Program',
      description: 'Manage customer rewards',
      icon: '⭐',
      color: 'from-red-500 to-rose-600',
      action: 'loyalty'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Welcome to FlowerShop Admin</h1>
          <p className="text-blue-100 text-lg mb-4">Manage your flower shop with ease and efficiency</p>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>System Online</span>
            </div>
            <div>•</div>
            <div>Admin Portal v2.0</div>
            <div>•</div>
            <div>{new Date().toLocaleDateString()}</div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full transform -translate-x-24 translate-y-24"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statsCards.map((card, index) => (
          <div
            key={card.title}
            className={`bg-gradient-to-br ${card.bgColor} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-lg flex items-center justify-center shadow-lg`}>
                <span className="text-2xl">{card.icon}</span>
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <div
              key={action.title}
              onClick={() => onSectionChange && onSectionChange(action.action)}
              className="group cursor-pointer bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <span className="text-xl">{action.icon}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
              <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="text-xs text-blue-600 font-medium">Click to navigate →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
