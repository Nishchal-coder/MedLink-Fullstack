import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BuildingOfficeIcon, 
  EyeIcon, 
  EyeSlashIcon, 
  LockClosedIcon, 
  UserIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface LoginPageProps {
  onLogin: (credentials: { username: string; password: string }) => void;
  isLoading?: boolean;
  error?: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, isLoading = false, error }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const handleInputChange = (field: 'username' | 'password', value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: { username?: string; password?: string } = {};

    if (!credentials.username.trim()) {
      errors.username = 'Username is required';
    }

    if (!credentials.password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onLogin(credentials);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-pink-400/30 to-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-white/20 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-cyan-300/40 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-pink-300/50 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-5 h-5 bg-purple-300/30 rounded-full animate-bounce delay-500"></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo and Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-3xl shadow-2xl mb-6 relative transform hover:scale-105 transition-transform duration-300">
            <BuildingOfficeIcon className="w-14 h-14 text-white animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-3xl blur opacity-60 animate-pulse"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-3xl blur opacity-30 animate-spin-slow"></div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-3 animate-pulse">MedLink</h1>
          <p className="text-xl font-medium bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">Secure Healthcare Access</p>
        </motion.div>

        {/* Login Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/10 dark:bg-gray-800/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8 relative overflow-hidden"
        >
          {/* Form background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-purple/5 rounded-3xl"></div>
          <div className="relative z-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-white/90">
                <UserIcon className="w-4 h-4 mr-2 text-cyan-400" />
                Username
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className={`w-full px-4 py-3 pl-12 border rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-white placeholder-white/60 ${
                  validationErrors.username || error ? 'border-red-400 bg-red-500/20' : 'border-white/30 hover:border-white/50 bg-white/10 hover:bg-white/20'
                }`}
                placeholder="Enter your username"
                disabled={isLoading}
              />
              {validationErrors.username && (
                <p className="text-sm text-red-600 flex items-center animate-slide-up">
                  <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                  {validationErrors.username}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-white/90">
                <LockClosedIcon className="w-4 h-4 mr-2 text-purple-400" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-4 py-3 pl-12 pr-12 border rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-white placeholder-white/60 ${
                    validationErrors.password || error ? 'border-red-400 bg-red-500/20' : 'border-white/30 hover:border-white/50 bg-white/10 hover:bg-white/20'
                  }`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-white/60 hover:text-white/90 transition-colors duration-200"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-sm text-red-600 flex items-center animate-slide-up">
                  <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-slide-up">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white py-4 px-4 rounded-xl font-bold text-lg hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="text-center">
              <p className="text-sm text-white/70">
                Demo Credentials:
              </p>
              <div className="mt-2 space-y-1 text-xs text-white/60">
                <p><strong>Username:</strong> superadmin</p>
                <p><strong>Password:</strong> admin123</p>
              </div>
            </div>
          </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            🔒 Protected by enterprise-grade security
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
