import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  EyeIcon, 
  EyeSlashIcon, 
  LockClosedIcon, 
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
  ExclamationTriangleIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

interface SignupPageProps {
  onSignup: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    nationalId: string;
    password: string;
    confirmPassword: string;
  }) => void;
  isLoading?: boolean;
  error?: string;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignup, isLoading = false, error }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationalId: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    const clearValidationError = (field: string) => {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    };
    clearValidationError(field);
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }

    if (!formData.nationalId.trim()) {
      errors.nationalId = 'National ID is required';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSignup(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900 dark:from-gray-900 dark:via-violet-900 dark:to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-400/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-rose-400/30 to-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-indigo-400/25 to-blue-500/25 rounded-full blur-3xl animate-pulse delay-700"></div>
        
        {/* Floating particles */}
        <div className="absolute top-32 left-16 w-3 h-3 bg-cyan-300/60 rounded-full animate-bounce delay-200"></div>
        <div className="absolute top-20 right-40 w-4 h-4 bg-pink-300/50 rounded-full animate-bounce delay-600"></div>
        <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-emerald-300/70 rounded-full animate-bounce delay-900"></div>
        <div className="absolute bottom-32 right-32 w-5 h-5 bg-violet-300/40 rounded-full animate-bounce delay-400"></div>
        <div className="absolute top-1/3 left-20 w-3 h-3 bg-amber-300/50 rounded-full animate-bounce delay-800"></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* Logo and Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-emerald-500 via-cyan-600 to-blue-600 rounded-3xl shadow-2xl mb-6 relative transform hover:scale-105 transition-transform duration-300">
            <HeartIcon className="w-16 h-16 text-white animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-cyan-600 to-blue-600 rounded-3xl blur opacity-60 animate-pulse"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 rounded-3xl blur opacity-30 animate-spin-slow"></div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3 animate-pulse">Join MedLink</h1>
          <p className="text-xl font-medium bg-gradient-to-r from-rose-300 to-pink-300 bg-clip-text text-transparent">Your Healthcare Journey Starts Here</p>
        </motion.div>

        {/* Signup Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/10 dark:bg-gray-800/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8 relative overflow-hidden"
        >
          {/* Form background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-violet/5 rounded-3xl"></div>
          <div className="relative z-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-white/90">
                  <UserIcon className="w-4 h-4 mr-2 text-emerald-400" />
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full px-4 py-3 pl-12 border rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-white placeholder-white/60 ${
                    validationErrors.firstName || error ? 'border-red-400 bg-red-500/20' : 'border-white/30 hover:border-white/50 bg-white/10 hover:bg-white/20'
                  }`}
                  placeholder="Enter first name"
                  disabled={isLoading}
                />
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                {validationErrors.firstName && (
                  <p className="text-sm text-red-600 flex items-center animate-slide-up">
                    <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                    {validationErrors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <UserIcon className="w-4 h-4 mr-2 text-purple-600" />
                  Last Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-4 py-3 pl-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                      validationErrors.lastName || error ? 'border-red-300 bg-red-50/50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white/50 dark:bg-gray-700/50'
                    }`}
                    placeholder="Enter last name"
                    disabled={isLoading}
                  />
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {validationErrors.lastName && (
                  <p className="text-sm text-red-600 flex items-center animate-slide-up">
                    <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                    {validationErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <EnvelopeIcon className="w-4 h-4 mr-2 text-green-600" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 pl-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                    validationErrors.email || error ? 'border-red-300 bg-red-50/50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white/50 dark:bg-gray-700/50'
                  }`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
                <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {validationErrors.email && (
                <p className="text-sm text-red-600 flex items-center animate-slide-up">
                  <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Contact Fields Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Phone */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <PhoneIcon className="w-4 h-4 mr-2 text-orange-600" />
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 pl-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                      validationErrors.phone || error ? 'border-red-300 bg-red-50/50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white/50 dark:bg-gray-700/50'
                    }`}
                    placeholder="Enter phone number"
                    disabled={isLoading}
                  />
                  <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {validationErrors.phone && (
                  <p className="text-sm text-red-600 flex items-center animate-slide-up">
                    <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                    {validationErrors.phone}
                  </p>
                )}
              </div>

              {/* National ID */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <IdentificationIcon className="w-4 h-4 mr-2 text-indigo-600" />
                  National ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.nationalId}
                    onChange={(e) => handleInputChange('nationalId', e.target.value)}
                    className={`w-full px-4 py-3 pl-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                      validationErrors.nationalId || error ? 'border-red-300 bg-red-50/50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white/50 dark:bg-gray-700/50'
                    }`}
                    placeholder="Enter national ID"
                    disabled={isLoading}
                  />
                  <IdentificationIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {validationErrors.nationalId && (
                  <p className="text-sm text-red-600 flex items-center animate-slide-up">
                    <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                    {validationErrors.nationalId}
                  </p>
                )}
              </div>
            </div>

            {/* Password Fields Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <LockClosedIcon className="w-4 h-4 mr-2 text-red-600" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full px-4 py-3 pl-12 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                      validationErrors.password || error ? 'border-red-300 bg-red-50/50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white/50 dark:bg-gray-700/50'
                    }`}
                    placeholder="Create password"
                    disabled={isLoading}
                  />
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
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

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <LockClosedIcon className="w-4 h-4 mr-2 text-pink-600" />
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full px-4 py-3 pl-12 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                      validationErrors.confirmPassword || error ? 'border-red-300 bg-red-50/50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white/50 dark:bg-gray-700/50'
                    }`}
                    placeholder="Confirm password"
                    disabled={isLoading}
                  />
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="text-sm text-red-600 flex items-center animate-slide-up">
                    <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 animate-slide-up">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full bg-gradient-to-r from-emerald-500 via-cyan-600 to-blue-600 text-white py-4 px-4 rounded-xl font-bold text-lg hover:from-emerald-400 hover:via-cyan-500 hover:to-blue-500 focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="text-center">
              <p className="text-sm text-white/70">
                Already have an account?{' '}
                <button className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                  Sign in here
                </button>
              </p>
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
            🔒 Your data is protected with enterprise-grade security
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
