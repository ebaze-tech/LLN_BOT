// src/components/ChatBot.js
import React, { useState, useRef } from 'react'
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

  const mockAgenda = [
    { time: '10:00 AM', session: 'Opening Ceremony', location: 'Hall 1' },
    {
      time: '11:30 AM',
      session: 'Keynote: The Future of AI',
      location: 'Hall 2'
    },
    { time: '2:00 PM', session: 'Panel: Diversity in Tech', location: 'Hall 3' }
  ]

  const mockSpeakers = {
    'Tonye Cole': 'Founder of Andela, investor, and tech advocate.',
    'Doyin Oyeniyi':
      'Head of Product at Flutterwave, passionate about fintech innovation.'
  }

  const mockFAQs = {
    'Can I volunteer?':
      'Yes! Visit the Volunteer Desk at Hall 1 or email volunteer@lln2025.com',
    'Is there virtual attendance?':
      'No, LLN 2025 is in-person only. Stay tuned for recordings after the event!'
  }

  const fetchBotResponse = async userMessage => {
    const msg = userMessage.toLowerCase().trim()

    // 🗺️ Navigation Intent
    if (
      msg.includes('how do i get') ||
      msg.includes('directions') ||
      msg.includes('navigate')
    ) {
      return `📍 To reach Trinity Towers, VI, Lagos:\n\n🚗 By Car: (https://maps.google.com/?q=Trinity+Towers,+VI,+Lagos)\n🚌 By Bus: Take bus #7 to Victoria Island, alight at Chevron Junction\n🚶‍♂️ Walking: From Lekki Phase 1, it's 20 mins via Admiralty Way\n🚕 Ride-share: Use Bolt or Uber — drop-off point: Trinity Towers Main Entrance`
    }

    // 📅 Agenda Intent
    if (
      msg.includes('what') &&
      (msg.includes('happening') || msg.includes('now') || msg.includes('next'))
    ) {
      const now = new Date()
      const currentSession = mockAgenda.find(s => {
        const [hour, min] = s.time.split(':').map(Number)
        const sessionTime = new Date()
        sessionTime.setHours(hour, min, 0)
        return sessionTime <= now
      })

      if (currentSession) {
        return `Currently: *${currentSession.session}* in *${
          currentSession.location
        }*\n\nNext up: ${
          mockAgenda[mockAgenda.indexOf(currentSession) + 1]?.session ||
          'Nothing scheduled'
        } at ${
          mockAgenda[mockAgenda.indexOf(currentSession) + 1]?.time ||
          'the end of the day'
        }`
      } else {
        return (
          'No sessions are happening right now. Check the full agenda below:\n\n' +
          mockAgenda
            .map(s => `${s.time} — ${s.session} (${s.location})`)
            .join('\n')
        )
      }
    }

    // Speaker Intent
    if (
      msg.includes('who') &&
      (msg.includes('speaking') || msg.includes('about') || msg.includes('bio'))
    ) {
      const speakerName = Object.keys(mockSpeakers).find(name =>
        msg.includes(name.toLowerCase())
      )
      if (speakerName) {
        return `*${speakerName}*: ${mockSpeakers[speakerName]}`
      }
      return "I don't have info on that speaker yet. Try asking about Tonye Cole or Doyin Oyeniyi!"
    }

    // FAQ Intent
    const faqMatch = Object.keys(mockFAQs).find(q =>
      msg.includes(q.toLowerCase())
    )
    if (faqMatch) {
      return `*${faqMatch}*\n\n${mockFAQs[faqMatch]}`
    }

    // Fallback
    if (msg.includes('help') || msg.includes('stuck') || msg.includes('team')) {
      return "You seem stuck! Would you like to chat with a live team member? Just say 'Connect me to support'."
    }

    // Default response
    return "I'm still learning! Try asking about directions, today's agenda, speakers, or FAQs."
  }

  const handleSendMessage = async text => {
    if (!text.trim()) return

    const userMessage = {
      id: uuidv4(),
      text,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const botReply = await fetchBotResponse(text)

      const botMessage = {
        id: uuidv4(),
        text: botReply,
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
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
