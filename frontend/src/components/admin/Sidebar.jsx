import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, isMobile, setIsMobileOpen }) => {
  const menuItems = [
    { id: 'home', name: 'Home', icon: '🏠' },
    { id: 'users', name: 'Users', icon: '👥' },
    { id: 'agents', name: 'Agents', icon: '🤝' },
    { id: 'agencies', name: 'Agencies', icon: '🏢' },
    { id: 'verified-properties', name: 'Verified Properties', icon: '✅' },
    { id: 'unverified-properties', name: 'Unverified Properties', icon: '❌' }
  ];

  return (
    <div className={`bg-gray-800 text-white ${isMobile ? 'w-full h-full' : 'w-64 h-full'} lg:relative`}>
      {isMobile && (
        <button
          onClick={() => setIsMobileOpen(false)}
          className="absolute top-4 right-4 text-white text-2xl z-10"
        >
          ✕
        </button>
      )}
      
      <div className="p-4 lg:p-6">
        <h2 className="text-xl lg:text-2xl font-bold mb-6 lg:mb-8">Admin Panel</h2>
        <nav>
          <ul className="space-y-1 lg:space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    if (isMobile) setIsMobileOpen(false);
                  }}
                  className={`w-full text-left px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors flex items-center space-x-3 text-sm lg:text-base ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;