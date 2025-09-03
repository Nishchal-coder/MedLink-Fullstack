import { motion } from 'framer-motion';

interface HealthProfileProps {
  profileData?: {
    lifestyle: {
      smoking: string;
      alcohol: string;
      exercise: string;
      diet: string;
    };
    medicalHistory: {
      allergies: string;
      medications: string;
      chronicConditions: string;
      previousSurgeries: string;
    };
    physicalInfo: {
      height: string;
      weight: string;
      bloodType: string;
    };
    completedDate: string;
  };
}

const HealthProfile: React.FC<HealthProfileProps> = ({ profileData }) => {
  const defaultData = {
    lifestyle: {
      smoking: 'never',
      alcohol: 'occasional',
      exercise: 'light',
      diet: 'vegetarian'
    },
    medicalHistory: {
      allergies: 'Allergic Rhinitis',
      medications: 'bp tablets 5mg',
      chronicConditions: 'high bp',
      previousSurgeries: 'leg surgery'
    },
    physicalInfo: {
      height: '150 cm',
      weight: '56 kg',
      bloodType: 'B+'
    },
    completedDate: '9/2/2025'
  };

  const data = profileData || defaultData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-blue-900 to-purple-900 dark:from-blue-950 dark:to-purple-950 border border-blue-700 dark:border-blue-800 rounded-2xl p-8 mb-8 shadow-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth="2" 
              stroke="currentColor" 
              className="h-6 w-6 text-white"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" 
              />
            </svg>
          </div>
          Initial Health Profile
        </h3>
        <span className="text-sm bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full font-medium shadow-lg">
          Completed {data.completedDate}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Lifestyle Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-4"
        >
          <h4 className="text-xl font-semibold text-blue-200 flex items-center">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
            Lifestyle
          </h4>
          <div className="space-y-3 text-gray-200">
            <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <strong className="text-blue-200">Smoking:</strong>
              <span className="text-white">{data.lifestyle.smoking}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <strong className="text-blue-200">Alcohol:</strong>
              <span className="text-white">{data.lifestyle.alcohol}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <strong className="text-blue-200">Exercise:</strong>
              <span className="text-white">{data.lifestyle.exercise}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <strong className="text-blue-200">Diet:</strong>
              <span className="text-white">{data.lifestyle.diet}</span>
            </div>
          </div>
        </motion.div>

        {/* Medical History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <h4 className="text-xl font-semibold text-purple-200 flex items-center">
            <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
            Medical History
          </h4>
          <div className="space-y-3 text-gray-200">
            <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <strong className="text-purple-200 block mb-1">Allergies:</strong>
              <span className="text-white">{data.medicalHistory.allergies}</span>
            </div>
            <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <strong className="text-purple-200 block mb-1">Medications:</strong>
              <span className="text-white">{data.medicalHistory.medications}</span>
            </div>
            <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <strong className="text-purple-200 block mb-1">Chronic Conditions:</strong>
              <span className="text-white">{data.medicalHistory.chronicConditions}</span>
            </div>
            <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <strong className="text-purple-200 block mb-1">Previous Surgeries:</strong>
              <span className="text-white">{data.medicalHistory.previousSurgeries}</span>
            </div>
          </div>
        </motion.div>

        {/* Physical Info Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4"
        >
          <h4 className="text-xl font-semibold text-green-200 flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
            Physical Info
          </h4>
          <div className="space-y-3 text-gray-200">
            <div className="flex justify-between items-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <strong className="text-green-200">Height:</strong>
              <span className="text-white text-lg font-medium">{data.physicalInfo.height}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <strong className="text-green-200">Weight:</strong>
              <span className="text-white text-lg font-medium">{data.physicalInfo.weight}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <strong className="text-green-200">Blood Type:</strong>
              <span className="text-white text-lg font-bold bg-gradient-to-r from-red-500 to-red-600 px-3 py-1 rounded-full">
                {data.physicalInfo.bloodType}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom accent */}
      <div className="mt-8 pt-6 border-t border-white/20">
        <div className="flex items-center justify-center text-gray-300 text-sm">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Health profile verified and secured
        </div>
      </div>
    </motion.div>
  );
};

export default HealthProfile;
