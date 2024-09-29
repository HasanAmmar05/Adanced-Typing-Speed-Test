import React, { useState, useEffect } from 'react'
import TypingTest from './components/TypingTest'
import HighScores from './components/HighScores'
import ThemeToggle from './components/ThemeToggle'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    setIsDarkMode(savedTheme === 'dark')
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])


  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-white transition-colors duration-200 min-h-screen">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">Typing Speed Test</h1>
          <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        </header>
        <main>
          <TypingTest />
          <HighScores />
        </main>
      </div>
    </div>
  )
}

export default App