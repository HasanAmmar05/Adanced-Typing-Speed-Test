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
      <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-800 text-gray-800 dark:text-white transition-colors duration-200">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Typing Speed Test</h1>
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