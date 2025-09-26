// src/components/ChatBot.js
import React, { useState } from 'react'
import MessageList from './MessageList'
import InputBox from './InputBox'
import { v4 as uuidv4 } from 'uuid'

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: uuidv4(),
      text: "👋 Hi there! I'm your LLN 2025 Concierge. Ask me about directions, the agenda, speakers, or FAQs!",
      sender: 'bot',
      timestamp: new Date()
    }
  ])

  const [isLoading, setIsLoading] = useState(false)

  const fetchBotResponse = async userMessage => {
    try {
      const response = await fetch(
        'https://linkedin-local-nigeria.onrender.com/chat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ question: userMessage })
        }
      )

      if (!response.ok) {
        if (response.status === 422) {
          const errorData = await response.json()
          throw new Error(errorData.detail?.[0]?.msg || 'Validation failed')
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data.answer || "I don't have an answer for that."
    } catch (error) {
      console.error('Error calling LLN chatbot API:', error)
      return "Sorry, I'm having trouble responding right now. Please try again."
    }
  }

  const handleSendMessage = async text => {
    if (!text.trim()) return

    const userMessage = {
      id: uuidv4(),
      text,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [
      ...prev,
      { id: uuidv4(), text, sender: 'user', timestamp: new Date() }
    ])
    setIsLoading(true)

    try {
      const botReply = await fetchBotResponse(text)

          setMessages(prev => [...prev, {
      id: uuidv4(),
      text: botReply, 
      sender: 'bot',
      timestamp: new Date(),
    }]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: uuidv4(),
          text: 'Oops! Something went wrong. Please try again or ask for help.',
          sender: 'bot',
          timestamp: new Date()
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50'>
      {/* Header */}
      <div className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 shadow-md'>
        <div className='flex items-center justify-between'>
          <h1 className='text-xl font-bold tracking-tight'>
            LLN 2025 Concierge
          </h1>
          <div className='flex items-center space-x-1 text-xs opacity-90'>
            <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
            <span>Live & Ready</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <MessageList messages={messages} isLoading={isLoading} />

      {/* Quick Reply Buttons */}
      <div className='px-4 pb-2 flex flex-wrap gap-2'>
        {[
          { label: '📍 Directions', query: 'How do I get to Trinity Towers?' },
          { label: '📅 Agenda', query: 'What’s happening now?' },
          { label: '🎤 Speakers', query: 'Who’s speaking on diversity?' },
          { label: '❓ FAQ', query: 'Can I volunteer?' }
        ].map((btn, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(btn.query)}
            disabled={isLoading}
            className='px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <InputBox onSend={handleSendMessage} disabled={isLoading} />
    </div>
  )
}

export default ChatBot
