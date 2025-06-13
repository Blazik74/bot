import { motion } from 'framer-motion';
import { useStore } from '../store';

const tariffs = [
  {
    id: 'freelancer',
    name: 'Freelancer',
    price: 49,
    features: [
      'Up to 5 campaigns',
      'Basic analytics',
      'Email support',
      'Facebook integration',
    ],
  },
  {
    id: 'company',
    name: 'Company',
    price: 149,
    features: [
      'Unlimited campaigns',
      'Advanced analytics',
      'Priority support',
      'All platform integrations',
      'Custom reporting',
      'API access',
    ],
  },
];

export const Tariffs = () => {
  const theme = useStore((state) => state.theme);
  const user = useStore((state) => state.user);
  const updateUser = useStore((state) => state.updateUser);

  const handleSelectTariff = (tariffId) => {
    if (user) {
      updateUser({ tariff: tariffId });
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
          className="space-y-8"
        >
          {/* Заголовок */}
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Choose Your Plan</h1>
            <p className="text-lg opacity-75">
              Select the perfect plan for your business needs
            </p>
          </div>

          {/* Тарифы */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {tariffs.map((tariff) => (
              <motion.div
                key={tariff.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } shadow-lg`}
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">{tariff.name}</h2>
                  <div className="text-4xl font-bold mb-2">
                    ${tariff.price}
                    <span className="text-lg opacity-75">/month</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-6">
                  {tariff.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        className={`w-5 h-5 mr-2 ${
                          theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectTariff(tariff.id)}
                  className={`w-full py-3 rounded-lg ${
                    user?.tariff === tariff.id
                      ? theme === 'dark'
                        ? 'bg-gray-700'
                        : 'bg-gray-200'
                      : theme === 'dark'
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white transition-colors duration-200`}
                  disabled={user?.tariff === tariff.id}
                >
                  {user?.tariff === tariff.id ? 'Current Plan' : 'Select Plan'}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Дополнительная информация */}
          <div
            className={`p-6 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-lg max-w-4xl mx-auto`}
          >
            <h3 className="text-xl font-bold mb-4">All Plans Include</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Security</h4>
                <p className="text-sm opacity-75">
                  Enterprise-grade security and data protection
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Updates</h4>
                <p className="text-sm opacity-75">
                  Regular updates and new features
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Support</h4>
                <p className="text-sm opacity-75">
                  24/7 customer support via email
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}; 