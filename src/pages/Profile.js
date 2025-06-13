import { motion } from 'framer-motion';
import { useStore } from '../store';

export const Profile = () => {
  const theme = useStore((state) => state.theme);
  const user = useStore((state) => state.user);
  const setTheme = useStore((state) => state.setTheme);
  const updateUser = useStore((state) => state.updateUser);

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleFacebookConnect = () => {
    if (user) {
      updateUser({ facebookConnected: !user.facebookConnected });
    }
  };

  return (
    <div
      className={`min-h-screen pb-16 ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Профиль */}
          <div
            className={`p-6 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}
          >
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full overflow-hidden">
                <img
                  src={user?.avatar || 'https://via.placeholder.com/80'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user?.username || 'User'}</h2>
                <p className="opacity-75">
                  {user?.tariff === 'company' ? 'Company Plan' : 'Freelancer Plan'}
                </p>
              </div>
            </div>
          </div>

          {/* Настройки */}
          <div
            className={`p-6 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}
          >
            <h3 className="text-xl font-bold mb-4">Settings</h3>
            <div className="space-y-4">
              {/* Тема */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm opacity-75">
                    Switch between light and dark theme
                  </p>
                </div>
                <button
                  onClick={handleThemeToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    theme === 'dark' ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Facebook */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Facebook Integration</p>
                  <p className="text-sm opacity-75">
                    Connect your Facebook account
                  </p>
                </div>
                <button
                  onClick={handleFacebookConnect}
                  className={`px-4 py-2 rounded-lg ${
                    user?.facebookConnected
                      ? theme === 'dark'
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-green-600 hover:bg-green-700'
                      : theme === 'dark'
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white transition-colors duration-200`}
                >
                  {user?.facebookConnected ? 'Connected' : 'Connect'}
                </button>
              </div>
            </div>
          </div>

          {/* Статистика */}
          <div
            className={`p-6 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}
          >
            <h3 className="text-xl font-bold mb-4">Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm opacity-75">Total Campaigns</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div>
                <p className="text-sm opacity-75">Active Campaigns</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <div>
                <p className="text-sm opacity-75">Total Spend</p>
                <p className="text-2xl font-bold">$1,234</p>
              </div>
              <div>
                <p className="text-sm opacity-75">ROI</p>
                <p className="text-2xl font-bold">245%</p>
              </div>
            </div>
          </div>

          {/* Выход */}
          <button
            className={`w-full py-3 rounded-lg ${
              theme === 'dark'
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-red-600 hover:bg-red-700'
            } text-white transition-colors duration-200`}
          >
            Sign Out
          </button>
        </motion.div>
      </div>
    </div>
  );
}; 