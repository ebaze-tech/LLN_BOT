// src/components/MessageList.js
import React from 'react'
import Message from './Message'
import ScrollToBottom from 'react-scroll-to-bottom'

const MessageList = ({ messages, isLoading }) => {
  return (
    <ScrollToBottom
      className='flex-1 p-4 space-y-5 overflow-y-auto bg-gray-50/50'
      followButtonClassName='!bg-indigo-600 !text-white !rounded-full !p-2 !shadow-md hover:!bg-indigo-700 transition'
      scrollViewClassName='scroll-smooth'
    >
      {messages.length === 0 && (
        <div className='text-center text-gray-500 mt-10'>
          No messages yet. Say hello! 👋
        </div>
      )}

      {messages.map(msg => (
        <Message key={msg.id} message={msg} />
      ))}

      {/* Typing Indicator — More Elegant */}
      {isLoading && (
        <div className='flex items-start space-x-3 animate-fadeIn'>
          <div className='w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md'>
            AI
          </div>
          <div className='bg-white border border-gray-200 rounded-3xl px-5 py-3 shadow-sm max-w-xs'>
            <div className='flex space-x-1.5'>
              <div className='w-2 h-2 rounded-full bg-gray-400 animate-bounce'></div>
              <div
                className='w-2 h-2 rounded-full bg-gray-400 animate-bounce'
                style={{ animationDelay: '0.2s' }}
              ></div>
              <div
                className='w-2 h-2 rounded-full bg-gray-400 animate-bounce'
                style={{ animationDelay: '0.4s' }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </ScrollToBottom>
  )
}

export default MessageList
