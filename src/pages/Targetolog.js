import { motion } from 'framer-motion';
import useStore from '../store';

export const Targetolog = () => {
  const theme = useStore((state) => state.theme);
  const campaigns = useStore((state) => state.campaigns);

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
          {/* Заголовок */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Targetolog</h1>
            <button
              className={`px-4 py-2 rounded-full ${
                theme === 'dark'
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white transition-colors duration-200`}
            >
              New Campaign
            </button>
          </div>

          {/* Фильтры */}
          <div
            className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}
          >
            <div className="flex flex-wrap gap-4">
              <select
                className={`px-3 py-2 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Paused</option>
              </select>
              <select
                className={`px-3 py-2 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <option>All Platforms</option>
                <option>Facebook</option>
                <option>Instagram</option>
              </select>
              <input
                type="text"
                placeholder="Search campaigns..."
                className={`px-3 py-2 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              />
            </div>
          </div>

          {/* Список кампаний */}
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } shadow-lg`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{campaign.name}</h3>
                    <p
                      className={`text-sm ${
                        campaign.status === 'active'
                          ? 'text-green-500'
                          : 'text-yellow-500'
                      }`}
                    >
                      {campaign.status}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm opacity-75">CTR</p>
                      <p className="font-semibold">
                        {campaign.stats.ctr.toFixed(2)}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm opacity-75">CPC</p>
                      <p className="font-semibold">
                        ${campaign.stats.cpc.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm opacity-75">CPM</p>
                      <p className="font-semibold">
                        ${campaign.stats.cpm.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}; 
