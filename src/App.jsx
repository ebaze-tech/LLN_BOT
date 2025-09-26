// App.js
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ChatBot from './components/ChatBot'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ChatBot />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
