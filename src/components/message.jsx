// src/components/Message.js
import React from 'react';

const Message = ({ message }) => {
  const isBot = message.sender === 'bot';
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} items-end space-x-2 group`}>
      {!isBot && (
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold shadow-md flex-shrink-0">
          You
        </div>
      )}

      <div
        className={`rounded-3xl px-5 py-3 max-w-[85%] sm:max-w-md shadow-sm transition-all duration-200 group-hover:shadow-md ${
          isBot
            ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-md ml-2'
            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-md mr-2'
        }`}
      >
        <div className="text-sm leading-relaxed">{message.text}</div>
        <div
          className={`text-xs mt-1.5 opacity-80 ${
            isBot ? 'text-gray-500 text-left' : 'text-blue-100 text-right'
          }`}
        >
          {time}
        </div>
      </div>

      {isBot && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
          AI
        </div>
      )}
    </div>
  );
};

export default Message;