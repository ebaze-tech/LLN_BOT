// src/components/InputBox.js
import React, { useState, useRef } from 'react'
import { FaPaperPlane, FaSmile } from 'react-icons/fa'

const InputBox = ({ onSend, disabled }) => {
  const [input, setInput] = useState('')
  const inputRef = useRef(null)

  const handleSubmit = e => {
    e.preventDefault()
    if (input.trim() && !disabled) {
      onSend(input)
      setInput('')
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='p-4 bg-white border-t border-gray-200'
    >
      <div className='flex items-center space-x-3'>
        <button
          type='button'
          className='p-2 text-gray-500 hover:text-indigo-600 transition rounded-full hover:bg-gray-100'
          aria-label='Emoji'
        >
          <FaSmile size={18} />
        </button>

        <input
          ref={inputRef}
          type='text'
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder='Type your message...'
          disabled={disabled}
          className='flex-1 border-none outline-none bg-gray-100 rounded-full px-6 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition shadow-sm disabled:bg-gray-100'
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
        />

        <button
          type='submit'
          disabled={disabled || !input.trim()}
          className='p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95'
          aria-label='Send message'
        >
          <FaPaperPlane size={18} />
        </button>
      </div>
    </form>
  )
}

export default InputBox
