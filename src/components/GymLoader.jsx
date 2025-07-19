import React from 'react';
import { Dumbbell, Activity, Zap, Target, Flame, Sparkles } from 'lucide-react';

const GymLoader = ({ size = 'default', text = 'Loading...', variant = 'dumbbells' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    default: 'w-16 h-16',
    large: 'w-24 h-24',
    xlarge: 'w-32 h-32'
  };

  const iconSizes = {
    small: 'w-4 h-4',
    default: 'w-6 h-6',
    large: 'w-8 h-8',
    xlarge: 'w-12 h-12'
  };

  const renderLoader = () => {
    switch (variant) {
      case 'dumbbells':
        return (
          <div className="relative">
            {/* Enhanced animated dumbbells with 3D effect */}
            <div className="flex items-center justify-center space-x-2">
              <div className={`${sizeClasses[size]} relative`}>
                {/* Left weight with gradient and shadow */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
                {/* Enhanced bar with metallic effect */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-1.5 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded-full shadow-inner"></div>
                {/* Right weight with gradient and shadow */}
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-full animate-pulse shadow-lg shadow-purple-500/50" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>
            {/* Enhanced bouncing animation with glow */}
            <div className="mt-3 flex justify-center space-x-2">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-bounce shadow-lg shadow-blue-400/50"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full animate-bounce shadow-lg shadow-purple-400/50" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full animate-bounce shadow-lg shadow-pink-400/50" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full animate-bounce shadow-lg shadow-orange-400/50" style={{ animationDelay: '0.3s' }}></div>
            </div>
          </div>
        );

      case 'pulse':
        return (
          <div className="relative">
            <div className={`${sizeClasses[size]} relative`}>
              {/* Multiple pulse rings with different colors */}
              <div className="absolute inset-0 border-4 border-blue-200/30 rounded-full animate-ping"></div>
              <div className="absolute inset-2 border-4 border-purple-200/30 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
              <div className="absolute inset-4 border-4 border-pink-200/30 rounded-full animate-ping" style={{ animationDelay: '0.6s' }}></div>
              {/* Center icon with glow effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-50 animate-pulse"></div>
                  <Dumbbell className={`${iconSizes[size]} text-white relative z-10 animate-pulse`} />
                </div>
              </div>
            </div>
          </div>
        );

      case 'spinner':
        return (
          <div className="relative">
            <div className={`${sizeClasses[size]} relative`}>
              {/* Multiple spinning rings with gradients */}
              <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin shadow-lg shadow-blue-500/30"></div>
              <div className="absolute inset-2 border-4 border-transparent border-t-purple-500 border-r-pink-500 rounded-full animate-spin shadow-lg shadow-purple-500/30" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              <div className="absolute inset-4 border-4 border-transparent border-t-pink-500 border-r-orange-500 rounded-full animate-spin shadow-lg shadow-pink-500/30" style={{ animationDuration: '2s' }}></div>
              {/* Center icon with 3D effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-md opacity-30 animate-pulse"></div>
                  <Activity className={`${iconSizes[size]} text-white relative z-10`} />
                </div>
              </div>
            </div>
          </div>
        );

      case 'weights':
        return (
          <div className="relative">
            <div className={`${sizeClasses[size]} flex items-center justify-center`}>
              {/* Enhanced stacked weights with 3D effect */}
              <div className="relative">
                {/* Bottom weight */}
                <div className="w-10 h-10 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 rounded-full border-2 border-gray-300 animate-bounce shadow-xl shadow-gray-500/50"></div>
                {/* Middle weight */}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-full border-2 border-blue-300 animate-bounce shadow-xl shadow-blue-500/50" style={{ animationDelay: '0.2s' }}></div>
                {/* Top weight */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 rounded-full border-2 border-purple-300 animate-bounce shadow-xl shadow-purple-500/50" style={{ animationDelay: '0.4s' }}></div>
                {/* Sparkle effect */}
                <div className="absolute -top-3 right-0">
                  <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
                </div>
              </div>
            </div>
            {/* Enhanced loading dots with glow */}
            <div className="mt-4 flex justify-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
              <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full animate-pulse shadow-lg shadow-purple-400/50" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full animate-pulse shadow-lg shadow-pink-400/50" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        );

      case 'energy':
        return (
          <div className="relative">
            <div className={`${sizeClasses[size]} flex items-center justify-center`}>
              {/* Enhanced energy burst animation */}
              <div className="relative">
                {/* Multiple energy rings with different colors */}
                <div className="absolute inset-0 w-full h-full border-3 border-blue-300/40 rounded-full animate-ping shadow-lg shadow-blue-300/30"></div>
                <div className="absolute inset-2 w-full h-full border-3 border-purple-300/40 rounded-full animate-ping shadow-lg shadow-purple-300/30" style={{ animationDelay: '0.3s' }}></div>
                <div className="absolute inset-4 w-full h-full border-3 border-pink-300/40 rounded-full animate-ping shadow-lg shadow-pink-300/30" style={{ animationDelay: '0.6s' }}></div>
                <div className="absolute inset-6 w-full h-full border-3 border-orange-300/40 rounded-full animate-ping shadow-lg shadow-orange-300/30" style={{ animationDelay: '0.9s' }}></div>
                {/* Center icon with energy effect */}
                <div className="relative z-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                  <Zap className={`${iconSizes[size]} text-yellow-400 relative z-10 animate-pulse`} />
                </div>
              </div>
            </div>
          </div>
        );

      case 'target':
        return (
          <div className="relative">
            <div className={`${sizeClasses[size]} relative`}>
              {/* Target rings with pulsing effect */}
              <div className="absolute inset-0 border-4 border-red-200/40 rounded-full animate-ping"></div>
              <div className="absolute inset-3 border-4 border-orange-200/40 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
              <div className="absolute inset-6 border-4 border-yellow-200/40 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
              {/* Center target with glow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-md opacity-50 animate-pulse"></div>
                  <Target className={`${iconSizes[size]} text-white relative z-10`} />
                </div>
              </div>
            </div>
          </div>
        );

      case 'flame':
        return (
          <div className="relative">
            <div className={`${sizeClasses[size]} flex items-center justify-center`}>
              {/* Animated flame effect */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-orange-400 via-red-500 to-pink-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
                <Flame className={`${iconSizes[size]} text-orange-500 relative z-10 animate-pulse`} />
                {/* Sparkle effects around flame */}
                <div className="absolute -top-2 -left-2">
                  <Sparkles className="w-2 h-2 text-yellow-400 animate-pulse" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-2 h-2 text-yellow-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <Sparkles className="w-2 h-2 text-yellow-400 animate-pulse" style={{ animationDelay: '0.6s' }} />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="relative">
            <div className={`${sizeClasses[size]} relative`}>
              {/* Default enhanced spinning dumbbell */}
              <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin shadow-lg shadow-blue-500/30"></div>
              <div className="absolute inset-2 border-4 border-transparent border-t-purple-500 border-r-pink-500 rounded-full animate-spin shadow-lg shadow-purple-500/30" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-md opacity-30 animate-pulse"></div>
                  <Dumbbell className={`${iconSizes[size]} text-white relative z-10 animate-pulse`} />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {renderLoader()}
      {text && (
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600 animate-pulse bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
            {text}
          </p>
        </div>
      )}
    </div>
  );
};

export default GymLoader; 