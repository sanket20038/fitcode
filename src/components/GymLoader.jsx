import React from 'react';

const GymLoader = ({ text = 'Loading...' }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center min-h-screen w-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    >
      <img
        src="/lg.gif"
        className="w-72 h-72 md:w-[28rem] md:h-[28rem] rounded-2xl "
        alt="Loading..."
        style={{ objectFit: 'contain', background: 'transparent', border: 'none' }}
      />
      <div className="mt-4 flex space-x-2">
        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" />
        <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
      </div>
      {text && (
        <div className="text-center mt-2">
          <p className="text-lg font-medium text-gray-100 animate-pulse">
            {text}
          </p>
        </div>
      )}
    </div>
  );
};

export default GymLoader; 